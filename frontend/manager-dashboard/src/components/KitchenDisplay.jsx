import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  IN_PROGRESS: 'Đang chế biến',
  READY: 'Sẵn sàng',
  COMPLETED: 'Hoàn thành',
};

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  READY: '#22c55e',
  COMPLETED: '#64748b',
};

function TaskCard({ task, onUpdateStatus }) {
  const items = typeof task.items === 'string' ? JSON.parse(task.items) : task.items;
  const elapsed = Math.floor((Date.now() - new Date(task.created_at).getTime()) / 60000);

  const nextStatus = { PENDING: 'IN_PROGRESS', IN_PROGRESS: 'READY', READY: 'COMPLETED' };
  const next = nextStatus[task.status];

  return (
    <div className="task-card" style={{ borderLeft: `4px solid ${STATUS_COLORS[task.status] || '#64748b'}` }}>
      <div className="task-header">
        <span className="task-table">Bàn {task.table_id}</span>
        <span className="task-order">#{task.order_id}</span>
        <span className="task-elapsed">{elapsed} phút</span>
      </div>

      <ul className="task-items">
        {items && items.map((item, idx) => (
          <li key={idx}>
            <span className="item-qty">x{item.quantity}</span>
            <span className="item-name">{item.category || ''} #{item.menuItemId || item.menu_item_id}</span>
            {item.specialInstructions && (
              <span className="item-note">{item.specialInstructions}</span>
            )}
          </li>
        ))}
      </ul>

      <div className="task-footer">
        <span className="task-status-badge" style={{ background: STATUS_COLORS[task.status] + '30', color: STATUS_COLORS[task.status] }}>
          {STATUS_LABELS[task.status]}
        </span>
        <span className="task-priority">Ưu tiên: {task.priority_score}</span>
        {next && (
          <button className="btn-status" onClick={() => onUpdateStatus(task.id, next)}>
            {STATUS_LABELS[next]} →
          </button>
        )}
      </div>
    </div>
  );
}

export default function KitchenDisplay() {
  const [tasks, setTasks] = useState([]);
  const [connected, setConnected] = useState(false);
  const [overloadAlert, setOverloadAlert] = useState(null);
  const [filter, setFilter] = useState('active'); // 'active' | 'all'
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('initial_queue', (initialTasks) => {
      setTasks(initialTasks);
    });

    socket.on('new_kitchen_task', (task) => {
      setTasks((prev) => [task, ...prev]);
    });

    socket.on('task_status_updated', (updated) => {
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    });

    socket.on('kitchen_overload', (data) => {
      setOverloadAlert(data);
      setTimeout(() => setOverloadAlert(null), 10000);
    });

    return () => socket.disconnect();
  }, []);

  const updateStatus = (taskId, status) => {
    socketRef.current?.emit('update_task_status', { taskId, status });
  };

  const displayed = filter === 'active'
    ? tasks.filter((t) => ['PENDING', 'IN_PROGRESS'].includes(t.status))
    : tasks;

  const sorted = [...displayed].sort((a, b) => b.priority_score - a.priority_score || new Date(a.created_at) - new Date(b.created_at));

  const counts = {
    PENDING: tasks.filter(t => t.status === 'PENDING').length,
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    READY: tasks.filter(t => t.status === 'READY').length,
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">Màn hình nhà bếp (KDS)</h2>
        <span className={`conn-badge ${connected ? 'conn-badge--on' : 'conn-badge--off'}`}>
          {connected ? 'Trực tiếp' : 'Mất kết nối'}
        </span>
      </div>

      {overloadAlert && (
        <div className="overload-alert">
          ⚠ QUÁ TẢI — {overloadAlert.activeTaskCount} đơn đang chờ! Cần thêm nhân lực.
        </div>
      )}

      <div className="kds-stats">
        <div className="kds-stat" style={{ color: STATUS_COLORS.PENDING }}>
          <strong>{counts.PENDING}</strong> Chờ
        </div>
        <div className="kds-stat" style={{ color: STATUS_COLORS.IN_PROGRESS }}>
          <strong>{counts.IN_PROGRESS}</strong> Đang làm
        </div>
        <div className="kds-stat" style={{ color: STATUS_COLORS.READY }}>
          <strong>{counts.READY}</strong> Sẵn sàng
        </div>
      </div>

      <div className="kds-filter">
        <button className={`tab-btn ${filter === 'active' ? 'tab-btn--active' : ''}`} onClick={() => setFilter('active')}>
          Đang hoạt động
        </button>
        <button className={`tab-btn ${filter === 'all' ? 'tab-btn--active' : ''}`} onClick={() => setFilter('all')}>
          Tất cả
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="empty-text" style={{ padding: '24px 0' }}>Không có đơn nào đang hoạt động</p>
      ) : (
        <div className="task-grid">
          {sorted.map((task) => (
            <TaskCard key={task.id} task={task} onUpdateStatus={updateStatus} />
          ))}
        </div>
      )}
    </section>
  );
}
