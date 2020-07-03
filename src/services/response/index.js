import { INTERNAL_SERVER_ERROR } from 'http-status-codes'
const production = process.env.NODE_ENV === 'production'

import { log } from 's/logger'

export const errorHandler = (res, error) => {

    if (production) {
        log(error)
    } else {
        console.error(error)
    }

    res.status(INTERNAL_SERVER_ERROR).json({
        valid: false,
        message: production ? res.__('error') : error.toString()
    })
}