import mongoose from 'mongoose'
import { mongo } from '~/config'
export paginate from './plugins/paginate'
export gravatar from './plugins/gravatar'

Object.keys(mongo.options).forEach(key => {
	mongoose.set(key, mongo.options[key])
})

/* istanbul ignore next */
mongoose.connection.on('error', err => {
	console.error('MongoDB connection error: ' + err)
	process.exit(-1)
})

mongoose.connection.on('open', () => {
	console.info('MongoDB connected')
})

export default mongoose
