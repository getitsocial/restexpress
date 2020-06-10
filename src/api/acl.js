import { merge } from 'lodash'
import messageAcl from './message/acl'
import authAcl from './auth/acl'

const defaultPermissions = [
	{
		group: 'guest',
		permissions: [
			{
				resource: '*',
				methods: ['POST', 'GET', 'PUT'],
				action: 'allow'
			}
		]
	}
]

const permissions = merge(defaultPermissions, messageAcl)
// const permissions = merge(defaultPermissions, authAcl)

export default permissions
