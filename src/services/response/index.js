import bugsnag from '@bugsnag/js'
import { INTERNAL_SERVER_ERROR } from 'http-status-codes'
const production = process.env.NODE_ENV === 'production'

export const errorHandler = (res, error) => {
    if (production) {
        bugsnag.notify(error)
    }
    res.status(INTERNAL_SERVER_ERROR).json({
        valid: false,
        message: production ? res.__('error') : error.toString()
    })
}