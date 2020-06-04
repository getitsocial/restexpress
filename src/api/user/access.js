import AccessControl from 'accesscontrol'
import AccessControlMiddleware from 's/auth/accessControl'

const ac = new AccessControl()
const endpoint = 'user'

// Docs: https://github.com/onury/accesscontrol#readme
// Api Docs: https://onury.io/accesscontrol/?api=ac

// Guest
ac.grant('guest').readAny(endpoint, ['_id', 'name', 'picture'])

// User
ac.grant('user')
	.extend('guest')
	.createAny(endpoint)
	.deleteOwn(endpoint)

// Admin
ac.grant('admin')
	.extend('user')
	.readAny(endpoint, ['_id', 'name', 'picture', 'email', 'role'])
	.updateAny(endpoint)
	.deleteAny(endpoint)

const accessControlMiddleware = new AccessControlMiddleware(ac)

export default accessControlMiddleware
