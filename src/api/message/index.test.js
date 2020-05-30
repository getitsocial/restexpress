// Libraries required for testing
import test from 'ava'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

// Your server and models
import app from '~/server'
import Message from './'

// Start MongoDB instance
const mongod = new MongoMemoryServer()

// Create connection to Mongoose before tests are run
test.before(async () => {
	const uri = await mongod.getConnectionString()
	await mongoose.connect(uri, { useMongoClient: true })
})

test.serial('get messages', async t => {
	const { app } = t.context
	const res = await request(app).get('/')
	t.is(res.status, 200)
})
