/**
 * PushChannel - Handles push notification dispatch (mocked for now).
 */
class PushChannel {
  async send(target, payload) {
    // TODO: Replace with real push notification service (e.g., Firebase FCM)
    console.log(`[PushChannel] Mock publishing to ${target}:`, payload);
  }
}

module.exports = new PushChannel();
