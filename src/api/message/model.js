import mongoose, { Schema } from 'mongoose'
import { paginate, checkOwnership } from 's/mongoose'
import permissions from './acl'

const messageSchema = new Schema(
	{
		content: {
			type: String,
			required: true
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

messageSchema.plugin(paginate)
messageSchema.plugin(checkOwnership, { permissions })
const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model
