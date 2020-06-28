import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { masterman, validateUserBeforeCreate } from 's/auth'
import { schema } from './model'
export User, { schema } from './model'

import {
    index,
    showMe,
    show,
    create,
    update,
    updatePassword,
    destroy
} from './controller'

const router = new Router()
const { email, password, name, picture, role } = schema.tree

/**
 * @api {get} /users Retrieve users
 * @apiName RetrieveUsers
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object[]} users List of users.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError {Object} 403 admin access only.
 * @apiPermission admin
 */
router.get('/', query(), index)

/**
 * @api {get} /users/me Retrieve current user
 * @apiName RetrieveCurrentUser
 * @apiGroup User
 * @apiPermission user
 * @apiPermission admin
 * @apiError {Object} 403 user or admin access only
 * @apiParam {String} access_token User access_token.
 * @apiSuccess {Object} user User's data.
 */
router.get('/me', showMe)

/**
 * @api {get} /users/:id Retrieve user
 * @apiName RetrieveUser
 * @apiGroup User
 * @apiPermission guest
 * @apiPermission user
 * @apiPermission admin
 * @apiSuccess {Object} user User's data.
 * @apiError 404 User not found.
 */
router.get('/:id', show)

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * path:
 *  api/users/:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      security:
 *        - masterKey
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "201":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.post(
    '/',
    masterman(),
    validateUserBeforeCreate(),
    body({
        email,
        password,
        name,
        picture,
        role
    }),
    create
)

/**
 * @api {put} /users/:id Update user
 * @apiName UpdateUser
 * @apiGroup User
 * @apiPermission user
 * @apiPermission admin
 * @apiParam {String} access_token User access_token.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiSuccess {Object} user data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 403 Current user or admin access only.
 * @apiError 404 User not found.
 */
router.put('/:id', body({ name, picture }), update)

/**
 * @api {put} /users/:id/password Update password
 * @apiName UpdatePassword
 * @apiGroup User
 * @apiPermission user
 * @apiPermission admin
 * @apiParam {String} new password.
 * @apiSuccess (Success 201) {Object} user data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 403 Current user access only.
 * @apiError 404 User not found.
 */
router.put(
    '/:id/password',
    body({
        password
    }),
    updatePassword
)

/**
 * @api {delete} /users/:id Delete user
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission admin
 * @apiPermission user
 * @apiParam {String} access_token User access_token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 403 Admin or user access only.
 * @apiError 404 User not found.
 */
router.delete('/:id', destroy)

export default router
