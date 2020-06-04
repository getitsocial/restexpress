import { Router } from 'express'
import { middleware as body } from 'bodymen'
import { authenticate, providerAuthenticate, logout } from './controller'
import { masterman, doorman } from '~/services/auth'

const router = new Router()

/**
 * @api {post} /auth Authenticate
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiPermission master
 * @apiHeader {String} Authorization Basic authorization with email and password.
 * @apiParam {String} access_token Master access_token.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Master access only or invalid credentials.
 */
router.post(
	'',
	body({
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	}),
	masterman(),
	authenticate
)

/**
 * @api {post} /auth/logout logout current user
 * @apiName LogoutUser
 * @apiGroup Auth
 * @apiError 401 Invalid credentials.
 */
router.post('/logout', logout)

/**
 * @api {post} /auth/:provider Authenticate with Facebook or Google
 * @apiName AuthenticateProvider
 * @apiGroup Auth
 * @apiParam {String} access_token Facebook or Google user accessToken.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Invalid credentials.
 */
router.post('/:provider', providerAuthenticate)

export default router
