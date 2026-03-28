import { request } from './client';

export async function placeOrder(tableId, items) {
  return request('/orders/', {
    method: 'POST',
    body: JSON.stringify({
      tableId,
      items: items.map((i) => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity,
        specialInstructions: i.specialInstructions || '',
      })),
    }),
  });
}

export async function getOrder(orderId) {
  return request(`/orders/${orderId}`);
}

export async function cancelOrder(orderId) {
  return request(`/orders/${orderId}/cancel`, { method: 'PATCH' });
}
