import { success, notFound } from 's/response'
import { Message } from './../'

export const getAll = async (
	{ querymen: { query, select, cursor } },
	res,
	next
) => {
	try {
		const messages = await Message.find(query, select, cursor)
		console.log(messages)
		await success(res)(messages.map(message => message.view()))
	} catch (error) {
		next(error)
	}
}

export const getOne = async ({ params: { id } }, res, next) => {
	try {
		const message = await Message.findById(id)
		await notFound(res)(message)
		await success(res)(message ? message.view() : null)
	} catch (error) {
		next(error)
	}
}
