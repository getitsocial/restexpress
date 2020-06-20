import { env, mongo, port, ip, apiRoot } from '~/config'
import mongoose from 's/mongoose'
import express from 's/express'
import api from 'a/'
const processMode =  process.env.NODE_ENV

const app = express(apiRoot, api)
if (processMode !== 'test') {
    mongoose.connect(mongo.uri)

    app.listen(port, () => {
        console.log(`Server started on ${ip}:${port}`)
    })
}

export default app