/**
 * EmailChannel - Handles email dispatch via Nodemailer (mocked for now).
 */
class EmailChannel {
  async send(to, payload) {
    // TODO: Replace with real Nodemailer transport in production
    console.log(`[EmailChannel] Mock sending email to ${to}:`, payload);
  }
}

module.exports = new EmailChannel();
