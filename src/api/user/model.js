import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { generate } from 'rand-token'
import { gravatar, paginate } from 's/mongoose'
import { hashPassword } from 's/auth'
import { env } from '~/config'

const roles = ['guest', 'user', 'admin']

const userSchema = new Schema(
	{
		email: {
			type: String,
			match: /^\S+@\S+\.\S+$/,
			required: true,
			unique: true,
			trim: true,
			lowercase: true
		},
		password: {
			type: String,
			required: true,
			minlength: 6
		},
		name: {
			type: String,
			index: true,
			trim: true
		},
		services: {
			facebook: String,
			github: String,
			google: String
		},
		role: {
			type: String,
			enum: roles,
			default: 'user'
		},
		picture: {
			type: String,
			trim: true
		},
		verified: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true
	}
)

userSchema.pre('save', function(next) {
	if (!this.isModified('password')) return next()
	/* istanbul ignore next */
	this.password = hashPassword(this.password)
})

userSchema.statics = {
	roles,

	createFromService({ service, id, email, name, picture }) {
		return this.findOne({
			$or: [{ [`services.${service}`]: id }, { email }]
		}).then(user => {
			if (user) {
				user.services[service] = id
				user.name = name
				user.picture = picture
				return user.save()
			} else {
				const password = generate(16)
				return this.create({
					services: { [service]: id },
					picture,
					email,
					password,
					name
				})
			}
		})
	}
}

userSchema.plugin(gravatar)
userSchema.plugin(paginate)
userSchema.plugin(mongooseKeywords, { paths: ['email', 'name'] })

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
