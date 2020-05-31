import { env, mongo, port, ip, apiRoot } from '~/config'
import mongoose from 's/mongoose'
import express from 's/express'
import api from 'a/'

const app = express(apiRoot, api)

mongoose.connect(mongo.uri)

app.listen(port, () => {
	console.log(`Server started on ${ip}:${port}`)
})

// Export fot test
export default app
