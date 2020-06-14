import { merge, flow, groupBy, mapValues, map, omit } from 'lodash'
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

const permissions = { ...groupBy([...defaultPermissions, ...messageAcl, ...authAcl], 'group') }
Object.keys(permissions).forEach((group) => {
	permissions[group] = permissions[group].reduce((accu, curr) => {
		return { group, permissions: accu.permissions.concat(curr.permissions)}
	})
})
export default Object.values(permissions)
