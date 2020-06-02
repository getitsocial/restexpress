// eslint-disable-next-line no-unused-vars
export default function projection(schema, fields) {
	const defaultFields = fields.defaultFields || fields
	const fullFields = fields?.fullFields
	schema.methods = {
		view(full) {
			const view = {}
			defaultFields.forEach(field => {
				view[field] =
					schema.tree[field].type === 'ObjectId'
						? this[field]
							? this[field].view()
							: null
						: this[field]
			})
			if (fullFields?.length && full) {
				fullFields.forEach(field => {
					view[field] =
						schema.tree[field].type === 'ObjectId'
							? this[field]
								? this[field].view(full)
								: null
							: this[field]
				})
			}

			return view
		}
	}
}
