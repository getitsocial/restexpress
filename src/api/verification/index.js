import { Router } from 'express'
import { schema } from './model'
export Verification, { schema } from './model'

import {
    verify
} from './controller'

const router = new Router()
const { token } = schema.tree

/**
 * Verify a user
 *
 * @name User Verification
 * @route {GET} /api/verification/:token
 * @routeparam {String} :token is the unique identifier for the verification flow
 */
router.get('/:token', verify)

export default router
