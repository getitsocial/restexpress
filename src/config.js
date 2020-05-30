/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'
import dotenv from 'dotenv'

dotenv.config()

/* istanbul ignore next */
const requireProcessEnv = name => {
	if (!process.env[name]) {
		throw new Error('You must set the ' + name + ' environment variable')
	}
	return process.env[name]
}

const config = {
	all: {
		env: process.env.NODE_ENV || 'development',
		root: path.join(__dirname, '..'),
		port: process.env.PORT || 9000,
		ip: process.env.IP || '0.0.0.0',
		apiRoot: process.env.API_ROOT || '/api',
		masterKey: requireProcessEnv('MASTER_KEY'),
		jwtSecret: requireProcessEnv('JWT_SECRET'),
		mongo: {
			options: {
				useNewUrlParser: true,
				useUnifiedTopology: true
			}
		}
	},
	test: {},
	development: {
		mongo: {
			uri: 'mongodb://localhost/testgenerator-dev',
			options: {
				debug: true,
				useCreateIndex: true,
				useNewUrlParser: true
			}
		}
	},
	production: {
		ip: process.env.IP || undefined,
		port: process.env.PORT || 8080,
		mongo: {
			uri: process.env.MONGODB_URI || 'mongodb://localhost/testgenerator'
		}
	}
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
