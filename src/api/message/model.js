import mongoose, { Schema } from 'mongoose'
import { paginate, filter, ownership } from 's/mongoose'
import rules from './acl'
import userAcl from 'a/user/acl'
/**
 * @swagger
 *  components:
 *    schemas:
 *      Message:
 *        type: object
 *        required:
 *          - content
 *        properties:
 *          content:
 *            type: string
 *            minLength: 2
 *          author:
 *            type: string
 *            description: User ObjectId
 *        example:
 *           content: Hello World
 *
 */
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

export const schema = model.schema
export default model
