import httpContext from 'http-request-context'

export default function checkOwnership(schema, { rules }) {
	schema.pre('findOneAndUpdate', async function(next) {
		
		const { role, _id } = httpContext.get('user')
		const method = httpContext.get('method')

		const { permissions } = rules.find(p => p.group === role)        
		const checkOwner = permissions.find(rule => rule.methods.includes(method)).checkOwner ?? false
		
		if (!checkOwner) {
			return next()
		}
        
		if (this._conditions._id !== _id) {
			throw new Error('unauthorized')
		}
         
		return next()
	})
}
