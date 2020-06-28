import { Router } from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { swagger } from '~/config'

const specs = swaggerJSDoc(swagger)
const router = new Router()

router.use('/docs', swaggerUi.serve)
router.get(
    '/docs',
    swaggerUi.setup(specs, {
        explorer: true
    })
)
export default router