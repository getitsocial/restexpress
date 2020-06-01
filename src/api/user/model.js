import bcrypt from 'bcryptjs'
import randtoken from 'rand-token'
import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { gravatar, projection } from 's/mongoose'
import { env } from '~/config'

const roles = ['user', 'admin']

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
	const rounds = env === 'test' ? 1 : 9

	bcrypt
		.hash(this.password, rounds)
		.then(hash => {
			this.password = hash
			next()
		})
		.catch(next)
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
				const password = randtoken.generate(16)
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
userSchema.plugin(projection, ['id', 'name', 'picture'])
userSchema.plugin(mongooseKeywords, { paths: ['email', 'name'] })

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
