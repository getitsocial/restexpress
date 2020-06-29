import { Router } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Message } from '~/api/message'
import { swagger } from '~/config'

const specs = swaggerJSDoc(swagger)
const router = new Router()

Object.assign(specs.components.schemas, {Message: Message.swaggerSchema})

// console.log(specs)
router.use(swagger.url, swaggerUi.serve)
router.get(
    swagger.url,
    swaggerUi.setup(specs, {
        explorer: true
    })
)
export default router
