import { User } from '.'
import { NOT_FOUND, OK, CREATED, FORBIDDEN, NO_CONTENT, CONFLICT } from 'http-status-codes'

const isConflict = error => error.code === 11000

export const index = async ({ querymen, user, method }, res, next) => {
    try {
        const users = await User.paginate(querymen, { method, user, filter: true })

        res.status(OK).json(users)
    } catch (error) {
        return next(error)
    }
}

export const show = async ({ user: { role }, method, params }, res, next) => {
    try {
        const user = await User.findById(params.id)

        if (!user) {
            res.status(NOT_FOUND).end()
            return
        }

        res.status(OK).json(user.filter({ role, method }))
    } catch (error) {
        return next(error)
    }
}

export const showMe = async ({ user: { _id, role }, method }, res) => {
    try {
        const user = await User.findById(_id )

        if (!user) {
            res.status(NOT_FOUND).end()
            return
        }

        res.status(OK).json(user.filter({ role, method }))
    } catch (error) {
        return next(error)
    }
}

export const create = async ({ bodymen: { body }, method, user }, res, next) => {
    try {
        const doc = await User.create(body)
        res.status(CREATED).json(doc.filter({ role: user?.role, method }))
    } catch (error) {
        if (isConflict(error)) {
            res.status(CONFLICT).end()
        }
        return next(error)
    }
}

export const update = async ({ bodymen: { body }, params, user, method }, res, next) => {
    try {
        const doc = await User.findById(params.id)

        if (!doc) {
            res.status(NOT_FOUND).end()
            return
        }

        if (!User.isOwner(doc, user)) {
            res.status(FORBIDDEN).end()
            return
        }

        await doc.set(body).save()

        res.status(OK).json(doc.filter({ role: user.role, method }))
    } catch (error) {
        return next(error)
    }
}

export const updatePassword = async ({ bodymen: { body }, params, user }, res, next) => {
    try {
        const doc = await User.findById(params.id)

        if (!doc) {
            res.status(NOT_FOUND).end()
            return
        }

        if (!User.isOwner(doc, user)) {
            res.status(FORBIDDEN).end()
            return
        }

        await doc.set(body).save()

        res.status(NO_CONTENT).end()
    } catch (error) {
        return next(error)
    }
}

export const destroy = async ({ user, params: { id } }, res, next) => {
    try {
        const doc = await User.findById(id)

        if (!doc) {
            res.status(NOT_FOUND).end()
            return
        }

        if (!User.isOwner(doc, user)) {
            res.status(FORBIDDEN).end()
            return
        }

        await User.deleteOne({ _id: id})

        res.status(NO_CONTENT).end()
    } catch (error) {
        return next(error)
    }
}
