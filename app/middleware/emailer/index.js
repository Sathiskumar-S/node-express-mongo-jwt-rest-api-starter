import nodemailer from 'nodemailer'
import mg from 'nodemailer-mailgun-transport'
import i18n from 'i18n'
import User from '../../models/user.js'
import { buildErrObject } from '../../middleware/utils/index.js'

/**
 * Checks User model if user with a specific email exists
 * @param {string} email - user email
 * @returns {Promise<boolean>}
 */
export const emailExists = async (email = '') => {
  try {
    const item = await User.findOne({ email })
    if (item) {
      throw buildErrObject(422, 'EMAIL_ALREADY_EXISTS')
    }
    return false
  } catch (err) {
    throw buildErrObject(422, err.message || err)
  }
}


/**
 * Checks User model if a user with a specific email exists, excluding a given user ID
 * @param {string} id - user ID to exclude
 * @param {string} email - user email to check
 * @returns {Promise<boolean>}
 */
export const emailExistsExcludingMyself = async (id = '', email = '') => {
  try {
    const item = await User.findOne({
      email,
      _id: { $ne: id }
    })

    if (item) {
      throw buildErrObject(422, 'EMAIL_ALREADY_EXISTS')
    }

    return false
  } catch (err) {
    throw buildErrObject(422, err.message || err)
  }
}


/**
 * Prepares to send email
 * @param {Object} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
export const prepareToSendEmail = (user = {}, subject = '', htmlMessage = '') => {
  user = {
    name: user.name,
    email: user.email,
    verification: user.verification
  }

  const data = {
    user,
    subject,
    htmlMessage
  }

  if (process.env.NODE_ENV === 'production') {
    sendEmail(data, (messageSent) =>
      messageSent
        ? console.log(`Email SENT to: ${user.email}`)
        : console.log(`Email FAILED to: ${user.email}`)
    )
  } else if (process.env.NODE_ENV === 'development') {
    console.log(data)
  }
}

/**
 * Sends email
 * @param {Object} data - data
 * @param {Function} callback - callback
 */
export const sendEmail = async (data = {}, callback) => {
  const auth = {
    auth: {
      api_key: process.env.EMAIL_SMTP_API_MAILGUN,
      domain: process.env.EMAIL_SMTP_DOMAIN_MAILGUN
    }
    // host: 'api.eu.mailgun.net' // Uncomment if using European servers
  }

  const transporter = nodemailer.createTransport(mg(auth))

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to: `${data.user.name} <${data.user.email}>`,
    subject: data.subject,
    html: data.htmlMessage
  }

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return callback(false)
    }
    return callback(true)
  })
}

/**
 * Sends registration email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
export const sendRegistrationEmailMessage = (locale = '', user = {}) => {
  i18n.setLocale(locale)
  
  const subject = i18n.__('registration.SUBJECT')
  
  const htmlMessage = i18n.__(
    'registration.MESSAGE',
    user.name,
    process.env.FRONTEND_URL,
    user.verification
  )

  prepareToSendEmail(user, subject, htmlMessage)
}

/**
 * Sends reset password email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
export const sendResetPasswordEmailMessage = (locale = '', user = {}) => {
  i18n.setLocale(locale)

  const subject = i18n.__('forgotPassword.SUBJECT')

  const htmlMessage = i18n.__(
    'forgotPassword.MESSAGE',
    user.email,
    process.env.FRONTEND_URL,
    user.verification
  )

  prepareToSendEmail(user, subject, htmlMessage)
}

