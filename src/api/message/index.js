import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { doorman } from 's/auth'
import { addAuthor } from 's/request'
import { create, getAll, getOne, update, destroy } from './controller'
import { schema } from './model'
export Message, { schema } from './model'

const { content } = schema.tree
const router = new Router()

/**
 * @api {post} /messages Create message
 * @apiName CreateMessage
 * @apiGroup Message
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 * @apiPermission user
 * @apiError 401 user access only.
 */
router.post(
	'/',
	body({
		content: {
			type: String,
			required: true,
			minlength: 2
		}
	}),
	doorman(['user', 'admin']),
	addAuthor({ required: true, addBody: true }),
	create
)

/**
 * @api {get} /messages Retrieve messages
 * @apiName RetrieveMessages
 * @apiGroup Message
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} messages List of messages.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/', doorman(['guest', 'user']), query(), getAll)

/**
 * @api {get} /messages/:id Retrieve message
 * @apiName RetrieveMessage
 * @apiGroup Message
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 */
router.get('/:id', doorman(['user']), getOne)

/**
 * @api {put} /messages/:id Update message
 * @apiName UpdateMessage
 * @apiGroup Message
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 */
router.put('/:id', body({ content }), update)

/**
 * @api {delete} /messages/:id Delete message
 * @apiName DeleteMessage
 * @apiGroup Message
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Message not found.
 */
router.delete('/:id', destroy)

export default router
