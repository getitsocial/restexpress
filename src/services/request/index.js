export const addAuthor = (options) => (req, res, next) => {
	const { user } = req
	const { required = true, addBody = false, addReq = false } = options ?? {}
	
	if (!user && !required) {
		next()
	}

	if (!user && required) {
		res.status(400).end()
	}

	if (addBody) {
		req.body.author = user		
	}

	if (addReq) {
		req.author = user
	}

	next()
}
