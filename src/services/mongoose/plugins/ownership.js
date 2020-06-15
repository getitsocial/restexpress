export default function checkOwnership(schema, { permissions }) {
	schema.pre('findOneAndUpdate', async function(next) {
		/* 		const role = contextService.get('request:user.role')
		const _id = contextService.get('request:user._id')
		const permission = permissions.find(p => p.group === role)
        
		if (!permission.checkOwner) {
			return next()
		}
        
		if (this._conditions._id !== _id) {
			return next(new Error('nananananana batman'))
		}
         */
		return next()
	})
}
