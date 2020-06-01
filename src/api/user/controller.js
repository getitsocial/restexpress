import { success, notFound } from 's/response/'
import { User } from '.'

export const index = async (
	{ querymen: { query, select, cursor } },
	res,
	next
) => {
	try {
		const users = await User.find(query, select, cursor)
		await success(res)(users => users.map(user => user.view()))
	} catch (error) {
		next(error)
	}
}

export const show = async ({ params }, res, next) => {
	try {
		const user = await User.findById(params.id)
		await success(res)(user ? user.view() : null)
	} catch (error) {
		next(error)
	}
}

export const showMe = async ({ user: { _id } }, res) => {
	try {
		const user = await User.findById(_id)
		await success(res)(user ? user.view(true) : null)
	} catch (error) {
		next(error)
	}
}

export const create = async ({ bodymen: { body } }, res, next) => {
	try {
		const user = await User.create(body)
		success(res, 201)(user.view(true))
	} catch (error) {
		/* istanbul ignore else */
		if (error.name === 'MongoError' && error.code === 11000) {
			res.status(409).json({
				valid: false,
				param: 'email',
				message: 'email already registered'
			})
		} else {
			next(error)
		}
	}
}

export const update = async (
	{ bodymen: { body }, params, user },
	res,
	next
) => {
	try {
		const result = await User.findById(params.id === 'me' ? user.id : params.id)
		await notFound(res)(result)

		const isAdmin = user.role === 'admin'
		const isSelfUpdate = user.id === result.id
		if (!isSelfUpdate && !isAdmin) {
			res.status(401).json({
				valid: false,
				message: 'You can\'t change other user\'s data'
			})
		}
		result => (result ? merge(result, body).save() : null)
		await success(res)(result ? result.view(true) : null)
	} catch (error) {
		next(error)
	}
}

export const updatePassword = async (
	{ bodymen: { body }, params, user },
	res,
	next
) => {
	try {
		const result = await User.findById(params.id === 'me' ? user.id : params.id)
		await notFound(res)(result)
		const isSelfUpdate = user.id === result.id
		if (!isSelfUpdate) {
			res.status(401).json({
				valid: false,
				param: 'password',
				message: 'You can\'t change other user\'s password'
			})
		}
		result => (result ? user.set({ password: body.password }).save() : null)
		await success(res)(result ? result.view(true) : null)
	} catch (error) {
		next(error)
	}
}

export const destroy = async ({ params }, res, next) => {
	try {
		const user = await User.findById(params.id)
		await notFound(res)(user)
		result => (result ? user.remove() : null)
		await success(res, 204)
	} catch (error) {
		next(error)
	}
}
