import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { doorman } from 's/auth'
import { addAuthor } from 's/request'
import { create, getAll, getOne, update, destroy } from './controller'
import { schema } from './model'
import accessControl from './access'
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
	doorman(['guest', 'user']),
	addAuthor({ required: true, addBody: true }),
	accessControl.check({
		resource: 'message',
		action: 'create'
	}),
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
router.get(
	'/',
	query(),
	accessControl.check({
		resource: 'message',
		action: 'read'
	}),
	getAll
)

/**
 * @api {get} /messages/:id Retrieve message
 * @apiName RetrieveMessage
 * @apiGroup Message
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 */
router.get(
	'/:id',
	accessControl.check({
		resource: 'message',
		action: 'read'
	}),
	getOne
)

/**
 * @api {put} /messages/:id Update message
 * @apiName UpdateMessage
 * @apiGroup Message
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} message Message's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Message not found.
 */
router.put(
	'/:id',
	accessControl.check({
		resource: 'message',
		action: 'update',
		checkOwnerShip: true,
		operands: [
			{ source: 'user', key: '_id' },
			{ source: 'params', key: 'author' }
		]
	}),
	body({ content }),
	update
)

/**
 * @api {delete} /messages/:id Delete message
 * @apiName DeleteMessage
 * @apiGroup Message
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Message not found.
 */
router.delete(
	'/:id',
	accessControl.check({
		resource: 'message',
		action: 'delete',
		checkOwnerShip: true,
		operands: [
			{ source: 'user', key: '_id' },
			{ source: 'params', key: 'author' }
		]
	}),
	destroy
)

export default router
