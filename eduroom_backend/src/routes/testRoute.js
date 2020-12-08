const express = require('express')
const router = express.Router()
const { test } = require('../controllers/testController')
const sendEmail = require('../utils/sendMail.js')
const { uploadToGCSHandler, uploadToLocalHandler } = require('../middleware/multer')

router.get('/', test)
router.get('/mail', async (req, res, next) => {
	sendEmail({ email: 'test@test.com', subject: 'Test SMTP Server', message: 'Woah' })
	res.status(200).json({ success: true })
})

// Upload Handler
// uploadToLocalHandler -> Use when you have to manipuate the file before upload to Google Cloud Storage (I will update how to upload later)
// uploadToGCSHandler() -> Use when no manipulation is required -> File in form-data are uploaded directly to GCS.

router.post('/multerGCS', uploadToGCSHandler('test1/'), (req, res) => {
	// res.send({ linkURL: req.files[0].linkUrl });
	res.send(req.files)
	// This is what you can get in req.files
	// [
	//     {
	//         fieldname: <Field that we use in form-data>
	//         linkUrl: <URL to that file>
	//         contentType: <Type of that file>
	//     }
	// ]
})

router.post('/multerLocal', uploadToLocalHandler(), (req, res) => {
	res.send(req.files)
	// This is what you can get in req.files
	// [
	//     {
	//         fieldname: <Field that we use in form-data>
	//         path: <path of that file>
	//         mimetype: <Type of that file>
	//     }
	// ]
})

module.exports = router
