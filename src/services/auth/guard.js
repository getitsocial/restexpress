import { decode } from 'jsonwebtoken'
import { createClient } from 'redis'
import { default as JWTR } from 'jwt-redis'
import eJWT from 'express-jwt'
import { extractToken } from 's/auth/utils'
import { redis, jwt, masterKey } from '~/config'
import hosts from '~/hosts.json'
export const redisClient = createClient(redis)
const jwtr = new JWTR(redisClient)

// Get JWT Secret
const { secret } = jwt

export const verify = async (token, secret) => jwtr.verify(token, secret)

const isRevokedCallback = async (req, res, done) => {
	try {
		await verify(extractToken(req), secret)
		done(null, false)
	} catch (error) {
		done(null, true)
	}
}

// Define user roles
export const roles = ['guest', 'user', 'admin']

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

// Check if passed values include guest role
const isGuestRole = (passedRoles, res, next) => {
	if (!passedRoles.includes('guest')) {
		res.status(401).end()
	}
	next()
}

// Main middleware validator
export const doorman = (passedRoles, accessControl) => [
	eJWT({ ...jwt, ...{ isRevoked: isRevokedCallback } }),
	(req, res, next) =>
		roles.some(r => passedRoles.includes(r)) &&
		passedRoles.includes(req.user?.role)
			? next()
			: isGuestRole(passedRoles, res, next)
]

export const addUser = eJWT({ ...jwt, ...{ isRevoked: isRevokedCallback } })

export const masterman = () => (req, res, next) => {
	// Check if host exist in json
	const urlParser = url => new URL(url).host
	const hostExist = hosts.some(h => urlParser(h.url) === req.get('host'))
	return masterKey === extractToken(req) && hostExist
		? next()
		: res.status(401).end()
}
