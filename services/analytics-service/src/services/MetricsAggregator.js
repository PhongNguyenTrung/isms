const metricsRepo = require('../repositories/MetricsRepository');

class MetricsAggregator {
  constructor() {
    this._broadcastFn = null;
  }

  /**
   * Injects the broadcast function from the infrastructure layer.
   * Must be called before processing events.
   */
  setBroadcastFn(fn) {
    this._broadcastFn = fn;
  }

  /**
   * Process an order placement event
   */
  async processOrderPlaced(orderPayload) {
    const activeOrders = await metricsRepo.incrementActiveOrders();
    const currentRevenue = orderPayload.total_price
      ? await metricsRepo.addRevenue(orderPayload.total_price)
      : null;

    if (this._broadcastFn) {
      this._broadcastFn('active_orders', activeOrders);
      if (currentRevenue) {
        this._broadcastFn('daily_revenue', currentRevenue);
      }
    }

    console.log(`[MetricsAggregator] Updated Live Dashboard. Active Orders: ${activeOrders}`);
  }
}

module.exports = new MetricsAggregator();

