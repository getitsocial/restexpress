import request from 'supertest'
import server from '~/server'
import { jwt, masterKey, apiRoot } from '~/config'
import { verify } from 's/auth'
import { sign, decode } from 's/auth'
import User from 'a/user/model'
import { TokenDestroyedError } from 'jwt-redis'
import { OK, NO_CONTENT, UNAUTHORIZED, BAD_REQUEST } from 'http-status-codes'

const { secret } = jwt

let adminToken,
    defaultToken

beforeEach(async () => {

    const adminUser = await User.create({
        name: 'Maximilian',
        email: 'max1@moritz.com',
        password: 'Passwort213!!!',
        role: 'admin',
        verified: true
    })

    const defaultUser = await User.create({
        name: 'Maximilian',
        email: 'max2@moritz.com',
        password: 'Passwort213!!!',
        role: 'user',
        verified: false
    })

    defaultToken = await sign(defaultUser)
    adminToken = await sign(adminUser)

})

describe('Auth Test:', () => {

    test(`POST ${apiRoot}/auth OK`, async () => {
        const { body, status, header } = await request(server)
            .post(`${apiRoot}/auth?master=${masterKey}`)
            .send({ email: 'max1@moritz.com', password: 'Passwort213!!!' })

        expect(status).toBe(OK)
    })

    test(`POST ${apiRoot}/auth UNAUTHORIZED - UNVERIFIED`, async () => {
        const { statusCode } = await request(server)
            .post(`${apiRoot}/auth?master=${masterKey}`)
            .send({ email: 'max2@moritz.com', password: 'Passwort213!!!' })

        expect(statusCode).toBe(UNAUTHORIZED)
    })

    test(`POST ${apiRoot}/auth UNAUTHORIZED - NO MASTERKEY`, async () => {
        const { statusCode } = await request(server)
            .post(`${apiRoot}/auth`)
            .send({ email: 'max1@moritz.com', password: 'Passwort213!!!' })

        expect(statusCode).toBe(UNAUTHORIZED)
    })

    test(`POST ${apiRoot}/auth UNAUTHORIZED - invalid email`, async () => {
        const { statusCode } = await request(server)
            .post(`${apiRoot}/auth?master=${masterKey}`)
            .send({ email: 'unknown@user.com', password: 'Passwort213!!!' })

        expect(statusCode).toBe(UNAUTHORIZED)
    })

    test(`POST ${apiRoot}/auth UNAUTHORIZED - invalid password`, async () => {
        const { statusCode } = await request(server)
            .post(`${apiRoot}/auth?master=${masterKey}`)
            .send({ email: 'max1@moritz.com', password: 'Max123!!?!' })

        expect(statusCode).toBe(UNAUTHORIZED)
    })

    test(`POST ${apiRoot}/auth BAD_REQUEST`, async () => {
        const { body, statusCode, header } = await request(server)
            .post(`${apiRoot}/auth?master=${masterKey}`)
            .send({ badRequest: 'sooo bad... muahaha...' })

        expect(statusCode).toBe(BAD_REQUEST)
    })

    test('POST /auth/logout NO_CONTENT', async () => {
        const { statusCode } = await request(server)
            .post(`${apiRoot}/auth/logout`)
            .set('Authorization', 'Bearer ' + adminToken)

        expect(statusCode).toBe(NO_CONTENT)

        await expect(verify(adminToken, secret)).rejects.toThrow(TokenDestroyedError)
    })

    test('POST /auth/logout BAD_REQUEST', async () => {
        const { statusCode, error } = await request(server)
            .post(`${apiRoot}/auth/logout`)

        expect(statusCode).toBe(BAD_REQUEST)
        await expect(verify(adminToken, secret)).resolves.not.toThrow(TokenDestroyedError)
    })

})