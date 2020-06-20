import 'dotenv/config'
import request from 'supertest'
import server from '~/server'
import { middleware as query } from 'querymen'
import { Router } from 'express'
import Message from 'a/message/model'
import { apiRoot, masterKey } from '~/config'
import { OK } from 'http-status-codes'

const endpoint = 'paginate'

beforeAll(() => {
    describe('Add Testrouter', () => {

        const router = new Router()

        router.get(`/${apiRoot}/${endpoint}`,
            query(),
            async ({ querymen, user, method }, res, next) => {
                console.log(querymen)
                console.log(user)
                console.log(method)
                const messages = await Message.paginate(querymen, {
                    populate: [{ path: 'author' }],
                    method,
                    user
                })
                res.status(OK).json(messages)
            }
        )
        server.use(router)
    })
})

beforeEach(async (done) => {

    const messages = Array(100)

    for (let index = 0; index < messages.length; index += 1) {
        messages[index] = new Message({ content: 'hello world' })
    }

    await Message.insertMany(messages)

    done()
})

describe('TEST PAGINATION', () => {
    test('Messages got inserted', async () => {
        expect(await Message.find()).toHaveLength(100)
    })

    test(`GET /${endpoint}`, async () => {
        console.log(`${apiRoot}/${endpoint}`)
        const { status, body } = await request(server)
            .get(`${apiRoot}/${endpoint}`)

        expect(status).toBe(OK)
        console.log(body)
    })

})