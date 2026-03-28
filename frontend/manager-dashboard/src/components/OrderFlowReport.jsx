import { useEffect, useState } from 'react';
import { getOrderFlow } from '../api/analytics.js';

const PERIODS = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'last_7_days', label: '7 ngày qua' },
];

function formatPrice(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
    Number(v)
  );
}

export default function OrderFlowReport() {
  const [period, setPeriod] = useState('today');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getOrderFlow(period)
      .then(setData)
      .catch(() => setError('Không thể tải báo cáo.'))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Báo cáo đơn hàng</h2>
        <div className="tab-group">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`tab-btn ${period === p.value ? 'tab-btn--active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading-sm">Đang tải...</div>}
      {error && <div className="error-msg">{error}</div>}

      {data && !loading && (
        <>
          <div className="stat-row">
            <div className="stat-box">
              <div className="stat-num">{data.totalOrders ?? 0}</div>
              <div className="stat-lbl">Tổng đơn hàng</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{formatPrice(data.totalRevenue ?? 0)}</div>
              <div className="stat-lbl">Tổng doanh thu</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{formatPrice(data.averageOrderValue ?? 0)}</div>
              <div className="stat-lbl">Giá trị trung bình</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">
                {data.peakHours?.length ? data.peakHours.join(', ') : '—'}
              </div>
              <div className="stat-lbl">Giờ cao điểm</div>
            </div>
          </div>

          {data.popularDishes?.length > 0 && (
            <div className="popular-dishes">
              <h3 className="sub-title">Món phổ biến nhất</h3>
              <div className="bar-chart">
                {(() => {
                  const max = Math.max(...data.popularDishes.map((d) => d.count), 1);
                  return data.popularDishes.map((dish) => (
                    <div key={dish.name} className="bar-row">
                      <span className="bar-name">{dish.name}</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${(dish.count / max) * 100}%` }}
                        />
                      </div>
                      <span className="bar-count">{dish.count}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
