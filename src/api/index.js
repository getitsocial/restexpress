import { Router } from 'express'
import { env, mongo, port, ip, apiRoot } from '~/config'
import { doorman } from '~/services/auth/guard'
import auth from './auth'
import user from './user'
import message from './message'
import verification from './verification'
import passwordReset from './password-reset'

const router = new Router()

router.use('/auth', auth)
router.use('/verification', verification)
router.use('/users', user)
router.use('/messages', message)
router.use('/password-reset', passwordReset)

export default router
