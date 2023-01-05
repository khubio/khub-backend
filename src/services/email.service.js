const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.gmail);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `${config.email.feUrl}/auth/reset-password?token=${token}`;
  const text = `Dear user,

To reset your password, click on this link:

${resetPasswordUrl}

If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.email.feUrl}/auth/verify-email?token=${token}`;
  const text = `Dear user,

To verify your email, click on this link:

${verificationEmailUrl}

If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

const sendInvitationEmail = async (to, groupId, groupName, owner) => {
  const subject = 'Email Invitation to Group';
  const invitationUrl = `${config.email.feUrl}/groups/${groupId}/join`;
  const text = `Dear user,
${owner} invite you to join ${groupName}, to join this group, click on this link:

${invitationUrl}

If you are not interested, you can ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendInvitationEmail,
};
