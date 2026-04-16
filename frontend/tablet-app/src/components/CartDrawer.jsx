import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api/orders';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(price));
}

export default function CartDrawer({ tableId, onClose, onOrderSuccess }) {
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (items.length === 0) {
      setError('Giỏ hàng trống');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await placeOrder(tableId, items);
      clearCart();
      onOrderSuccess(result.order);
    } catch (err) {
      setError(err.message || 'Đặt món thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="drawer-header">
          <h2>Giỏ hàng</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <p className="cart-empty">Chưa có món nào</p>
          ) : (
            <ul className="cart-list">
              {items.map(({ menuItem, quantity }) => (
                <li key={menuItem.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{menuItem.name_vi}</span>
                    <span className="cart-item-price">
                      {formatPrice(Number(menuItem.price) * quantity)}
                    </span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="btn-qty"
                      onClick={() => updateQty(menuItem.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      className="btn-qty"
                      onClick={() => updateQty(menuItem.id, quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn-remove"
                      onClick={() => removeItem(menuItem.id)}
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="drawer-footer">
          <div className="total-row">
            <span>Tổng cộng</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            className="btn-primary btn-full"
            onClick={handleSubmit}
            disabled={loading || items.length === 0}
          >
            {loading ? 'Đang đặt món...' : 'Đặt món ngay'}
          </button>
        </div>
      </div>
    </>
  );
}
