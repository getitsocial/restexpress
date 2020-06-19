import 'dotenv/config'
import request from 'supertest'
import server from '~/server'
import { Router } from 'express'
import { sign, doorman } from 's/auth'
import { addAuthor } from 's/request'
import User from 'a/user/model'
import { apiRoot, masterKey } from '~/config'
import { NOT_FOUND, OK, CREATED, FORBIDDEN, NO_CONTENT } from 'http-status-codes'

let adminUser,
    adminToken,
    defaultUser,
    defaultToken,
    apiEndpoint = 'users'

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

describe(`TEST ${apiRoot}/${apiEndpoint} ACL`,  () => {


    // INDEX
    test(`GET ${apiRoot}/${apiEndpoint} USER FORBIDDEN`, async () => {
        const { status } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(FORBIDDEN)
    })

    test(`GET ${apiRoot}/${apiEndpoint} GUEST FORBIDDEN`, async () => {
        const { status } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}`)

        expect(status).toBe(FORBIDDEN)
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
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name']))
    })

    // SHOWME
    test(`GET ${apiRoot}/${apiEndpoint}/me GUEST FORBIDDEN`, async () => {
        const { status } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/me`)

        expect(status).toBe(FORBIDDEN)
    })

    test(`GET ${apiRoot}/${apiEndpoint}/me USER OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/me`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(OK)

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name', 'email']))
    })

    test(`GET ${apiRoot}/${apiEndpoint}/me ADMIN OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/me`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(status).toBe(OK)

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name', 'email']))
    })


    // SHOW
    test(`GET ${apiRoot}/${apiEndpoint}/:id GUEST FORBIDDEN`, async () => {
        const { status } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/${defaultUser._id}`)

        expect(status).toBe(FORBIDDEN)
    })

    test(`GET ${apiRoot}/${apiEndpoint}/:id USER OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/${adminUser._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(OK)

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name', 'email']))
    })

    test(`GET ${apiRoot}/${apiEndpoint}/:id USER NOT_FOUND`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/5ee5309727c6997fa0339135`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(NOT_FOUND)

    })

    test(`GET ${apiRoot}/${apiEndpoint}/:id ADMIN OK`, async () => {
        const { status, body } = await request(server)
            .get(`${apiRoot}/${apiEndpoint}/${adminUser._id}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(status).toBe(OK)

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name', 'email']))
    })

    // CREATE
    test(`POST ${apiRoot}/${apiEndpoint}/ GUEST CREATED`, async () => {
        const { status, body } = await request(server)
            .post(`${apiRoot}/${apiEndpoint}?master=${masterKey}`)
            .send({ email: 'marty2@getit.social', password: 'SoEinGutesPasswortOmg123?!', name: 'Marty' })

        expect(status).toBe(CREATED)
        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name', 'email']))
    })

    test(`POST ${apiRoot}/${apiEndpoint}/ USER FORBIDDEN`, async () => {
        const { status, body } = await request(server)
            .post(`${apiRoot}/${apiEndpoint}?master=${masterKey}`)
            .set('Authorization', `Bearer ${defaultToken}`)
            .send({ email: 'marty2@getit.social', password: 'SoEinGutesPasswortOmg123?!', name: 'Marty' })

        expect(status).toBe(FORBIDDEN)
    })

    test(`POST ${apiRoot}/${apiEndpoint}/ ADMIN CREATED`, async () => {
        const { status, body } = await request(server)
            .post(`${apiRoot}/${apiEndpoint}?master=${masterKey}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ email: 'marty2@getit.social', password: 'SoEinGutesPasswortOmg123?!', name: 'Marty' })

        expect(status).toBe(CREATED)
        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name', 'email']))
    })

    // UPDATE
    test(`PUT ${apiRoot}/${apiEndpoint}/:id GUEST FORBIDDEN`, async () => {
        const { status } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${defaultUser._id}`)

        expect(status).toBe(FORBIDDEN)
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id USER OK`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${defaultUser._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)
            .send({ name: 'Hans' })

        expect(status).toBe(OK)
        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name', 'email']))
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id USER FORBIDDEN (OWNERSHIP)`, async () => {
        const { status, body, error } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${adminUser._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)
            .send({ name: 'Hans' })

        expect(status).toBe(FORBIDDEN)
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id ADMIN OK`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${defaultUser._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Berta' })

        expect(status).toBe(OK)

        const keys = Object.keys(body)
        expect(keys).toEqual(expect.arrayContaining(['_id', 'verified', 'role', 'name', 'email']))
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id ADMIN NOT_FOUND`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/5ee5309727c6997fa0339135`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Berta' })

        expect(status).toBe(NOT_FOUND)
    })

    // DELETE
    test(`DELETE ${apiRoot}/${apiEndpoint}/:id GUEST FORBIDDEN`, async () => {
        const { status } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/${defaultUser._id}`)
        expect(status).toBe(FORBIDDEN)
    })

    test(`DELETE ${apiRoot}/${apiEndpoint}/:id USER NO_CONTENT`, async () => {
        const { status, body } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/${defaultUser._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(NO_CONTENT)
    })

    test(`DELETE ${apiRoot}/${apiEndpoint}/:id USER FORBIDDEN (OWNERSHIP)`, async () => {
        const { status, body } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/${adminUser._id}`)
            .set('Authorization', `Bearer ${defaultToken}`)

        expect(status).toBe(FORBIDDEN)
    })

    test(`DELETE ${apiRoot}/${apiEndpoint}/:id ADMIN NO_CONTENT`, async () => {
        const { status, body } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/${defaultUser._id}`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(status).toBe(NO_CONTENT)

    })

    test(`DELETE ${apiRoot}/${apiEndpoint}/:id ADMIN NOT_FOUND`, async () => {
        const { status, body } = await request(server)
            .delete(`${apiRoot}/${apiEndpoint}/5ee5309727c6997fa0339135`)
            .set('Authorization', `Bearer ${adminToken}`)

        expect(status).toBe(NOT_FOUND)
    })

    // UPDATE PASSWORD
    test(`PUT ${apiRoot}/${apiEndpoint}/:id/password GUEST FORBIDDEN`, async () => {
        const { status } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${defaultUser._id}/password`)

        expect(status).toBe(FORBIDDEN)
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id/password USER NO_CONTENT`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${defaultUser._id}/password`)
            .set('Authorization', `Bearer ${defaultToken}`)
            .send({ password: 'yeeeeeeha123?!?!?!' })

        expect(status).toBe(NO_CONTENT)
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id/password USER FORBIDDEN (OWNERSHIP)`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${adminUser._id}/password`)
            .set('Authorization', `Bearer ${defaultToken}`)
            .send({ password: 'yEEEEEEEEEEEET?123!' })

        expect(status).toBe(FORBIDDEN)
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id/password ADMIN NO_CONTENT`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/${defaultUser._id}/password`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ password: 'Bert!!!1123a' })

        expect(status).toBe(NO_CONTENT)
    })

    test(`PUT ${apiRoot}/${apiEndpoint}/:id/password ADMIN NOT_FOUND`, async () => {
        const { status, body } = await request(server)
            .put(`${apiRoot}/${apiEndpoint}/5ee5309727c6997fa0339135/password`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ password: 'Berta122313?!?!' })

        expect(status).toBe(NOT_FOUND)
    })

})