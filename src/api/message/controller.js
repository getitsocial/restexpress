import { merge } from 'lodash'
import { success, notFound } from 's/response'
import { Message } from '.'
import { OK, NOT_FOUND, CREATED, FORBIDDEN, NO_CONTENT } from 'http-status-codes'

const isDocumentOwner = (doc, user) => doc.author.toString() === user._id || doc.author?._id.toString() === user._id || user.role === 'admin'

// Get all
export const index = async ({ querymen, user, method }, res, next) => {
    try {
        const messages = await Message.paginate(querymen, {
            populate: [{ path: 'author' }],
            method,
            user
        })

        res.status(OK).json(messages)
    } catch (error) {
        return next(error)
    }
}

// Get One
export const show = async ({ params: { id }, method, user }, res, next) => {
    try {
        const message = await Message.findById(id).populate('author')

        if (!message) {
            res.status(NOT_FOUND).end()
            return
        }

        res.status(OK).json(message.filter({ role: user?.role, method }))
    } catch (error) {
        return next(error)
    }
}

// Post
export const create = async ({ bodymen: { body }, method, user }, res, next) => {
    try {
        const message = await Message.create(body)

        res.status(CREATED).json(message.filter({ role: user?.role, method }))
    } catch (error) {
        return next(error)
    }
}

// Put
export const update = async ({ bodymen: { body }, user, method, params: { id } }, res, next) => {
    try {
        const message = await Message.findById(id).populate('author')

        if (!message) {
            res.status(NOT_FOUND).end()
            return
        }

        if (!isDocumentOwner(message, user)) {
            res.status(FORBIDDEN).end()
            return
        }

        await message.set(body).save()

        res.status(OK).json(message.filter({ role: user?.role, method }))
    } catch (error) {
        return next(error)
    }
}

// Delete
export const destroy = async ({ params: { id }, user }, res, next) => {
    try {
        const message = await Message.findById(id)

        if (!message) {
            res.status(NOT_FOUND).end()
            return
        }

        if (!isDocumentOwner(message, user)) {
            res.status(FORBIDDEN).end()
            return
        }

        await message.deleteOne({ _id: id})

        res.status(NO_CONTENT).end()
    } catch (error) {
        return next(error)
    }
}
