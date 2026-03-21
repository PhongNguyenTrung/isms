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
