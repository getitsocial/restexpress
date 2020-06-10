import acl from 'express-acl'
import rules from '~/api/acl'

/**
 * DOC: https://github.com/nyambati/express-acl#readme
 */

// acl configuration
acl.config({
	//specify your own baseUrl
	baseUrl: 'api',
	filename: 'acl.js',
	//path to acl (nacl) file
	rules: rules,
	yml: true,
	// The default role allows you to specify which role users will assume if they are not assigned any
	defaultRole: 'guest'
})

// TODO: acl.checkOwner(rules)
export default acl