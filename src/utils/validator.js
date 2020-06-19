import { validate } from 'email-validator'
export const passwordValidator = {
    /**
     * Password validator -
     * The password must contain at least:
     * 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)
     * @param {string} password - The password
     * @returns {boolean} if the password is strong enough
     */
    validator: function (password) {
        const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
        return strongRegex.test(password)
    },
    /**
     * Send message if error
     * @returns {string} message
    */
    // eslint-disable-next-line max-len
    message: () => 'The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)'
}

export const emailValidator = {

    validator: function (email) {
        console.log(email)
        // eslint-disable-next-line max-len
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    },

    message: () => 'Email is invalid'
}
