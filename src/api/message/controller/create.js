import { success, notFound } from 's/response'
import { Message } from './../'

export const create = async ({ bodymen: { body } }, res, next) => {
	try {
		const message = await Message.create(body)
		await success(res, 201)(message.view())
	} catch (error) {
		next(error)
	}
}
