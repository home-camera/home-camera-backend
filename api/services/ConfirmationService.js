const moment = require('moment');

module.exports = {
  sendConfirmationMail: function(user) {
    // TODO: send email with MailService

    user.confirmation_sent_at = moment().unix();
  }
};
