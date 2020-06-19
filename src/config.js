/* eslint-disable no-unused-vars */
import 'dotenv/config'
import { extractToken } from 's/auth/utils'

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
        port: process.env.PORT || 9000,
        ip: process.env.IP || '0.0.0.0',
        apiRoot: process.env.API_ROOT || '/api',
        masterKey: requireProcessEnv('MASTER_KEY'),
        jwt: {
            secret: requireProcessEnv('JWT_SECRET'),
            credentialsRequired: false,
            getToken: req => extractToken(req)
        },
        redis: {
            url: requireProcessEnv('REDIS_URL')
        },
        rateLimiter: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        },
        bugsnag: {
            secret: requireProcessEnv('BUGSNAG_API_KEY')
        }
    },
    test: {
        mongo: {
            uri: 'mongodb://localhost/testgenerator-test',
            options: {
                debug: false,
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: true
            }
        }
    },
    development: {
        mongo: {
            uri: 'mongodb://localhost/testgenerator-dev',
            options: {
                debug: true,
                useCreateIndex: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
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

module.exports = Object.assign(config.all, config[config.all.env])
export default module.exports
