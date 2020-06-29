import m2s from 'mongoose-to-swagger'
import mongoose, { Schema } from 'mongoose'
import { paginate, filter, ownership } from 's/mongoose'
import rules from './acl'
import userAcl from 'a/user/acl'

const messageSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            minlength: 2
        },
        author: {
            type: 'ObjectId',
            ref: 'User',
            required: false
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (obj, ret) => {
                delete ret._id
            }
        }
    }
)


messageSchema.plugin(filter, { rules })
messageSchema.plugin(paginate, { rules, populateRules: { author: userAcl } })
messageSchema.plugin(ownership)

const model = mongoose.model('Message', messageSchema)
model.swaggerSchema = m2s(model)
export const schema = model.schema

export default model
