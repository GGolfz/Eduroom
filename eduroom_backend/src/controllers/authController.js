const bcrypt = require('bcryptjs')
const pool = require('../database/db')
const crypto = require('crypto')
const dayjs = require('dayjs')
const { v4: uuidv4 } = require('uuid')
const { generateCookieJWT } = require('../utils/jwt')
const sendEmail = require('../utils/sendMail')
const errorHandler = require('../middleware/error')
const { getDefailtProfilePic } = require('../utils/cloudStorage')
const { prependOnceListener } = require('process')
const ErrorResponse = require('../utils/errorResponse')
exports.getProfile = async (req, res, next) => {
	try {
		// UserID is in req.user.id
		if (req.user) {
			const result = await pool.query(`SELECT * from user_profile where userid = '${req.user.id}'`)
			//init role of user
			let user = { ...result.rows[0], id: req.user.id, role: 'general' }

			//get email of user
			let email = ''
			let isVerify = false
			const localEmail = await pool.query('SELECT email from local_auth where userid = $1', [req.user.id])

			if (localEmail.rowCount !== 0) {
				email = localEmail.rows[0].email
				const verify = await pool.query(
					'SELECT * FROM user_verification WHERE userid = $1 AND isverified = $2',
					[req.user.id, true]
				)
				isVerify = verify.rowCount == 1
			} else {
				const oauthEmail = await pool.query('SELECT email from oauth where userid = $1', [req.user.id])
				email = oauthEmail.rows[0].email
				isVerify = true
			}
			user = { ...user, email, verify: isVerify }

			//get isInstructor of user
			const result2 = await pool.query('SELECT isverified from instructor where userid = $1', [req.user.id])
			if (result2.rowCount !== 0) {
				user = { ...user, role: 'instructor', isverified: result2.rows[0].isverified }
			}
			res.send(user)
		} else {
			return next(new ErrorResponse('Unauthorize', 401))
		}
	} catch (error) {
		return next(new ErrorResponse(error,500))
	}
}

exports.regisController = async (req, res) => {
	try {
		// {
		//     email: <String>
		//     password: <String>
		//     firstname: <String>
		//     lastname: <String>
		// }
		const user = req.body
		// Find existing user in db
		const existingUser = await pool.query(`SELECT email FROM local_auth WHERE email = '${user.email}'`)
		if (existingUser.rowCount != 0) {
			const err = {
				statusCode: 400,
				message: 'Email is used',
			}
			return errorHandler(err, req, res)
		}
		// Insert new user_profile
		user.password = bcrypt.hashSync(user.password)
		const userId = uuidv4()
		const defaultProfilePic = getDefailtProfilePic()
		console.log(defaultProfilePic)
		const user_profileCreationQuery = `INSERT INTO user_profile (userid, firstname, lastname, birthdate, initial, phoneno, displayname, bio, avatar, createat, updateat) 
        VALUES ('${userId}', '${user.firstname}', '${user.lastname}', '1970-01-01', $1, $1, $1, $1, '${defaultProfilePic}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
		await pool.query(user_profileCreationQuery, [''])

		// Create local_auth
		const local_authCreationQuery = `INSERT INTO local_auth (userid, email, password) 
                                        VALUES ('${userId}', '${user.email}', '${user.password}')`
		await pool.query(local_authCreationQuery)
		// Create verification token and send it in email
		const verifyToken = crypto.randomBytes(20).toString('hex')
		const user_verificationCreationQuery = `INSERT INTO user_verification (userid, starttime, endtime, token, isverified)
        VALUES ('${userId}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + (120 * interval '1 minute'), '${verifyToken}', false)`
		await pool.query(user_verificationCreationQuery)

		const verifyUrl = `${process.env.ENTRYPOINT_URL}/verify/${verifyToken}`
		const emailOptions = {
			email: user.email,
			subject: 'Eduroom Email Verification',
			htmlMessage: `Please Verify your email by click <a href="${verifyUrl}">here</a>.`,
		}
		await sendEmail(emailOptions)
		// Generate JWT for user to login
		const token = generateCookieJWT(userId)
		res.cookie('jwt', token)
		res.status(201).send({ success: true })
	} catch (error) {
		const err = {
			statusCode: 500,
			message: error,
		}
		return errorHandler(err, req, res)
	}
}

exports.verifyEmailController = async (req, res) => {
	try {
		// Verify token in db
		const token = req.params.token
		const user_verification = await pool.query(`SELECT * FROM user_verification WHERE token = '${token}'`)
		if (user_verification.rowCount != 1) {
			const err = {
				statusCode: 400,
				message: 'Token is not found',
			}
			return errorHandler(err, req, res)
		}
		// Check if token is expired
		const endTimestamp = dayjs(user_verification.rows[0].endtime)
		const nowTimestamp = dayjs()
		if (nowTimestamp.isAfter(endTimestamp)) {
			// Should redirect to token expire page
			const err = {
				statusCode: 400,
				message: 'token is expired',
			}
			return errorHandler(err, req, res)
		}
		await pool.query(`UPDATE user_verification SET isverified = true WHERE token = '${token}'`)
		// TODO: Should redirect to verification success page
		res.status(200).json({ success: true })
	} catch (error) {
		// TODO: Should redirect to verification error page
		const err = {
			statusCode: 500,
			message: error,
		}
		return errorHandler(err, req, res)
	}
}

exports.loginController = async (req, res, next) => {
	try {
		// {
		//     email: <String>
		//     password: <String>
		// }
		//TODO: Find user and compare password using bcrypt
		const localAuth = await pool.query(`SELECT * FROM local_auth WHERE email = '${req.body.email}'`)
		if (localAuth.rowCount != 1) {
			const err = {
				statusCode: 400,
				message: 'Email or password is incorrect',
			}
			return errorHandler(err, req, res)
		}
		const passwordMatch = await bcrypt.compare(req.body.password, localAuth.rows[0].password)
		if (!passwordMatch) {
			const err = {
				statusCode: 400,
				message: 'Email or password is incorrect',
			}
			return errorHandler(err, req, res)
		}
		const userId = localAuth.rows[0].userid
		const isVerify = await pool.query('SELECT * FROM user_verification WHERE userid = $1 AND isverified = $2', [
			userId,
			true,
		])
		let verify = isVerify.rowCount == 1
		const token = generateCookieJWT(userId)
		res.cookie('jwt', token)
		res.status(200).send({ success: true, isVerify: verify })
	} catch (error) {
		// TODO: Should redirect to verification error page
		const err = {
			statusCode: 500,
			message: error,
		}
		return errorHandler(err, req, res)
	}
}

exports.logoutController = (req, res) => {
	res.clearCookie('jwt')
	res.status(200).send({ success: true })
}

exports.googleCallbackController = async (req, res) => {
	try {
		let user = {
			displayName: req.user.displayName,
			firstname: req.user.name.givenName,
			lastname: req.user.name.familyName,
			email: req.user._json.email,
			picture: req.user._json.picture,
			provider: req.user.provider,
		}
		//TODO: Find or add user in db
		const existingUser = await pool.query(`SELECT userid FROM oauth WHERE email = '${user.email}'`)
		if (existingUser.rowCount != 0) {
			return res.redirect(process.env.ENTRYPOINT_URL)
		}
		// Add user to user_profile
		const userId = uuidv4()
		const user_profileCreationQuery = `INSERT INTO user_profile (userid, firstname, lastname, birthdate, initial, phoneno, displayname, bio, avatar, createat, updateat) 
          VALUES ('${userId}', '${user.firstname}', '${user.lastname}', '1970-01-01', $1, $1, '${user.displayName}', $1, '${user.picture}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
		await pool.query(user_profileCreationQuery, [''])

		// Add user to OAuth
		const oauthCreationQuery = `INSERT INTO oauth (email, token, userid) VALUES ('${user.email}', '', '${userId}')`
		await pool.query(oauthCreationQuery)

		const token = generateCookieJWT(userId)
		res.cookie('jwt', token)
		res.redirect(process.env.ENTRYPOINT_URL)
	} catch (error) {
		const err = {
			statusCode: 500,
			message: error,
		}
		return errorHandler(err, req, res)
	}
}
