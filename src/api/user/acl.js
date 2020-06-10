const permissions = [
	{
		group: 'guest',
		permissions: [
			{
				resource: 'users/*',
				methods: ['POST', 'GET', 'PUT'],
				action: 'deny'
			}
		]
	}
]

export default permissions
