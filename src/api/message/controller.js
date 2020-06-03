import { merge } from 'lodash'
import { success, notFound } from 's/response'
import { Message } from '.'

// Get all
export const getAll = async (
	{ querymen: { query, select, cursor }, user, permission },
	res,
	next
) => {
	try {
		const messages = await Message.paginate(query, select, cursor, {
			permission,
			populate: 'author'
		})
		await success(res)(messages)
	} catch (error) {
		next(error)
	}
}

// Get One
export const getOne = async ({ params: { id }, permission }, res, next) => {
	try {
		const message = await Message.findById(id).lean()
		await notFound(res)(message)
		await success(res)(message ? permission.filter(message) : null)
	} catch (error) {
		next(error)
	}
}

// Post
export const create = async ({ bodymen: { body }, permission }, res, next) => {
	try {
		const message = await Message.create(body)
		await success(res, 201)(permission.filter(message.toObject()))
	} catch (error) {
		next(error)
	}
}

// Put
export const update = async (
	{ bodymen: { body }, params, permission },
	res,
	next
) => {
	try {
		const message = await Message.findById(params.id)
		await notFound(res)(message)
		message => (message ? merge(message, body).save() : null)
		await success(
			res,
			204
		)(message ? permission.filter(message.toObject()) : null)
	} catch (error) {
		next(error)
	}
}

// Delete
export const destroy = async ({ params: { id }, permission }, res, next) => {
	try {
		const message = await Message.findById(id)
		await notFound(res)(message)
		message ? await message.remove() : null
		await success(
			res,
			204
		)(message ? permission.filter(message.toObject()) : null)
	} catch (error) {
		next(error)
	}
}
