// eslint-disable-next-line no-unused-vars
/**
 * This adds the pagination function
 * @param {querymen} querymen input
 * @param {options} options input
 * @returns {object} rows, count, nextPage, PrevPage, page
 */
export default function paginate(schema, options) {
	schema.statics.paginate = async function(
		{ query, select, cursor },
		{ permission, populate }
	) {
		const [count, rows] = await Promise.all([
			this.countDocuments(query),
			this.find(query, select, cursor)
				.populate(populate)
				.lean()
		])

		// Start at page 1
		const page = Math.floor(cursor.skip / cursor.limit) + 1
		const nextPage = page * cursor.limit === count ? null : page + 1
		const prevPage = page === 1 ? null : page - 1
		return {
			rows: permission ? permission.filter(rows) : rows,
			count,
			nextPage,
			prevPage,
			page
		}
	}
}
