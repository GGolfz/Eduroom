import React, { Fragment, useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import style from '../../styles/landing/login'
import Image from 'next/image'
import UserContext from '../../contexts/user/userContext'

const Content = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [emailError, setEmailError] = useState('')
	const [passwordError, setPasswordError] = useState('')
	const [loading, setLoading] = useState(false)
	const userContext = useContext(UserContext)
	const { loginUser } = userContext
	const loginError = userContext.err
	const router = useRouter()
	const handleEmail = (e) => {
		if (e.target.value.length === 0) setEmailError('Email is required')
		else setEmailError('')
		setEmail(e.target.value)
	}
	const handlePassword = (e) => {
		if (e.target.value.length === 0) setPasswordError('Password is required')
		else setPasswordError('')
		setPassword(e.target.value)
	}
	const handleLogin = async () => {
		const body = { email, password }
		setLoading(true)
		await loginUser(body, router)
		setLoading(false)
	}
	const googleLogin = async () => {
		window.location.pathname = '/api/auth/google'
	}

	return (
		<Fragment>
			<div className="login">
				<div className="login-content">
					<div className="login-header">
						WELCOME BACK <br />
					</div>
					<div className="login-description">
						new here?
						<Link href="/register">
							<span className="register-link">create an account</span>
						</Link>
					</div>
					<div className="login-form">
						<form onSubmit={(e) => e.preventDefault()}>
							<label>
								<input className="login-textfield" type="text" placeholder="Email" onChange={(e) => handleEmail(e)} />
								<div className="error">{emailError}</div>
							</label>
							<label>
								<input
									className="login-textfield"
									type="password"
									placeholder="Password"
									onChange={(e) => handlePassword(e)}
								/>
								<div className="error">{passwordError}</div>
							</label>
							<div className="error">{loginError}</div>

							<button
								className="login-button"
								disabled={loading}
								style={loading ? { opacity: '0.6' } : {}}
								onClick={handleLogin}
							>
								<span className="login-button-text">Log In</span>
							</button>
							<div className="or-text">
								<div className="striaght-line"></div>
								<span className="or-text-text">or</span>
								<div className="striaght-line"></div>
							</div>
							<button className="login-google-button" onClick={googleLogin}>
								<div className="login-google-button-text">
									<img src="/images/google-logo.png" alt="google-icon" className="google-logo" />
									<span>Sign In With Google</span>
								</div>
							</button>
						</form>
					</div>
				</div>
				<div style={{ marginLeft: '5%' }}>
					<Image className="login-page-img" alt="login-page-img" src="/images/login-img.svg" width="544" height="450" />
				</div>
			</div>
			<style jsx>{style}</style>
		</Fragment>
	)
}

export async function getServerSideProps(context) {
	console.log(context.req.headers.referer)
}

export default Content
