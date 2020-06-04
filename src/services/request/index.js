export const addAuthor = options => (req, res, next) => {
	const {
		bodymen: { body },
		user
	} = req
	const { required = true, addBody = false, addReq = false } = options ?? {}

	if (!user && !required) {
		return next()
	}

	if (!user && required) {
		res.status(400).end()
	}

	if (addBody) {
		body.author = user
	}

	if (addReq) {
		req.author = user
	}

	next()
}
