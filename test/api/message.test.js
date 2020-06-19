import 'dotenv/config'
import request from 'supertest'
import server from '~/server'
import { Router } from 'express'
import { sign, doorman } from 's/auth'
import { addAuthor } from 's/request'
import User from 'a/user/model'
import Message from 'a/message/model'
import { apiRoot, masterKey } from '~/config'
import { NOT_FOUND, OK, CREATED, FORBIDDEN, NO_CONTENT, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes'

let adminUser,
    adminToken,
    defaultUser,
    defaultToken,
    guestMessage,
    userMessage,
    adminMessage,
    apiEndpoint = 'messages'

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

    guestMessage = await Message.create({ content: 'yeet' })
    userMessage = await Message.create({ content: 'yoot', author: defaultUser._id })
    adminMessage = await Message.create({ content: 'yuut', author: adminUser._id })
    // Sign in user
    adminToken = await sign(adminUser)
    defaultToken = await sign(defaultUser)

    done()
})

describe(`TEST ${apiRoot}/${apiEndpoint} ACL`,  () => {

    // INDEX
    test(`GET ${apiRoot}/${apiEndpoint} ADMIN OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}`)

        expect(status).toBe(OK)

        // check if view worked, pagination gets tested separately
        const { rows } = body
        const [ first ] = rows
        const keys = Object.keys(first)
        expect(keys).toEqual(expect.arrayContaining(['content']))
    })

    test(`GET ${apiRoot}/${apiEndpoint} ADMIN OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(OK)

        // check if view worked, pagination gets tested separately
        const { rows } = body
        const [ first ] = rows
        const keys = Object.keys(first)
        expect(keys).toEqual(expect.arrayContaining(['content']))
    })

    test(`GET ${apiRoot}/${apiEndpoint} ADMIN OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(status).toBe(OK)

        // check if view worked, pagination gets tested separately
        const { rows } = body
        const [ first ] = rows
        const keys = Object.keys(first)
        expect(keys).toEqual(expect.arrayContaining(['content']))
    })

    // SHOW
    test(`GET ${apiRoot}/${apiEndpoint}/:id GUEST OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/${userMessage._id}`)

        expect(status).toBe(OK)

        const authorKeys = Object.keys(body.author)
        expect(authorKeys).toEqual(expect.arrayContaining(['name', 'email']))

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['content', 'author']))
    })

    test(`GET ${apiRoot}/${apiEndpoint}/:id USER OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/${userMessage._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(OK)

        const authorKeys = Object.keys(body.author)
        expect(authorKeys).toEqual(expect.arrayContaining(['name', 'email']))

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['content', 'author']))
    })

    test(`GET ${apiRoot}/${apiEndpoint}/:id ADMIN OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/${userMessage._id}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(status).toBe(OK)

        const authorKeys = Object.keys(body.author)
        expect(authorKeys).toEqual(expect.arrayContaining(['name', 'email']))

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['content', 'author']))
    })

    // CREATE
    test(`POST ${apiRoot}/${apiEndpoint}/ GUEST CREATED`, async () => {
        const { status, body } = await request(server)
            .post(`${apiRoot}/${apiEndpoint}`)
            .send({ content: 'muh first post'})

        expect(status).toBe(CREATED)
        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['content']))
    })

    test(`POST ${apiRoot}/${apiEndpoint}/ GUEST CREATED`, async () => {
        const { status, body } = await request(server)
            .post(`${apiRoot}/${apiEndpoint}`)
            .send({ content: 'muh first post'})
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(CREATED)

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['content', 'author']))
    })

    test(`POST ${apiRoot}/${apiEndpoint}/ ADMIN CREATED`, async () => {
        const { status, body } = await request(server)
            .post(`${apiRoot}/${apiEndpoint}?master=${masterKey}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ content: 'muh first post'})

        expect(status).toBe(CREATED)

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['content', 'author']))
    })

    // UPDATE
    test(`PUT ${apiRoot}/${apiEndpoint}/:id GUEST FORBIDDEN`, async () => {
        const { status } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${guestMessage._id}`)
            .send({ content: 'updated content?' })
        expect(status).toBe(FORBIDDEN)
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id USER OK`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${userMessage._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)
            .send({ content: 'EDIT' })

        expect(status).toBe(OK)

        const authorKeys = Object.keys(body.author)
        expect(authorKeys).toEqual(expect.arrayContaining(['name', 'email']))

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['content', 'author']))
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id USER FORBIDDEN (OWNERSHIP)`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${adminMessage._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)
            .send({ content: 'git gud' })

        expect(status).toBe(FORBIDDEN)
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id ADMIN OK`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${userMessage._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ content: 'censored' })

        expect(status).toBe(OK)

        const authorKeys = Object.keys(body.author)
        expect(authorKeys).toEqual(expect.arrayContaining(['name', 'email']))

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['content', 'author']))    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id ADMIN NOT_FOUND`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/5ee5309727c6997fa0339135`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ content: 'reee' })

        expect(status).toBe(NOT_FOUND)
    })

    // DELETE
    test(`DELETE ${apiRoot}/${apiEndpoint}/:id GUEST FORBIDDEN`, async () => {
        const { status } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/${userMessage._id}`)
        expect(status).toBe(FORBIDDEN)
    })

    test(`DELETE ${apiRoot}/${apiEndpoint}/:id USER NO_CONTENT`, async () => {
        const { status, body } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/${userMessage._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(NO_CONTENT)
    })

    test(`DELETE ${apiRoot}/${apiEndpoint}/:id USER FORBIDDEN (OWNERSHIP)`, async () => {
        const { status, body } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/${adminMessage._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(FORBIDDEN)
    })

    test(`DELETE ${apiRoot}/${apiEndpoint}/:id ADMIN NO_CONTENT`, async () => {
        const { status, body } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/${userMessage._id}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(status).toBe(NO_CONTENT)
    })

    test(`DELETE ${apiRoot}/${apiEndpoint}/:id ADMIN NOT_FOUND`, async () => {
        const { status, body } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/5ee5309727c6997fa0339135`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(status).toBe(NOT_FOUND)
    })

})

describe(`TEST ${apiRoot}/${apiEndpoint} VALIDATION`,  () => {

    test(`POST ${apiRoot}/${apiEndpoint}/ GUEST BAD CONTENT`, async () => {
        const { status } = await request(server)
            .post(`${apiRoot}/${apiEndpoint}`)
            .send({ content: '' })

        expect(status).toBe(BAD_REQUEST)
    })

})
