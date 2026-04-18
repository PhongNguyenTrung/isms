const db = require('../config/db');

class ReportGenerator {
  async generateOrderFlowReport(period = 'today') {
    const intervalDays = period === 'last_7_days' ? 7 : 1;

    // ── KPI totals ──────────────────────────────────────────────────────────
    const [totalResult, avgResult] = await Promise.all([
      db.query(
        `SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_price), 0) AS total_revenue
         FROM orders WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL`,
        [intervalDays]
      ),
      db.query(
        `SELECT COALESCE(AVG(total_price), 0) AS avg_order_value
         FROM orders WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
         AND status NOT IN ('CANCELLED')`,
        [intervalDays]
      ),
    ]);

    // ── Completion rate ─────────────────────────────────────────────────────
    const statusResult = await db.query(
      `SELECT status, COUNT(*) AS count
       FROM orders WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY status`,
      [intervalDays]
    );
    const statusBreakdown = {};
    statusResult.rows.forEach(r => { statusBreakdown[r.status] = Number(r.count); });
    const completed  = statusBreakdown.COMPLETED  || 0;
    const cancelled  = statusBreakdown.CANCELLED  || 0;
    const total      = Number(totalResult.rows[0].total_orders);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // ── Hourly distribution (for today) / Daily trend (for 7 days) ─────────
    let trendData = [];
    if (period === 'today') {
      const hourly = await db.query(
        `SELECT EXTRACT(HOUR FROM created_at)::int AS hour,
                COUNT(*) AS orders,
                COALESCE(SUM(total_price), 0) AS revenue
         FROM orders
         WHERE created_at >= NOW() - INTERVAL '1 day'
           AND status NOT IN ('CANCELLED')
         GROUP BY hour ORDER BY hour`,
        []
      );
      // Fill all 24 hours
      const hourMap = {};
      hourly.rows.forEach(r => { hourMap[r.hour] = r; });
      for (let h = 6; h <= 23; h++) {
        trendData.push({
          label:   `${String(h).padStart(2, '0')}:00`,
          orders:  hourMap[h] ? Number(hourMap[h].orders)  : 0,
          revenue: hourMap[h] ? Number(hourMap[h].revenue) : 0,
        });
      }
    } else {
      const daily = await db.query(
        `SELECT DATE(created_at AT TIME ZONE 'UTC+7') AS day,
                COUNT(*) AS orders,
                COALESCE(SUM(total_price), 0) AS revenue
         FROM orders
         WHERE created_at >= NOW() - INTERVAL '7 days'
           AND status NOT IN ('CANCELLED')
         GROUP BY day ORDER BY day`,
        []
      );
      trendData = daily.rows.map(r => ({
        label:   new Date(r.day).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' }),
        orders:  Number(r.orders),
        revenue: Number(r.revenue),
      }));
    }

    // ── Top dishes ──────────────────────────────────────────────────────────
    const popularResult = await db.query(
      `SELECT mi.name_vi AS name, mi.category, SUM(oi.quantity) AS count,
              SUM(oi.quantity * mi.price) AS revenue
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o      ON oi.order_id = o.id
       WHERE o.created_at >= NOW() - ($1 || ' days')::INTERVAL
         AND o.status NOT IN ('CANCELLED')
       GROUP BY mi.name_vi, mi.category ORDER BY count DESC LIMIT 8`,
      [intervalDays]
    );

    // ── Revenue by category ─────────────────────────────────────────────────
    const categoryResult = await db.query(
      `SELECT mi.category,
              SUM(oi.quantity) AS total_qty,
              SUM(oi.quantity * mi.price) AS revenue
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       JOIN orders o      ON oi.order_id = o.id
       WHERE o.created_at >= NOW() - ($1 || ' days')::INTERVAL
         AND o.status NOT IN ('CANCELLED')
       GROUP BY mi.category ORDER BY revenue DESC`,
      [intervalDays]
    );

    const CATEGORY_LABELS = {
      MAIN_DISH:  'Món chính',
      APPETIZER:  'Nguyên liệu',
      BEVERAGE:   'Đồ uống',
      DESSERT:    'Tráng miệng',
    };

    const CATEGORY_COLORS = {
      MAIN_DISH:  '#f97316',
      APPETIZER:  '#3b82f6',
      BEVERAGE:   '#22c55e',
      DESSERT:    '#ec4899',
    };

    // ── Peak hours ──────────────────────────────────────────────────────────
    const peakResult = await db.query(
      `SELECT EXTRACT(HOUR FROM created_at) AS hour, COUNT(*) AS order_count
       FROM orders WHERE created_at >= NOW() - ($1 || ' days')::INTERVAL
       GROUP BY hour ORDER BY order_count DESC LIMIT 3`,
      [intervalDays]
    );

    return {
      period,
      totalOrders:    total,
      totalRevenue:   Number(totalResult.rows[0].total_revenue),
      averageOrderValue: Math.round(Number(avgResult.rows[0].avg_order_value)),
      completionRate,
      cancelledOrders: cancelled,
      peakHours:   peakResult.rows.map(r => `${String(Number(r.hour)).padStart(2, '0')}:00`),
      trendData,
      popularDishes: popularResult.rows.map(r => ({
        name:     r.name,
        category: r.category,
        count:    Number(r.count),
        revenue:  Number(r.revenue),
      })),
      categoryBreakdown: categoryResult.rows.map(r => ({
        name:    CATEGORY_LABELS[r.category] || r.category,
        key:     r.category,
        qty:     Number(r.total_qty),
        revenue: Number(r.revenue),
        color:   CATEGORY_COLORS[r.category] || '#64748b',
      })),
    };
  }

  async generatePredictiveInsights() {
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

    const allDishes  = menuPerfResult.rows;
    const totalOrders = allDishes.reduce((s, d) => s + Number(d.count), 0);
    const avg = totalOrders / Math.max(allDishes.length, 1);

    const busyPeriods = patternResult.rows.slice(0, 5).map(r => ({
      time:           `${r.day_name.trim()} ${String(Number(r.hour)).padStart(2, '0')}:00`,
      expectedLoad:   r.order_count > 10 ? 'High' : r.order_count > 5 ? 'Medium' : 'Low',
      suggestedStaff: r.order_count > 10 ? 6 : r.order_count > 5 ? 4 : 2,
    }));

    return {
      busyPeriodForecast: busyPeriods.length > 0 ? busyPeriods : [
        { time: 'Friday 18:00', expectedLoad: 'High', suggestedStaff: 6 },
        { time: 'Tuesday 12:00', expectedLoad: 'Low', suggestedStaff: 2 },
      ],
      menuRecommendations: {
        toPromote:            allDishes.filter(d => Number(d.count) >= avg * 1.5).map(d => d.name).slice(0, 3),
        toConsiderRemoving:   allDishes.filter(d => Number(d.count) < avg * 0.5).map(d => d.name).slice(0, 3),
      },
    };
  }
}

module.exports = new ReportGenerator();
