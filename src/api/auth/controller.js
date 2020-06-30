import User from '~/api/user/model'
import { sign, decodeJWT, destroy, comparePassword, providerAuth } from 's/auth'
import { OK, NOT_FOUND, UNAUTHORIZED, NO_CONTENT, BAD_REQUEST } from 'http-status-codes'
import { extractToken } from 's/auth/utils'

const signHandler = async ({ user, session, sessionStore, sessionID }, res) => {
    // Sign Token
    const token = await sign(user)
    const { _id, role } = await decodeJWT(token)

    console.log(sessionUser)
    // Set session informations
    session.userId = _id
    session.token = token

    res.status(OK).json({ _id, role, token})
}

export const authenticate = async ({ body: { email, password }, session, sessionStore, sessionID }, res, next) => {
    // Pass value
    try {
        // Find user
        const user = await User.findOne({ email })

        if (!user) {
            // We do not want to tell the user that the email doesnt exist...
            res.status(UNAUTHORIZED).json({ valid: false, message: 'Wrong password or E-mail' }).end()
            return
        }

        if (!user.verified) {
            res.status(UNAUTHORIZED).json({ valid: false, message: 'Your E-mail is not verified' }).end()
            return
        }

        // Compare password
        const comparedPassword = await comparePassword(user.password, password)
        if (!comparedPassword) {
            res.status(UNAUTHORIZED).json({ valid: false, message: 'Wrong password or E-mail' }).end()
            return
        }

        // Sign in user
        await signHandler({user, session, sessionStore, sessionID}, res)
    } catch (error) {
        next(error)
    }
}

export const providerAuthenticate = async ({ body, params }, res, next) => {
    // Pass values
    const { provider } = params
    const { token } = body

    try {
        // Get user from external provider
        const providerUser = await providerAuth[provider](token)
        const user = await User.createFromService(providerUser)

        // Sign in user
        await signHandler(user, res)
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        if (extractToken(req) == null) {
            res.status(BAD_REQUEST).end()
            return
        }
        await destroy(req)
        res.status(NO_CONTENT).end()
    } catch (error) {
        next(error)
    }
}
