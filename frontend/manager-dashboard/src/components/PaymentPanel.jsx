import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = '/api/orders';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export default function PaymentPanel() {
  const { token } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null); // tableId being confirmed

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 5000);
    return () => clearInterval(interval);
  }, []);

  const authHeaders = { Authorization: `Bearer ${token}` };

  async function fetchTables() {
    try {
      const res = await fetch(`${API}/active-tables`, { headers: authHeaders });
      const data = await res.json();
      setTables(Array.isArray(data) ? data : []);
    } catch {
      // silent retry
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(tableId) {
    setConfirming(tableId);
    try {
      const res = await fetch(`${API}/table/${tableId}/complete-payment`, {
        method: 'POST',
        headers: authHeaders,
      });
      if (res.ok) {
        setTables((prev) => prev.filter((t) => t.table_id !== tableId));
      }
    } catch {
      // ignore
    } finally {
      setConfirming(null);
    }
  }

  return (
    <div className="payment-panel">
      <div className="panel-header">
        <h2>Bàn đang hoạt động</h2>
        <span className="panel-count">{tables.length} bàn</span>
      </div>

      {loading && <p className="panel-empty">Đang tải...</p>}
      {!loading && tables.length === 0 && (
        <p className="panel-empty">Không có bàn nào đang hoạt động.</p>
      )}

      <div className="table-grid">
        {tables.map((t) => (
          <div key={t.table_id} className="table-card">
            <div className="table-card-header">
              <span className="table-id">Bàn {t.table_id}</span>
              <span className="table-time">Từ {formatTime(t.first_order_at)}</span>
            </div>
            <div className="table-card-body">
              <div className="table-stat">
                <span>Số đơn</span>
                <strong>{t.order_count}</strong>
              </div>
              <div className="table-stat">
                <span>Tổng tiền</span>
                <strong className="table-total">{formatPrice(t.grand_total)}</strong>
              </div>
            </div>
            <button
              className="btn-confirm-payment"
              onClick={() => handleConfirm(t.table_id)}
              disabled={confirming === t.table_id}
            >
              {confirming === t.table_id ? 'Đang xử lý...' : '✓ Xác nhận đã thu tiền'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
