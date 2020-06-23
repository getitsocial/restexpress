import { Verification } from '.'
import { NOT_FOUND, NO_CONTENT } from 'http-status-codes'

export const verify = async ({ params: { token } }, res, next) => {
    try {
        const verification = await Verification.findOne({ token }).populate('user')

        if (!verification || !verification.user) {
            res.status(NOT_FOUND).end()
            return
        }

        await verification.user.set({ verified: true }).save()

        await verification.remove()

        res.status(NO_CONTENT).end()
    } catch (error) {
        return next(error)
    }
}