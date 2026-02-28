/**
 * SmsChannel - Handles SMS dispatch via Twilio SDK (mocked for now).
 */
class SmsChannel {
  async send(phone, payload) {
    // TODO: Replace with real Twilio client in production
    console.log(`[SmsChannel] Mock sending SMS to ${phone}:`, payload);
  }
}

module.exports = new SmsChannel();
