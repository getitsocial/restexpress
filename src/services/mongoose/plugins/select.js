import httpContext from 'http-request-context'

export default function select(schema, { rules }) {
	schema.pre('findOne', async function(next) {
		const { role } = httpContext.get('user') ?? { role: 'guest' }
		const method = httpContext.get('method')

		const { permissions } = rules.find(p => p.group === role)        
        
		const view = permissions.find(rule => rule.methods.includes(method))?.view ?? []

		this._fields = {}
		view.forEach(key => {
			this._fields[key] = 1
		})

		return next()
	})
}
