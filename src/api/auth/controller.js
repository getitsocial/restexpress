import { success, notFound } from 's/response'
import model from '~/api/user/model'
import { sign, decodeJWT, destroy, comparePassword, providerAuth } from 's/auth'

/**
 * @throws {BadRequestError} 400 Error - invalid email or password
 */
const errorHandler = (res, next) => next()

const signHandler = async (user, res) => {
	// Sign Token
	const token = await sign(user)
	const { _id, role } = await decodeJWT(token)

	// Send response
	success(res)({ _id, role, token })
}

export const authenticate = async ({ body: { email, password } }, res, next) => {
	// Pass value
	try {
		// Find user
		const user = await model.findOne({ email })
		await notFound(res)(user)

		if (!user.verified)
			res
				.status(401)
				.json({ valid: false, message: 'You E-mail is not verified' })
				.end()

		// Compare password
		const comparedPassword = comparePassword(password, user.password)
		if (!comparedPassword) {
			return errorHandler(res, next)
		}

		// Sign in user
		await signHandler(user, res)
	} catch (error) {
		next(error)
	}
}

export const providerAuthenticate = async ({ body, params }, res, next) => {
	// Pass values
	const { provider } = params
	const { token } = body

	try {
		// Get user from external provider
		const providerUser = await providerAuth[provider](token)
		const user = await model.createFromService(providerUser)

		// Sign in user
		await signHandler(user, res)
	} catch (error) {
		next(error)
	}
}

export const logout = async (req, res, next) => {
	try {
		await destroy(req)
		res.send('success')
	} catch (error) {
		next()
	}
}
