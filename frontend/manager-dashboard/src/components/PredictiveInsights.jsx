import { useEffect, useState } from 'react';
import { getPredictiveInsights } from '../api/analytics.js';

const LOAD_COLOR = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' };

export default function PredictiveInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPredictiveInsights()
      .then(setData)
      .catch(() => setError('Không thể tải dự báo.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <h2 className="section-title">Dự báo & Khuyến nghị</h2>

      {loading && <div className="loading-sm">Đang tải...</div>}
      {error && <div className="error-msg">{error}</div>}

      {data && !loading && (
        <div className="insights-grid">
          {/* Busy period forecast */}
          <div className="insight-card">
            <h3 className="sub-title">Dự báo thời điểm bận rộn</h3>
            {data.busyPeriodForecast?.length > 0 ? (
              <table className="insight-table">
                <thead>
                  <tr>
                    <th>Thời điểm</th>
                    <th>Mức độ</th>
                    <th>Nhân viên đề xuất</th>
                  </tr>
                </thead>
                <tbody>
                  {data.busyPeriodForecast.map((row, i) => (
                    <tr key={i}>
                      <td>{row.time}</td>
                      <td>
                        <span
                          className="load-badge"
                          style={{ background: LOAD_COLOR[row.expectedLoad] || '#94a3b8' }}
                        >
                          {row.expectedLoad}
                        </span>
                      </td>
                      <td>{row.suggestedStaff} người</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="empty-text">Chưa có dự báo.</p>
            )}
          </div>

          {/* Menu recommendations */}
          <div className="insight-card">
            <h3 className="sub-title">Khuyến nghị thực đơn</h3>
            {data.menuRecommendations ? (
              <>
                {data.menuRecommendations.toPromote?.length > 0 && (
                  <div className="rec-group">
                    <div className="rec-label rec-label--promote">Nên quảng bá</div>
                    <ul className="rec-list">
                      {data.menuRecommendations.toPromote.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.menuRecommendations.toConsiderRemoving?.length > 0 && (
                  <div className="rec-group">
                    <div className="rec-label rec-label--remove">Cân nhắc loại bỏ</div>
                    <ul className="rec-list">
                      {data.menuRecommendations.toConsiderRemoving.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="empty-text">Chưa có khuyến nghị.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
