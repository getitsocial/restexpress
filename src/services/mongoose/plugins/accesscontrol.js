// eslint-disable-next-line no-unused-vars
import contextService from 'request-context'
import permissions from '~/api/acl'

export default function accesscontrol(schema, options) {
	schema.pre('findOneAndUpdate', function(next, req) {
		req = contextService.get('ctx.req')
		console.log(permissions)
		console.log(req)
		console.log(req?.user._id)
		console.log('SAAVEHOOOOK')
		// do stuff
		return next()
	})
}
