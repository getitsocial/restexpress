import { success, notFound } from 's/response/'
import { User } from '.'

export const index = async ({ querymen, permission }, res, next) => {
	try {
		const users = await User.paginate(querymen, {
			permission,
			populate: 'author'
		})
		await success(res)(users)
	} catch (error) {
		return next(error)
	}
}

export const show = async ({ params, permission }, res, next) => {
	try {
		const user = await User.findById(params.id).lean()
		await success(res)(permission.filter(user))
	} catch (error) {
		return next(error)
	}
}

export const showMe = async ({ user: { _id }, permission }, res) => {
	try {
		const user = await User.findById(_id).lean()
		await success(res)(permission.filter(user))
	} catch (error) {
		return next(error)
	}
}

export const create = async ({ bodymen: { body }, permission }, res, next) => {
	try {
		const user = await User.create(body)
		success(res, 201)(permission.filter(user))
	} catch (error) {
		/* istanbul ignore else */
		if (error.name === 'MongoError' && error.code === 11000) {
			res.status(409).json({
				valid: false,
				param: 'email',
				message: 'email already registered'
			})
		} else {
			return next(error)
		}
	}
}

export const update = async (
	{ bodymen: { body }, params, user, permission },
	res,
	next
) => {
	try {
		const result = await User.findOneAndUpdate({ _id: params.id }, body)
		await success(res, 204)(permission.filter(result.toJSON()))
	} catch (error) {
		return next(error)
	}
}

export const updatePassword = async (
	{ bodymen: { body }, params, user, permission },
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
		await success(res)(permission.filter(result))
	} catch (error) {
		return next(error)
	}
}

export const destroy = async ({ params }, res, next) => {
	try {
		await User.deleteOne({ _id: id })
		await success(res, 204)
	} catch (error) {
		return next(error)
	}
}
