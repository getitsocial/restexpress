import mongoose, { Schema } from 'mongoose'
import mongooseKeywords from 'mongoose-keywords'
import { generate } from 'rand-token'
import { gravatar, paginate, checkOwnership, select, filter } from 's/mongoose'
import { hashPassword } from 's/auth'
import { env } from '~/config'
import rules from './acl'
import userAcl from 'a/user/acl'

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

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next()
    }
    /* istanbul ignore next */
    this.password = await hashPassword(this.password)
    return next()
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
userSchema.post('save', function (error, document, next) {
    next(error?.code === 11000 ? 'Diese E-Mail Adresse existiert bereits.' : error)
})
userSchema.plugin(gravatar)
userSchema.plugin(paginate, { rules, populateRules: { user: userAcl } })
userSchema.plugin(mongooseKeywords, { paths: ['email', 'name'] })
// userSchema.plugin(checkOwnership, { rules })
// userSchema.plugin(select, { rules })
userSchema.plugin(filter, { rules })

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
