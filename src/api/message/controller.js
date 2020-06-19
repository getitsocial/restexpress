import { merge } from 'lodash'
import { success, notFound } from 's/response'
import { Message } from '.'
import httpContext from 'express-http-context'
// Get all
export const getAll = async ({ querymen, user }, res, next) => {
    try {
        const messages = await Message.paginate(querymen, {
            populate: [{ path: 'author', select: { name: 1, email: 1 } }]
        })
        await success(res)(messages)
    } catch (error) {
        return next(error)
    }
}

// Get One
export const getOne = async ({ params: { id } }, res, next) => {
    try {
        const message = await Message.findById(id).lean()
        await notFound(res)(message)
        await success(res)(message)
    } catch (error) {
        return next(error)
    }
}

// Post
export const create = async ({ bodymen: { body }, permission }, res, next) => {
    try {
        const message = await Message.create(body)
        await success(res, 201)(message.toJSON())
    } catch (error) {
        return next(error)
    }
}

// Put
export const update = async ({ bodymen: { body }, user, params, permission }, res, next) => {
    Message.findOneAndUpdate({ _id: params.id }, body, {
        new: true
    }).then(async (result) => {
        await success(res, 200)(result)
    }).catch((error) => {
        return next(error)
    })
}

// Delete
export const destroy = async ({ params: { id } }, res, next) => {
    try {
        await Message.deleteOne({ _id: id })
        await success(res, 204)
    } catch (error) {
        return next(error)
    }
}
