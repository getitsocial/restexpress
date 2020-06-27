import { Router } from 'express'
export PasswordReset, { schema } from './model'
import { masterman } from '~/services/auth'
import { middleware as body } from 'bodymen'
import { schema as userSchema } from 'a/user/model'
import {
    create,
    show,
    update
} from './controller'

const router = new Router()

const { email, password } = userSchema.tree

router.get('/:token', show)

router.post(
    '',
    masterman(),
    body({
        email,
    }),
    create
)

router.patch(
    '/:token',
    body({
        password
    }),
    update
)

export default router
