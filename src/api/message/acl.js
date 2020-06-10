const permissions = [
	{
		group: 'guest',
		permissions: [
			{
				resource: 'messages/*',
				methods: ['GET', 'POST'],
				action: 'allow',
				checkOwner: true, // <-- idea 1 - look on 24
				view: ['content', 'author.name', 'author.picture'] // <-- idea 2 - look on 35
			}
		]
	},
	{
		group: 'user',
		permissions: [
			{
				resource: 'messages/*',
				methods: ['GET', 'POST', 'PUT', 'DELETE'],
				action: 'allow'
			}
		]
	}
]
// TODO 1:
// Idea is to add an checkOwner property.
// Create a mongoose plugin named checkOwner
// If the CheckOwner key set, pass the request for update to "schema.pre('findAndUpdate', function() {..."
// and check into the pre hook if the user is the owner of the

// Challenge:
// Pass the req.user prop to the schema.pre('findAndUpdate',...) hook. how?
// Maybe with https://www.npmjs.com/package/express-http-context or https://www.npmjs.com/package/request-context ???

// TODO 2:
// Idea is, to add a view key to filter the right view

// Challenge:
// Filter on query with select? Withour .view() projection
// Maybe with https://mongoosejs.com/docs/api.html#query_Query-select

export default permissions
