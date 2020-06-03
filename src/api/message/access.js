import AccessControl from 'accesscontrol'
import AccessControlMiddleware from 's/auth/accessControl'

const ac = new AccessControl()
const endpoint = 'message'

// Guest
ac.grant('guest').readAny(endpoint, [
	'_id',
	'content',
	'author.name',
	'author.picture'
])

// User
ac.grant('user')
	.extend('guest')
	.createAny(endpoint)
	.deleteOwn(endpoint)

// Admin
ac.grant('admin')
	.extend('user')
	.updateAny(endpoint, ['content'])
	.deleteAny(endpoint)

const accessControlMiddleware = new AccessControlMiddleware(ac)

export default accessControlMiddleware
