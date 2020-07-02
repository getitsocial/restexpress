import mongoose, { Schema } from 'mongoose'
import { jwtConfig } from '~/config'

const sessionSchema = new Schema(
    {
        jti: {
            type: String,
            required: true,
            minlength: 2,
        },
        user: {
            type: 'ObjectId',
            ref: 'User',
            required: false,
        },
        device: {
            type: {
                type: String
            },
            name: {
                type: String
            },
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: jwtConfig.expiresIn
        }
    },
)

// TODO: work with indices

const model = mongoose.model('Session', sessionSchema)
export const schema = model.schema
schema.statics = {
    deleteAllUserSessions: async function(user) {
        await model.deleteMany({ user })
    }
}
export default model
