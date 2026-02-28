const express = require('express');
const router = express.Router();
const ReportGenerator = require('../services/ReportGenerator');

/**
 * GET /api/analytics/reports/order-flow
 * Generates an order flow and turnover report (FR13)
 */
router.get('/reports/order-flow', async (req, res) => {
  try {
    const { period } = req.query; // e.g., 'today', 'last_7_days'
    const report = await ReportGenerator.generateOrderFlowReport(period || 'today');
    res.json(report);
  } catch (error) {
    console.error('Error generating order flow report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * GET /api/analytics/insights/predictive
 * Generate predictive insights for staffing and menu optimization (FR14)
 */
router.get('/insights/predictive', async (req, res) => {
  try {
    const insights = await ReportGenerator.generatePredictiveInsights();
    res.json(insights);
  } catch (error) {
    console.error('Error generating predictive insights:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
