// eslint-disable-next-line no-unused-vars
export default function projection(schema, fields) {
	schema.methods = {
		view(full) {
			const view = {}
			fields.forEach(field => {
				view[field] =
					schema.tree[field].type === 'ObjectId'
						? this[field]
							? this[field].view()
							: null
						: this[field]
			})

			return view
		}
	}
}
