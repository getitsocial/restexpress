// eslint-disable-next-line no-unused-vars
export default function paginate(schema, options) {
	schema.statics.paginate = async function(query, select, cursor, view) {
		const [count, rows] = await Promise.all([
			this.countDocuments(query),
			this.find(query, select, cursor)
		])

		const page = Math.floor(cursor.skip / cursor.limit)
		const nextPage = page * cursor.limit === count ? null : page + 1
		const prevPage = page === 0 ? null : page - 1

		return {
			rows: view ? rows.map(row => row.view()) : rows,
			count,
			nextPage,
			prevPage,
			page
		}
	}
}
