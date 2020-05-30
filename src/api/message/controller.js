import { merge } from 'lodash'
import { success, notFound } from '../../services/response/'
import { Message } from '.'

export const create = async ({ user, body }, res, next) => {
	try {
		const message = await Message.create({ ...body, user })
		await success(res, 201)(message.view())
	} catch (error) {
		next()
	}
}

export const index = async (
	{ querymen: { query, select, cursor } },
	res,
	next
) => {
	try {
		const messages = await Message.find(query, select, cursor)
		await success(res)(messages.map(message => message.view()))
	} catch (error) {
		next()
	}
}

export const show = async ({ params: { id } }, res, next) => {
	try {
		const message = await Message.findById(id)
		await notFound(res)(message)
		await success(res)(message ? message.view() : null)
	} catch (error) {
		next()
	}
}

export const update = async ({ user, body, params: { id } }, res, next) => {
	try {
		const message = await Message.findById(id)
		await notFound(res)(message)
		message => (message ? merge(message, body).save() : null)
		await success(res)(message ? message.view(true) : null)
	} catch (error) {
		next()
	}
}

export const destroy = async ({ params: { id } }, res, next) => {
	try {
		const message = await Message.findById(id)
		await notFound(res)(message)
		message ? await message.remove() : null
		await success(res, 204)(message)
	} catch (error) {
		next()
	}
}
