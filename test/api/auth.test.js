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
    defaultToken,
    adminUser

beforeEach(async () => {

    adminUser = await User.create({
        name: 'Marty',
        email: 'marty@getit.social',
        password: 'Passwort213!!!',
        role: 'admin',
        verified: true
    })

    const unverifiedUser = await User.create({
        name: 'Marty',
        email: 'unverified@getit.social',
        password: 'Passwort213!!!',
        role: 'user',
        verified: false
    })

    const defaultUser = await User.create({
        name: 'Marty',
        email: 'marty0@getit.social',
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
            .send({ email: 'marty@getit.social', password: 'Passwort213!!!' })

        expect(status).toBe(OK)
    })

    test(`POST ${apiRoot}/auth UNAUTHORIZED - UNVERIFIED`, async () => {
        const { statusCode } = await request(server)
            .post(`${apiRoot}/auth?master=${masterKey}`)
            .send({ email: 'marty0@getit.social', password: 'Passwort213!!!' })

        expect(statusCode).toBe(UNAUTHORIZED)
    })

    test(`POST ${apiRoot}/auth UNAUTHORIZED - NO MASTERKEY`, async () => {
        const { statusCode } = await request(server)
            .post(`${apiRoot}/auth`)
            .send({ email: 'marty@getit.social', password: 'Passwort213!!!' })

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
            .send({ email: 'marty@getit.social', password: 'Max123!!?!' })

        expect(statusCode).toBe(UNAUTHORIZED)
    })

    test(`POST ${apiRoot}/auth UNAUTHORIZED - unverified email`, async () => {
        const { statusCode } = await request(server)
            .post(`${apiRoot}/auth?master=${masterKey}`)
            .send({ email: 'unverified@getit.social', password: 'Passwort213!!!' })

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

describe('createFromService', () => {
    let serviceUser

    beforeEach(() => {
        serviceUser = {
            id: '123',
            name: 'Test Name',
            email: 'test@test.com',
            picture: 'https://www.google.de'
        }
    })
    ;['facebook', 'google'].forEach((service) => {
        describe(service, () => {
            beforeEach(() => {
                serviceUser.service = service
            })

            it('updates user when email is already registered', async () => {
                const updatedUser = await User.createFromService({
                    ...serviceUser,
                    email: 'marty@getit.social',
                })

                // keep
                expect(updatedUser.id).toBe(adminUser.id)
                expect(updatedUser.email).toBe(adminUser.email)
                expect(updatedUser.verified).toBe(true)
                // update
                expect(updatedUser.name).toBe(serviceUser.name)
                expect(updatedUser.services[service]).toBe(serviceUser.id)
            })

            it('updates user when service id is already registered', async () => {
                await adminUser
                    .set({ services: { [service]: serviceUser.id } })
                    .save()
                const updatedUser = await User.createFromService(serviceUser)

                // keep
                expect(updatedUser.id).toBe(adminUser.id)
                expect(updatedUser.email).toBe(adminUser.email)
                expect(updatedUser.verified).toBe(true)

                // update
                expect(updatedUser.name).toBe(serviceUser.name)
                expect(updatedUser.services[service]).toBe(serviceUser.id)
            })

            it('creates a new user when neither service id and email was found', async () => {
                const createdUser = await User.createFromService(serviceUser)

                expect(createdUser.id).not.toBe(adminUser.id)
                expect(createdUser.services[service]).toBe(serviceUser.id)
                expect(createdUser.name).toBe(serviceUser.name)
                expect(createdUser.email).toBe(serviceUser.email)
                expect(createdUser.verified).toBe(true)
            })
        })
    })
})