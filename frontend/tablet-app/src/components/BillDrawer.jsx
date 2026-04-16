import { useEffect, useState } from 'react';
import { getTableBill, requestPayment } from '../api/orders';

const STATUS_LABELS = {
  PLACED: 'Đã tiếp nhận',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang chế biến',
  READY: 'Sẵn sàng',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã huỷ',
};

const STATUS_COLOR = {
  PLACED: '#C8962A',
  CONFIRMED: '#2563eb',
  IN_PROGRESS: '#d97706',
  READY: '#16a34a',
  COMPLETED: '#6b7280',
  CANCELLED: '#ef4444',
};

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(price));
}

export default function BillDrawer({ tableId, onClose }) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentRequested, setPaymentRequested] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchBill();
    // Poll more frequently after payment requested to catch completion quickly
    const interval = setInterval(fetchBill, paymentRequested ? 3000 : 8000);
    return () => clearInterval(interval);
  }, [tableId, paymentRequested]);

  async function fetchBill() {
    try {
      const data = await getTableBill(tableId);
      setBill(data);
    } catch {
      setError('Không thể tải bill. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestPayment() {
    setPaymentLoading(true);
    try {
      await requestPayment(tableId);
      setPaymentRequested(true);
    } catch {
      setError('Gọi thanh toán thất bại, vui lòng thử lại.');
    } finally {
      setPaymentLoading(false);
    }
  }

  const hasActiveOrders = bill?.orders?.length > 0;
  const isPaid = !loading && bill !== null && !hasActiveOrders && paymentRequested;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="drawer-header">
          <h2>🧾 Bill bàn {tableId}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-body">
          {loading && <p className="cart-empty">Đang tải bill...</p>}
          {error && <div className="error-message">{error}</div>}

          {isPaid && (
            <div className="paid-banner">
              <div className="paid-icon">✓</div>
              <h3>Đã thanh toán</h3>
              <p>Cảm ơn quý khách! Hẹn gặp lại.</p>
            </div>
          )}

          {!loading && !hasActiveOrders && !isPaid && (
            <p className="cart-empty">Chưa có đơn hàng nào.</p>
          )}

          {bill?.orders?.map((order, idx) => (
            <div key={order.id} className="bill-order-group">
              <div className="bill-order-header">
                <span className="bill-order-label">Đơn #{idx + 1}</span>
                <span
                  className="bill-order-status"
                  style={{ color: STATUS_COLOR[order.status] || '#666' }}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <ul className="bill-item-list">
                {order.items.map((item) => (
                  <li key={item.id} className="bill-item">
                    <span className="bill-item-name">
                      x{item.quantity} {item.name}
                    </span>
                    <span className="bill-item-price">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="bill-order-subtotal">
                <span>Tạm tính</span>
                <span>{formatPrice(order.total_price)}</span>
              </div>
            </div>
          ))}
        </div>

        {hasActiveOrders && (
          <div className="drawer-footer">
            <div className="total-row">
              <span>Tổng cộng</span>
              <strong>{formatPrice(bill.grandTotal)}</strong>
            </div>

            {paymentRequested ? (
              <div className="payment-requested-banner">
                ✓ Nhân viên đang đến — vui lòng chờ
              </div>
            ) : (
              <button
                className="btn-primary btn-full btn-pay"
                onClick={handleRequestPayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Đang gọi...' : '💳 Gọi thanh toán'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
