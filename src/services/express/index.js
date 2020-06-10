import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import contextService from 'request-context'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { doorman } from '~/services/auth/guard'
import { env, rateLimiter, bugsnag } from '~/config'
import acl from './acl'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginExpress from '@bugsnag/plugin-express'
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
	app.use(contextService.middleware('ctx'))
	app.all('*', [
		doorman,
		function(req, res, next) {
			contextService.set('ctx.req', req)
			return next()
		}
	])
	app.use(acl.authorize)
	app.use(apiRoot, routes)
	app.use(queryErrorHandler())
	app.use(bodyErrorHandler())

	return app
}
