function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(price));
}

export default function OrderSuccess({ order, tableId, onNewOrder }) {
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Đặt món thành công!</h2>
        <p className="success-sub">Nhà bếp đã nhận đơn hàng của bạn</p>

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
            <span className="status-badge">Đang chế biến</span>
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
                  x{item.quantity} — Món #{item.menu_item_id}
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
