const permissions = [
	{
		group: 'guest',
		permissions: [
			{
				resource: 'auth/*',
				methods: ['POST'],
				action: 'allow'
			}
		]
	}
]

export default permissions
