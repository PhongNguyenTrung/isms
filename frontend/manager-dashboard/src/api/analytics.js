import { request } from './client.js';

export async function getOrderFlow(period = 'today') {
  return request(`/analytics/reports/order-flow?period=${period}`);
}

export async function getPredictiveInsights() {
  return request('/analytics/insights/predictive');
}
