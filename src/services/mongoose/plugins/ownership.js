
export default function ownership(schema, { custom } = {}) {
    schema.statics.isOwner = function(doc, user) {
        if (custom) {
            return custom(doc, user)
        }
        // default is admin or author === user._id. Works for populated author too
        return user.role === 'admin' || doc.author._id.toString() === user._id || doc.author.toString() === user._id
    }
}
