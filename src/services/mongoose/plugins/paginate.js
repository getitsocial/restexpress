// eslint-disable-next-line no-unused-vars
/**
 * This adds the pagination function
 * @param {querymen} querymen input
 * @param {options} options input
 * @returns {object} rows, count, nextPage, PrevPage, page
 */
// TODO: user select
export default function paginate(schema, { rules }) {
    schema.statics.paginate = async function({ query, cursor }, options) {
        try {

            const { role } = options?.user ?? { role: 'guest' }
            const populate = options?.populate ?? []
            const method = options?.method

            if (!method) {
                return {}
            }

            const { permissions } = rules.find(p => p.group === role)
            const view = permissions.find(rule => rule.methods.includes(method)).view ?? []

            const select = {}
            view.filter(v => !v.includes('.')).forEach(key => {
                select[key] = 1
            })

            populate.forEach((e) => {
                const populateView = view.filter((v) => v.startsWith(`${e.path}.`))
                e.select = {}
                populateView.forEach(key => {
                    e.select[key.split('.')[1]] = 1
                })
            })


            const [count, rows] = await Promise.all([
                this.countDocuments(query),
                this.find(query, select, cursor)
                    .populate(populate)
                    .lean()
            ])
            // Start at page 1
            const page = Math.floor(cursor.skip / cursor.limit) + 1
            const nextPage = page * cursor.limit >= count ? null : page + 1
            const prevPage = page === 1 ? null : page - 1
            return {
                rows,
                count,
                nextPage,
                prevPage,
                page
            }

        } catch (err) {
            console.log(err)
            return {}
        }
    }
}
