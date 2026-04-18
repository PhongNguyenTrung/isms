import { request } from './client.js';

export const getActiveOrders = (token) =>
  request('/orders/active', { headers: { Authorization: `Bearer ${token}` } });

export const getKitchenTasks = (token) =>
  request('/kitchen/tasks', { headers: { Authorization: `Bearer ${token}` } });
