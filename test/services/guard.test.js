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
	defaultUser,
	defaultToken,
	shop,
	apiEndpoint = 'test'

// Add routes
beforeAll(async (done) => {
	describe('Add Testrouter', () => {

		const router = new Router()

		router.get(
			`/${apiEndpoint}/all`,
			doorman(['user', 'admin', 'guest']),
			(req, res, next) => res.status(200).end()
		)
    
		router.get(
			`/${apiEndpoint}/user`,
			doorman(['user']),
			(req, res, next) => res.status(200).end()
		)
        
		router.get(
			`/${apiEndpoint}/admin`,
			doorman(['admin']),
			(req, res, next) => res.status(200).end()
		)

		router.get(
			`/${apiEndpoint}/guest`,
			doorman(['guest']),
			(req, res, next) => res.status(200).end()
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

	defaultUser = await User.create({
		name: 'Marty',
		email: 'marty0@getit.social',
		password: 'SuperPasswort123?!',
		role: 'user'
	})


	// Sign in user
	adminToken = await sign(adminUser)
	defaultToken = await sign(defaultUser)
    
	done()
})

describe('request service test:',  () => {


	test(`GET /${apiEndpoint}/all admin`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/all`)
			.set('Authorization', 'Bearer ' + adminToken)
        
		expect(status).toBe(200)
	}) 

	test(`GET /${apiEndpoint}/all user`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/all`)
			.set('Authorization', 'Bearer ' + defaultToken)
        
		expect(status).toBe(200)
	}) 

	test(`GET /${apiEndpoint}/all admin`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/all`)
        
		expect(status).toBe(200)
	}) 


	test(`GET /${apiEndpoint}/user user`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/user`)
			.set('Authorization', 'Bearer ' + defaultToken)
        
		expect(status).toBe(200)
	}) 

	test(`GET /${apiEndpoint}/user guest`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/user`)
        
		expect(status).toBe(401)
	}) 

	test(`GET /${apiEndpoint}/admin admin`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/admin`)
			.set('Authorization', 'Bearer ' + adminToken)
        
		expect(status).toBe(200)
	}) 

	test(`GET /${apiEndpoint}/admin user`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/admin`)
			.set('Authorization', 'Bearer ' + defaultToken)
        
		expect(status).toBe(401)
	}) 


	test(`GET /${apiEndpoint}/admin guest`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/admin`)
        
		expect(status).toBe(401)
	}) 
    

	test(`GET /${apiEndpoint}/guest guest`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/guest`)
        
		expect(status).toBe(200)
	}) 


	test(`GET /${apiEndpoint}/guest user`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/guest`)
			.set('Authorization', 'Bearer ' + defaultToken)
        
		expect(status).toBe(200)
	}) 
    
	test(`GET /${apiEndpoint}/guest admin`, async () => {
		const { body, status } = await request(server)
			.get(`/${apiEndpoint}/guest`)
			.set('Authorization', 'Bearer ' + adminToken)
        
		expect(status).toBe(200)
	}) 

})