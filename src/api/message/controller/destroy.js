import { success, notFound } from 's/response'
import { Message } from './../'

export const destroy = async ({ params: { id } }, res, next) => {
	try {
		const message = await Message.findById(id)
		await notFound(res)(message)
		message ? await message.remove() : null
		await success(res, 204)(message)
	} catch (error) {
		next(error)
	}
}
