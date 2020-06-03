// eslint-disable-next-line no-unused-vars
import { isArray, mapKeys } from 'lodash'

export default function projection(schema, fields) {
	schema.methods = {
		view(role) {
			const view = {}
			fields[role].forEach(field => {
				view[field] =
					schema.tree[field].type === 'ObjectId'
						? this[field]
							? this[field].view(role)
							: null
						: this[field]
			})

			return view
		}
	}
}
