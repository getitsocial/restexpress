import { merge } from 'lodash'
import { success, notFound } from 's/response'
import { Message } from './../'

export const update = async ({ bodymen: { body }, params }, res, next) => {
	try {
		const message = await Message.findById(params.id)
		await notFound(res)(message)
		message => (message ? merge(message, body).save() : null)
		await success(res)(message ? message.view(true) : null)
	} catch (error) {
		next(error)
	}
}
