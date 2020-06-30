import { PasswordReset } from '.'
import { OK, NO_CONTENT, NOT_FOUND, FORBIDDEN, BAD_REQUEST } from 'http-status-codes'
import User from 'a/user/model'
import { sendPasswordResetMail } from 's/sendgrid'

export const show = async ({ params: { token } }, res, next) => {
    try {
        const reset = await PasswordReset.findOne({ token }).populate('user')

        if (!reset || !reset.user) {
            res.status(BAD_REQUEST).end()
            return
        }
        const { picture, name } = reset.user

        res.status(OK).json({ picture, name })

    } catch (error) {
        return next(error)
    }
}

export const create = async ({ bodymen: { body: { email } } }, res, next) => {
    try {
        const user = await User.findOne({ email })

        if (!user) {
            // We don't want to allow user enumeration, thats why we return NO_CONTENT instead of NOT_FOUND.
            // This endpoint should be monitored
            res.status(NO_CONTENT).end()
            return
        }

        const reset = await PasswordReset.create({ user: user._id })
        const { token } = reset
        await sendPasswordResetMail({ to: email, name: user.name, token })

        res.status(NO_CONTENT).end()

    } catch (error) {
        return next(error)
    }

}
/*
    TODO:
    Figure out how we can destroy all sessions which the user might still have.
    Solution 1:
    Have an additional storage (mongo, redis) which can match users to a set of tokens

    Solution 2:
    Only allow active session on one device. Could be kinda annoying.
    I don't think this is a good idea. (Use _id as jti)

    Solution 2:
    Fuck redis, lets just use something like connect-mongo. ONE DATABASE TO RULE THEM ALL!
*/
export const update = async ({ bodymen: { body: { password }}, params: { token } }, res, next) => {

    try {
        const { user } = await PasswordReset.findOne({ token }).populate('user') ?? {}

        if (!user || !user.verified) {
            // Is 403 the right code? We should also monitor this endpoint closely
            res.status(FORBIDDEN).end()
            return
        }

        await user.set({ password }).save()
        await PasswordReset.deleteOne({ user })

        res.status(NO_CONTENT).end()

    } catch (error) {
        return next(error)
    }

}