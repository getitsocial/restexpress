import { AbilityBuilder, Ability } from '@casl/ability'

/**
 * @param user contains details about logged in user: its id, name, email, etc
 */
const defineAbilitiesFor = user => {
	const { can, cannot, rules } = new AbilityBuilder()

	// can read blog posts
	can('read', 'Message', ['id', 'content'])

	return new Ability(rules)
}

const ANONYMOUS_ABILITY = defineAbilitiesFor(null)

const createAbilities = (req, res, next) => {
	req.ability = req.user.email
		? defineAbilitiesFor(req.user)
		: ANONYMOUS_ABILITY
	next()
}

export default createAbilities
