// eslint-disable-next-line no-unused-vars
export default function paginate(schema, options) {
	schema.statics.paginate = async function(
		query,
		select,
		cursor,
		{ addView, fullView, populate }
	) {
		console.log(fullView)
		const [count, rows] = await Promise.all([
			this.countDocuments(query),
			this.find(query, select, cursor).populate(populate)
		])

		// Start at page 1
		const page = Math.floor(cursor.skip / cursor.limit) + 1
		const nextPage = page * cursor.limit === count ? null : page + 1
		const prevPage = page === 1 ? null : page - 1

		return {
			rows: addView ? rows.map(row => row.view(fullView)) : rows,
			count,
			nextPage,
			prevPage,
			page
		}
	}
}
