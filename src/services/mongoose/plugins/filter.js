import httpContext from 'http-request-context'

export default function select(schema, { rules }) {
    schema.methods.filter = function({ role = 'guest', method }) {

        const { permissions } = rules.find(p => p.group === role) ?? []

        const view = permissions.find(rule => rule.methods.includes(method)).view ?? []

        const obj = view.reduce((a,b) => (a[b] = this[b], a), {})

        return obj
    }
}
