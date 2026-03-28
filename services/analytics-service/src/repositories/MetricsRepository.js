const { redisClient } = require('../config/redis');
const db = require('../config/db');

class MetricsRepository {
  /**
   * Caches real-time active order count
   */
  async incrementActiveOrders() {
    return await redisClient.incr('metric:active_orders');
  }

  async decrementActiveOrders() {
    return await redisClient.decr('metric:active_orders');
  }

  async addRevenue(amount) {
    return await redisClient.incrByFloat('metric:daily_revenue', amount);
  }

  // Persists the summarized run into PG for FR13 Reports
  async saveHourlySummary(hour, totalOrders, revenue) {
    const query = `
      INSERT INTO analytics_summary (hour_bucket, total_orders, revenue)
      VALUES ($1, $2, $3)
      ON CONFLICT (hour_bucket) DO UPDATE
      SET total_orders = $2, revenue = $3;
    `;
    await db.query(query, [hour, totalOrders, revenue]);
  }

  // Track individual prep times in Redis list (last 100 entries)
  async trackPrepTime(seconds) {
    await redisClient.lPush('metric:prep_times', String(seconds));
    await redisClient.lTrim('metric:prep_times', 0, 99);
  }

  async getAvgPrepTime() {
    const times = await redisClient.lRange('metric:prep_times', 0, -1);
    if (times.length === 0) return 0;
    const avg = times.reduce((sum, t) => sum + Number(t), 0) / times.length;
    return Math.round(avg);
  }
}

module.exports = new MetricsRepository();
