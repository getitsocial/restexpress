const permissions = [
	{
		group: 'guest',
		permissions: [
			{
				resource: 'users/*',
				methods: ['POST', 'GET'],
				action: 'allow',
				view: ['picture', 'name']

			}
		]
	},
	{
		group: 'user',
		permissions: [
			{
				resource: 'users/*',
				methods: ['PUT', 'DELETE', 'GET'],
				checkOwner: true,
				action: 'allow',
				view: ['_id', 'verified', 'role', 'picture', 'name', 'email']
			},
			{
				resource: 'users/',
				methods: ['POST'],
				action: 'allow',
				view: ['_id', 'email']
			}
		]
	}
]

export default permissions
