import { merge, flow, groupBy, mapValues, map, omit } from 'lodash'
import messageAcl from './message/acl'
import authAcl from './auth/acl'
import userAcl from './user/acl'
const defaultPermissions = [

]

const permissions = {
    ...groupBy([
        ...defaultPermissions,
        ...messageAcl,
        ...authAcl,
        ...userAcl
    ],'group')
}

Object.keys(permissions).forEach((group) => {
    permissions[group] = permissions[group].reduce((accu, curr) => {
        return { group, permissions: accu.permissions.concat(curr.permissions)}
    })
})
console.log(permissions.guest.permissions)
export default Object.values(permissions)
