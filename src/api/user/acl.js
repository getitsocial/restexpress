const permissions = [
	{
		group: 'guest',
		permissions: [
			{
				resource: 'users/*',
				methods: ['POST', 'GET', 'PUT'],
				action: 'allow'
			}
		]
	}
]

export default permissions
