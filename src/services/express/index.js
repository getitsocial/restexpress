import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import mongoose from 'mongoose'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env, rateLimiter, bugsnag, jwt } from '~/config'
import acl from './acl'
import swagger from './swagger'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginExpress from '@bugsnag/plugin-express'
import { doorman } from 's/auth/guard'

let MongoStore = connectMongo(session)
let bugsnagMiddleware
if (env !== 'test') {
    Bugsnag.start({
        apiKey: bugsnag.secret,
        plugins: [BugsnagPluginExpress]
    })
    bugsnagMiddleware = Bugsnag.getPlugin('express')
}

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
// istanbul ignore next
const limiter = rateLimit(rateLimiter)

export default (apiRoot, routes) => {
    const app = express()
    /* istanbul ignore next */

    if (env === 'production' || env === 'development') {
        app.use(bugsnagMiddleware.requestHandler)
        app.use(helmet())
        app.use(limiter)
        app.use(cors())
        app.use(compression())
        app.use(morgan('dev'))
        app.use(bugsnagMiddleware.errorHandler)
        // Persist sessions with MongoStore / sequelizeStore
        // We need to enable sessions for passport-twitter because it's an
        // oauth 1.0 strategy, and Lusca depends on sessions
        app.use(session({
            secret: jwt.secret,
            saveUninitialized: true,
            resave: false,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                db: 'testprojects'
            })
        }))
    }
    if (env === 'development') {
        app.use(swagger)
    }
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(doorman)
    app.use(acl.authorize)
    app.use(apiRoot, routes)
    app.use(queryErrorHandler())
    app.use(bodyErrorHandler())

    return app
}
