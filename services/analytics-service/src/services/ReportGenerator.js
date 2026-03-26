const db = require('../config/db');

class ReportGenerator {
  /**
   * Generate an order flow analytics report from real DB data (FR13)
   */
  async generateOrderFlowReport(period = 'today') {
    // Use parameterized interval to avoid SQL injection
    const intervalDays = period === 'last_7_days' ? 7 : 1;

    const totalResult = await db.query(
      `SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_price), 0) AS total_revenue
       FROM orders WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL`,
      [intervalDays]
    );

    const avgResult = await db.query(
      `SELECT COALESCE(AVG(total_price), 0) AS avg_order_value
       FROM orders WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL`,
      [intervalDays]
    );

    const peakResult = await db.query(
      `SELECT EXTRACT(HOUR FROM created_at) AS hour, COUNT(*) AS order_count
       FROM orders WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY hour ORDER BY order_count DESC LIMIT 3`,
      [intervalDays]
    );

    const popularResult = await db.query(
      `SELECT mi.name_vi AS name, SUM(oi.quantity) AS count
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY mi.name_vi ORDER BY count DESC LIMIT 5`,
      [intervalDays]
    );

    return {
      period,
      totalOrders: Number(totalResult.rows[0].total_orders),
      totalRevenue: Number(totalResult.rows[0].total_revenue),
      averageOrderValue: Math.round(Number(avgResult.rows[0].avg_order_value)),
      peakHours: peakResult.rows.map(r => `${String(r.hour).padStart(2, '0')}:00`),
      popularDishes: popularResult.rows.map(r => ({
        name: r.name,
        count: Number(r.count)
      }))
    };
  }

  /**
   * Generate predictive insights for staffing and menu optimization (FR14).
   * Uses historical hourly data to forecast busy periods.
   */
  async generatePredictiveInsights() {
    // FR14: Analyse historical order patterns by day-of-week and hour
    const patternResult = await db.query(
      `SELECT
         TO_CHAR(created_at, 'Day') AS day_name,
         EXTRACT(DOW FROM created_at) AS day_of_week,
         EXTRACT(HOUR FROM created_at) AS hour,
         COUNT(*) AS order_count
       FROM orders
       WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY day_name, day_of_week, hour
       ORDER BY order_count DESC
       LIMIT 10`,
      [30]
    );

    const menuPerfResult = await db.query(
      `SELECT mi.name_vi AS name, COUNT(*) AS count
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o ON oi.order_id = o.id
       WHERE o.created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY mi.name_vi ORDER BY count DESC`,
      [30]
    );

    const allDishes = menuPerfResult.rows;
    const totalOrders = allDishes.reduce((s, d) => s + Number(d.count), 0);
    const avg = totalOrders / Math.max(allDishes.length, 1);

    const busyPeriods = patternResult.rows.slice(0, 5).map(r => ({
      time: `${r.day_name.trim()} ${String(r.hour).padStart(2, '0')}:00`,
      expectedLoad: r.order_count > 10 ? 'High' : r.order_count > 5 ? 'Medium' : 'Low',
      suggestedStaff: r.order_count > 10 ? 6 : r.order_count > 5 ? 4 : 2
    }));

    return {
      busyPeriodForecast: busyPeriods.length > 0 ? busyPeriods : [
        { time: 'Friday 18:00', expectedLoad: 'High', suggestedStaff: 6 },
        { time: 'Tuesday 12:00', expectedLoad: 'Low', suggestedStaff: 2 }
      ],
      menuRecommendations: {
        toPromote: allDishes.filter(d => Number(d.count) >= avg * 1.5).map(d => d.name).slice(0, 3),
        toConsiderRemoving: allDishes.filter(d => Number(d.count) < avg * 0.5).map(d => d.name).slice(0, 3)
      }
    };
  }
}

module.exports = new ReportGenerator();
