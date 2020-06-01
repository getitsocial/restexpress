import crypto from 'crypto'

// eslint-disable-next-line no-unused-vars
export default function gravatar(schema, options) {
	schema.path('email').set(function(email) {
		if (!this.picture || this.picture.indexOf('https://gravatar.com') === 0) {
			const hash = crypto
				.createHash('md5')
				.update(email)
				.digest('hex')
			this.picture = `https://gravatar.com/avatar/${hash}?d=identicon`
		}

		if (!this.name) {
			this.name = email.replace(/^(.+)@.+$/, '$1')
		}

		return email
	})
}
