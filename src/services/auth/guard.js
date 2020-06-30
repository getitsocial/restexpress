import { decode } from 'jsonwebtoken'
import { createClient } from 'redis'
import { default as JWTR } from 'jwt-redis'
import eJWT from 'express-jwt'
import { extractToken, extractMaster } from 's/auth/utils'
import { redis, jwt, masterKey } from '~/config'
export const redisClient = createClient(redis)

const jwtr = new JWTR(redisClient)

// Get JWT Secret
const { secret } = jwt

export const verify = async (token, secret) => jwtr.verify(token, secret)

const isRevokedCallback = async (req, res, done) => {
    try {
        await verify(extractToken(req), secret)
        return done(null, false)
    } catch (error) {
        // console.log('teeest')
        return done(null, true)
    }
}

// Define user roles
export const roles = ['guest', 'user', 'admin']
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     jwtSessionToken:
 *       type: http
 *       scheme: bearer
 */
export const sign = async ({ _id, role }) =>
    jwtr.sign({ _id, role }, secret, { expiresIn: '8d' })

export const decodeJWT = async token => decode(token)

// remove jti from redis
export const destroyJTI = async jti => jwtr.destroy(jti, secret)

// Destroy token from index
export const destroy = async req => {
    const { jti } = await decode(extractToken(req))
    await destroyJTI(jti)
}

// Main middleware validator
export const doorman = eJWT({ ...jwt, ...{ isRevoked: isRevokedCallback } })

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     masterKey:
 *       type: apiKey
 *       in: query
 *       name: master
 */
export const masterman = () => (req, res, next) =>  masterKey === extractMaster(req) ? next() : res.status(401).end()
