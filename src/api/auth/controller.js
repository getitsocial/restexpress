import { sign } from 's/jwt'
import { success } from 's/response'

export const login = async ({ user }, res, next) => {
	try {
		const token = await sign(user.id)
		await success(res, 201)({ token, user: user.view(true) })
	} catch (error) {
		next()
	}
}
