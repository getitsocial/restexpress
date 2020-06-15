import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env, rateLimiter, bugsnag } from '~/config'
import acl from './acl'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginExpress from '@bugsnag/plugin-express'
import { doorman } from '~/services/auth/guard'
import httpContext from 'http-request-context'

Bugsnag.start({
	apiKey: bugsnag.secret,
	plugins: [BugsnagPluginExpress]
})
const bugsnagMiddleware = Bugsnag.getPlugin('express')
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
// istanbul ignore next
const limiter = rateLimit(rateLimiter)

export default (apiRoot, routes) => {
	const app = express()
	/* istanbul ignore next */
	app.use(httpContext.middleware({
		removeAfterClose: true,
		removeAfterFinish: true
	  })
	)
	app.use((req, res, next) => {
		httpContext.set('method', req.method)
		next()
	})
	if (env === 'production' || env === 'development') {
		app.use(bugsnagMiddleware.requestHandler)
		app.use(helmet())
		app.use(limiter)
		app.use(cors())
		app.use(compression())
		app.use(morgan('dev'))
		app.use(bugsnagMiddleware.errorHandler)
	}
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.use(doorman)
	app.use((req, res, next) => {
		setTimeout(() => {
			httpContext.set('user', req.user)
			next()
		}, 300)
	})
	app.use(acl.authorize)
	app.use(apiRoot, routes)
	app.use(queryErrorHandler())
	app.use(bodyErrorHandler())

	return app
}
