import { useEffect, useState } from 'react';
import { getOrder } from '../api/orders';

const STATUS_LABELS = {
  PLACED: 'Đã tiếp nhận',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang chế biến',
  READY: 'Sẵn sàng phục vụ',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã huỷ',
};

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'IN_PROGRESS', 'READY', 'COMPLETED'];

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(price));
}

export default function OrderSuccess({ order: initialOrder, tableId, onNewOrder }) {
  const [order, setOrder] = useState(initialOrder);

  // Poll for order status every 5 seconds until COMPLETED or CANCELLED
  useEffect(() => {
    if (['COMPLETED', 'CANCELLED'].includes(order.status)) return;

    const interval = setInterval(async () => {
      try {
        const latest = await getOrder(order.id);
        setOrder(latest);
        if (['COMPLETED', 'CANCELLED'].includes(latest.status)) {
          clearInterval(interval);
        }
      } catch {
        // keep retrying silently
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [order.id, order.status]);

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Đặt món thành công!</h2>
        <p className="success-sub">Nhà bếp đã nhận đơn hàng của bạn</p>

        <div className="status-tracker">
          {STATUS_STEPS.map((step, idx) => (
            <div
              key={step}
              className={`status-step ${idx <= currentStep ? 'status-step--done' : ''} ${idx === currentStep ? 'status-step--active' : ''}`}
            >
              <div className="step-dot" />
              <span className="step-label">{STATUS_LABELS[step]}</span>
            </div>
          ))}
        </div>

        <div className="success-details">
          <div className="detail-row">
            <span>Mã đơn hàng</span>
            <strong>#{order.id}</strong>
          </div>
          <div className="detail-row">
            <span>Bàn số</span>
            <strong>{tableId}</strong>
          </div>
          <div className="detail-row">
            <span>Trạng thái</span>
            <span className={`status-badge status-badge--${order.status?.toLowerCase()}`}>
              {STATUS_LABELS[order.status] || order.status}
            </span>
          </div>
          <div className="detail-row">
            <span>Tổng tiền</span>
            <strong>{formatPrice(order.total_price)}</strong>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="success-items">
            <h4>Danh sách món</h4>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  x{item.quantity} — {item.name || `Món #${item.menu_item_id}`}
                  {item.special_instructions && (
                    <span className="note"> ({item.special_instructions})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="btn-primary btn-full" onClick={onNewOrder}>
          Đặt thêm món
        </button>
      </div>
    </div>
  );
}
