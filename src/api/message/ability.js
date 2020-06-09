import { AbilityBuilder, Ability } from '@casl/ability'

const isAdmin = user => user?.role === 'admin'
const isUser = user => user?.role === 'user'

/**
 * @param user contains details about logged in user: its id, name, email, etc
 */
const defineAbilitiesFor = user => {
	const { can, cannot, rules } = new AbilityBuilder()

	// can read blog posts
	can('read', 'Message', ['id', 'content'])

	if (isUser(user)) {
		can('update', 'Message', { author: user._id })
	}

	if (isAdmin(user)) {
		can(['read', 'update', 'delete'], 'Message')
	}

	return new Ability(rules)
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null)

const createAbilities = (req, res, next) => {
	req.ability = req.user?.jti
		? defineAbilitiesFor(req.user)
		: ANONYMOUS_ABILITY
	next()
}

export default createAbilities
