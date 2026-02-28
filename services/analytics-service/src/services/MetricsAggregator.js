const metricsRepo = require('../repositories/MetricsRepository');
const { broadcastMetricUpdate } = require('../socket/dashboardSocket');

class MetricsAggregator {
  /**
   * Process an order placement event
   */
  async processOrderPlaced(orderPayload) {
    const activeOrders = await metricsRepo.incrementActiveOrders();
    // Assuming simple payload like: { orderId: 1, items: [...], total_price: 150000 }
    const currentRevenue = orderPayload.total_price
      ? await metricsRepo.addRevenue(orderPayload.total_price)
      : null;

    // Push new values to all connected frontends
    broadcastMetricUpdate('active_orders', activeOrders);

    if (currentRevenue) {
      broadcastMetricUpdate('daily_revenue', currentRevenue);
    }

    console.log(`[MetricsAggregator] Updated Live Dashboard. Active Orders: ${activeOrders}`);
  }

  // We'd also have processOrderCompleted(...) to decrement active orders.
}

module.exports = new MetricsAggregator();
