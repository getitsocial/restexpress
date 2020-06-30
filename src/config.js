/* eslint-disable no-unused-vars */
import 'dotenv/config'
import { extractToken } from 's/auth/utils'

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
        },
        sendgrid: {
            apiKey: requireProcessEnv('SENDGRID_KEY'),
            emailTemplates: {
                welcome: 'd-e348a8a8a2f04a2e871e6fc6c26a5cfb',
                forgot: 'd-ac2e091839ab4112b1be2ff7d9d2d6d3'
            },
            defaultEmail: 'no-reply@your-website.com'
        },
        swagger: {
            url: '/docs',
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'RESTexpress',
                    version: '1.0.0',
                    description:
                    'RESTexpress is a highly customizable REST backend and API generator',
                    license: {
                        name: 'MIT',
                        url: 'https://github.com/tguelcan/restexpress/blob/master/LICENSE'
                    },
                    contact: {
                        name: 'RESTexpress team',
                        url: 'https://your-website.com',
                        email: 'your-email@your-website.com'
                    }
                },
                servers: [
                    {
                        url: 'http://localhost:8080/docs'
                    }
                ]
            },
            apis: ['src/**/*.js'],
            definitions: {}
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
