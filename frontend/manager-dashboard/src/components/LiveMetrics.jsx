import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function MetricCard({ label, value, unit, live }) {
  return (
    <div className="metric-card">
      {live && <span className="live-dot" title="Realtime" />}
      <div className="metric-value">{value ?? '—'}</div>
      {unit && <div className="metric-unit">{unit}</div>}
      <div className="metric-label">{label}</div>
    </div>
  );
}

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState({ active_orders: null, daily_revenue: null });
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io('/', { path: '/analytics.io' });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('initial_state', (data) => {
      setMetrics({
        active_orders: data.active_orders,
        daily_revenue: data.daily_revenue,
      });
    });

    socket.on('metric_update', ({ metric, data }) => {
      setMetrics((prev) => ({ ...prev, [metric]: data }));
    });

    return () => socket.disconnect();
  }, []);

  const formatRevenue = (v) =>
    v != null
      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
      : '—';

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Thời gian thực</h2>
        <span className={`conn-badge ${connected ? 'conn-badge--on' : 'conn-badge--off'}`}>
          {connected ? 'Trực tiếp' : 'Mất kết nối'}
        </span>
      </div>
      <div className="metrics-grid">
        <MetricCard label="Đơn hàng đang xử lý" value={metrics.active_orders} live />
        <MetricCard
          label="Doanh thu hôm nay"
          value={formatRevenue(metrics.daily_revenue)}
          live
        />
      </div>
    </section>
  );
}
