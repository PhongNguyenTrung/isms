const alertRepo = require('../repositories/AlertHistoryRepository');
const EmailChannel = require('../channels/EmailChannel');
const SmsChannel = require('../channels/SmsChannel');
const PushChannel = require('../channels/PushChannel');

/**
 * Alert routing configuration.
 * Maps event types to the channels they should be dispatched through.
 * Adding a new alert type only requires a new entry here (Open/Closed Principle).
 */
const ALERT_ROUTING = {
  KitchenOverload: [
    { channel: PushChannel, target: 'ManagerDashboard' }
  ],
  InventoryLow: [
    { channel: EmailChannel, target: 'manager@restaurant.com' },
    { channel: PushChannel, target: 'ManagerDashboard' }
  ],
  TemperatureAlert: [
    { channel: SmsChannel, target: '+1234567890' },
    { channel: EmailChannel, target: 'manager@restaurant.com' },
    { channel: PushChannel, target: 'ManagerDashboard' }
  ],
};

class AlertDispatcher {
  async processAlert(eventType, payload) {
    const alertRecord = await alertRepo.saveAlert(eventType, payload, 'PENDING');

    console.log(`[AlertDispatcher] Received ${eventType} alert.`);

    const routes = ALERT_ROUTING[eventType];
    if (!routes) {
      console.warn(`[AlertDispatcher] No routing configured for event type: ${eventType}`);
      return;
    }

    // Inject event type so channels can build contextual messages
    const enrichedPayload = { ...payload, _eventType: eventType };

    await Promise.all(
      routes.map(({ channel, target }) => channel.send(target, enrichedPayload))
    );

    await alertRepo.updateAlertStatus(alertRecord.id, 'DISPATCHED');
  }
}

module.exports = new AlertDispatcher();

