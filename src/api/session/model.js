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
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: jwtConfig.expiresIn
        }
    },
)

// TODO: work with indexes

const model = mongoose.model('Session', sessionSchema)
export const schema = model.schema

export default model
