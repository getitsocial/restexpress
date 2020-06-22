import sendgridMail from '@sendgrid/mail'
import { sendgrid } from '~/config'

const { apiKey, defaultEmail } = sendgrid
sendgridMail.setApiKey(apiKey)

/**
 * Sends dynamic mail through the SendGrid™ API
 *
 * @param {*} { from = defaultEmail, to, templateId, dynamic_template_data }
 * @returns Promise
 */
export const sendDynamicMail = ({ from = defaultEmail, to, templateId, dynamic_template_data }) => {
    return sendgridMail.send({ to, from, templateId, dynamic_template_data })
}
