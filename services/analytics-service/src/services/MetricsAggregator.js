const metricsRepo = require('../repositories/MetricsRepository');

class MetricsAggregator {
  constructor() {
    this._broadcastFn = null;
  }

  /**
   * Injects the broadcast function from the infrastructure layer.
   */
  setBroadcastFn(fn) {
    this._broadcastFn = fn;
  }

  /**
   * Process an order placement event (FR12: live order count, revenue)
   */
  async processOrderPlaced(orderPayload) {
    const activeOrders = await metricsRepo.incrementActiveOrders();
    const currentRevenue = orderPayload.total_price
      ? await metricsRepo.addRevenue(orderPayload.total_price)
      : null;

    if (this._broadcastFn) {
      this._broadcastFn('active_orders', activeOrders);
      if (currentRevenue !== null) {
        this._broadcastFn('daily_revenue', currentRevenue);
      }
    }

    // Persist to hourly summary for FR13 reports
    const hour = new Date().toISOString().slice(0, 13) + ':00:00Z';
    await metricsRepo.saveHourlySummary(
      hour,
      activeOrders,
      currentRevenue || 0
    );

    console.log(`[MetricsAggregator] Order placed. Active: ${activeOrders}`);
  }

  /**
   * Process kitchen task completion (track avg prep time for FR13)
   */
  async processKitchenTaskCompleted(payload) {
    const { createdAt, completedAt } = payload;
    if (createdAt && completedAt) {
      const prepTimeMs = new Date(completedAt) - new Date(createdAt);
      const prepTimeSec = prepTimeMs / 1000;
      await metricsRepo.trackPrepTime(prepTimeSec);

      const avgPrepTime = await metricsRepo.getAvgPrepTime();

      if (this._broadcastFn) {
        this._broadcastFn('avg_prep_time', avgPrepTime);
      }
    }

    // Completed order → decrement active counter
    const activeOrders = await metricsRepo.decrementActiveOrders();
    if (this._broadcastFn) {
      this._broadcastFn('active_orders', activeOrders);
    }
  }
}

module.exports = new MetricsAggregator();

