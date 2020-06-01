export const addAuthor = ({ bodymen: { body }, user }, res, next) => {
	if (!user) {
		next()
	}
	body.author = user
	next()
}
