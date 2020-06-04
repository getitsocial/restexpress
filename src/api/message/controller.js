import { merge } from 'lodash'
import { success, notFound } from 's/response'
import { Message } from '.'

// Get all
export const getAll = async ({ querymen, user, permission }, res, next) => {
	try {
		const messages = await Message.paginate(querymen, {
			permission,
			populate: 'author'
		})
		await success(res)(messages)
	} catch (error) {
		return next(error)
	}
}

// Get One
export const getOne = async ({ params: { id }, permission }, res, next) => {
	try {
		const message = await Message.findById(id).lean()
		await notFound(res)(message)
		await success(res)(permission.filter(message))
	} catch (error) {
		return next(error)
	}
}

// Post
export const create = async ({ bodymen: { body }, permission }, res, next) => {
	try {
		const message = await Message.create(body)
		await success(res, 201)(permission.filter(message.toJSON()))
	} catch (error) {
		return next(error)
	}
}

// Put
export const update = async (
	{ bodymen: { body }, params, permission },
	res,
	next
) => {
	try {
		const message = await Message.findOneAndUpdate({ _id: params.id }, body)
		await success(res, 204)(permission.filter(message.toJSON()))
	} catch (error) {
		return next(error)
	}
}

// Delete
export const destroy = async ({ params: { id }, permission }, res, next) => {
	try {
		await Message.deleteOne({ _id: id })
		await success(res, 204)
	} catch (error) {
		return next(error)
	}
}
