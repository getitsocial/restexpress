import { Router } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Message } from '~/api/message'
import { User } from '~/api/user'
import { swagger } from '~/config'

const specs = swaggerJSDoc(swagger)
const router = new Router()
// TODO: Dynamic imports maybe?
specs.components.schemas = {}
Object.assign(specs.components.schemas, { Message: Message.swaggerSchema })
Object.assign(specs.components.schemas, { User: User.swaggerSchema })

// console.log(specs)
router.use(swagger.url, swaggerUi.serve)
router.get(
    swagger.url,
    swaggerUi.setup(specs, {
        explorer: true
    })
)
export default router
