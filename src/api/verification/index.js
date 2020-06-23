import { Router } from 'express'
import { schema } from './model'
export Verification, { schema } from './model'

import {
    verify
} from './controller'

const router = new Router()
const { token } = schema.tree

/**
 * @api {get} /verification/:id Verify Email
 * @apiName VerifyEmail
 * @apiGroup User
 * @apiPermission guest
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 token not found.
 */
router.get('/:token', verify)

export default router
