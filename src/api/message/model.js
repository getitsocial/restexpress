import mongoose, { Schema } from 'mongoose'
import { paginate, checkOwnership } from 's/mongoose'
import rules from './acl'

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

messageSchema.plugin(paginate, { rules })
messageSchema.plugin(checkOwnership, { rules })
const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model
