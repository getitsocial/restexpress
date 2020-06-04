import 'dotenv/config'
import request from 'supertest'
import server from '~/server'
import { Router } from 'express'
import { sign, doorman } from 's/auth'
import { addAuthor } from 's/request'
import User from 'a/user/model'
import config from '~/config'

let adminUser,
	adminToken,
	guestUser,
	guestToken,
	shop,
	apiEndpoint = 'test'

// Add routes
beforeAll(async (done) => {
	describe('Add Testrouter', () => {

		const router = new Router()

		router.post(
			`/${apiEndpoint}/addAuthor/required`,
			doorman(['user', 'admin', 'guest']),
			addAuthor({ required: true, addBody: true, addReq: true }),
			(req, res, next) => {
				res.status(200).json({ reqAuthor: req.author, bodyAuthor: req.body.author })
			}
		)
		
		router.post(
			`/${apiEndpoint}/addAuthor/not-required`,
			doorman(['user', 'admin', 'guest']),
			addAuthor({ required: false, addBody: true, addReq: true }),
			(req, res, next) => {
				res.status(200).json({ reqAuthor: req.author, bodyAuthor: req.body.author })
			}
		)
		
		router.post(
			`/${apiEndpoint}/addAuthor/default`,
			doorman(['user', 'admin', 'guest']),
			addAuthor(),
			(req, res, next) => {
				res.status(200).json({ reqAuthor: req.author, bodyAuthor: req.body.author })
			}
		)


		router.post(
			`/${apiEndpoint}/addAuthor/required/noadd`,
			doorman(['user', 'admin', 'guest']),
			addAuthor({ required: true, addBody: false, addReq: false }),
			(req, res, next) => {
				res.status(200).json({ reqAuthor: req.author, bodyAuthor: req.body.author })
			}
		)

		server.use(router)
	})

	done()
})

beforeEach(async (done) => {

	adminUser = await User.create({
		name: 'Marty',
		email: 'marty@getit.social',
		password: 'SuperPasswort123?!',
		role: 'admin'
	})

	guestUser = await User.create({
		name: 'Marty',
		email: 'marty0@getit.social',
		password: 'SuperPasswort123?!',
		role: 'guest'
	})


	// Sign in user
	adminToken = await sign(adminUser)
	guestToken = await sign(guestUser)

	done()
})

describe('request service test:',  () => {


	test(`POST /${apiEndpoint}/addAuthor/default`, async () => {
		const { body } = await request(server)
			.post(`/${apiEndpoint}/addAuthor/default`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send({ hello: 'world' })
			.expect(200)
	
		expect(body.reqAuthor).not.toBeUndefined()
		expect(body.bodyAuthor).not.toBeUndefined()
	}) 

	test(`POST /${apiEndpoint}/addAuthor/default/`, async () => {
		const { body } = await request(server)
			.post(`/${apiEndpoint}/addAuthor/default`)
			.send({ hello: 'world' })
			.expect(400)
	
		expect(body.reqAuthor).toBeUndefined()
		expect(body.bodyAuthor).toBeUndefined()
	})

	test(`POST /${apiEndpoint}/addAuthor/required`, async () => {
		const { body } = await request(server)
			.post(`/${apiEndpoint}/addAuthor/required`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send({ hello: 'world' })
			.expect(200)
	
		expect(body.reqAuthor).not.toBeUndefined()
		expect(body.bodyAuthor).not.toBeUndefined()
	}) 

	test(`POST /${apiEndpoint}/addAuthor/required/`, async () => {
		const { body } = await request(server)
			.post(`/${apiEndpoint}/addAuthor/required`)
			.send({ hello: 'world' })
			.expect(400)
	
		expect(body.reqAuthor).toBeUndefined()
		expect(body.bodyAuthor).toBeUndefined()
	})

	test(`POST /${apiEndpoint}/addAuthor/not-required`, async () => {
		const { body } = await request(server)
			.post(`/${apiEndpoint}/addAuthor/not-required`)
			.send({ hello: 'world' })
			.expect(200)
	
		expect(body.reqAuthor).toBeUndefined()
		expect(body.bodyAuthor).toBeUndefined()
	}) 
 
	test(`POST /${apiEndpoint}/addAuthor/required/noadd`, async () => {
		const { body } = await request(server)
			.post(`/${apiEndpoint}/addAuthor/required/noadd`)
			.set('Authorization', 'Bearer ' + adminToken)
			.send({ hello: 'world' })
			.expect(200)
	
		expect(body.reqAuthor).toBeUndefined()
		expect(body.bodyAuthor).toBeUndefined()
	}) 

})