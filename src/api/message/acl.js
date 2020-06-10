const permissions = [
	{
		group: 'guest',
		permissions: [
			{
				resource: 'messages/*',
				methods: ['GET', 'POST'],
				action: 'allow',
				checkOwner: true
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

export default permissions
