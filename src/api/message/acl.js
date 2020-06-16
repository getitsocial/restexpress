const permissions = [
	{
		group: 'guest',
		permissions: [
			{
				resource: 'messages/*',
				methods: ['GET', 'POST'],
				action: 'allow',
				view: ['content', 'author', 'author.name', 'author.email'] // <-- idea 2 - look on 35
			}
		]
	},
	{
		group: 'user',
		permissions: [
			{
				resource: 'messages/*',
				methods: ['GET', 'POST', 'PUT', 'DELETE'],
				action: 'allow',
				checkOwner: true,
				view: ['content', 'author', 'author.name', 'author.email']
			}
		]
	}
]

export default permissions
