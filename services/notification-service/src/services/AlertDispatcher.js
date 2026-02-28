const alertRepo = require('../repositories/AlertHistoryRepository');

class AlertDispatcher {
  async processAlert(eventType, payload) {
    // 1. Save alert to history
    const alertRecord = await alertRepo.saveAlert(eventType, payload, 'PENDING');

    // 2. Dispatch based on severity/type (Mocked implementations)
    console.log(`[AlertDispatcher] Received ${eventType} alert. Details:`, payload);

    if (eventType === 'KitchenOverload') {
      await this.dispatchPushNotification('ManagerDashboard', payload);
    } else if (eventType === 'InventoryLow') {
      await this.dispatchEmail('manager@restaurant.com', payload);
      await this.dispatchPushNotification('ManagerDashboard', payload);
    } else if (eventType === 'TemperatureAlert') {
      await this.dispatchSms('+1234567890', payload);
      await this.dispatchEmail('manager@restaurant.com', payload);
      await this.dispatchPushNotification('ManagerDashboard', payload);
    }

    // 3. Mark as dispatched
    await alertRepo.updateAlertStatus(alertRecord.id, 'DISPATCHED');
  }

  async dispatchEmail(to, payload) {
    console.log(`[Email Service] Mock sending email to ${to}...`, payload);
  }

  async dispatchSms(phone, payload) {
    console.log(`[SMS Service] Mock sending SMS to ${phone}...`, payload);
  }

  async dispatchPushNotification(deviceIds, payload) {
    console.log(`[Push Notification] Mock publishing to ${deviceIds}...`, payload);
  }
}

module.exports = new AlertDispatcher();
