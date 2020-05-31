import mongoose from 'mongoose'
import { mongo } from '~/config'
export paginatePlugin from './plugins/paginate'

Object.keys(mongo.options).forEach(key => {
	mongoose.set(key, mongo.options[key])
})

/* istanbul ignore next */
mongoose.Types.ObjectId.prototype.view = function() {
	return { id: this.toString() }
}

/* istanbul ignore next */
mongoose.connection.on('error', err => {
	console.error('MongoDB connection error: ' + err)
	process.exit(-1)
})

mongoose.connection.on('open', () => {
	console.info('MongoDB connected')
})

export default mongoose
