import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Wifi, WifiOff, ChefHat, Coffee, IceCream } from 'lucide-react';

// ─── Station config ──────────────────────────────────────────────────────────
const STATIONS = [
  { id: 'ALL',          label: 'Tất cả',      icon: null,       color: '#64748b', border: 'border-slate-700', active: 'bg-slate-700 text-slate-100' },
  { id: 'Bếp chính',   label: 'Bếp chính',   icon: ChefHat,    color: '#f97316', border: 'border-orange-700', active: 'bg-orange-700 text-white' },
  { id: 'Quầy bar',    label: 'Quầy bar',    icon: Coffee,     color: '#3b82f6', border: 'border-blue-700',   active: 'bg-blue-700 text-white' },
  { id: 'Tráng miệng', label: 'Tráng miệng', icon: IceCream,   color: '#ec4899', border: 'border-pink-700',   active: 'bg-pink-700 text-white' },
];

const STATION_META = Object.fromEntries(STATIONS.map((s) => [s.id, s]));

// ─── Status config ───────────────────────────────────────────────────────────
const STATUS_LABELS = {
  PENDING:     'Chờ xử lý',
  IN_PROGRESS: 'Đang chế biến',
  READY:       'Sẵn sàng',
  COMPLETED:   'Hoàn thành',
  CANCELLED:   'Đã huỷ',
};

const STATUS_BADGE = {
  PENDING:     'border-yellow-700 text-yellow-400 bg-yellow-900/20',
  IN_PROGRESS: 'border-blue-700  text-blue-400  bg-blue-900/20',
  READY:       'border-green-700 text-green-400 bg-green-900/20',
  COMPLETED:   'border-slate-700 text-slate-400 bg-slate-800/50',
  CANCELLED:   'border-red-800   text-red-400   bg-red-900/20',
};

const STATUS_BORDER = {
  PENDING:     '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  READY:       '#22c55e',
  COMPLETED:   '#475569',
  CANCELLED:   '#ef4444',
};

const NEXT_STATUS = { PENDING: 'IN_PROGRESS', IN_PROGRESS: 'READY', READY: 'COMPLETED' };

const NEXT_LABEL = {
  IN_PROGRESS: 'Bắt đầu nấu',
  READY:       'Hoàn thành nấu',
  COMPLETED:   'Đã phục vụ',
};

// ─── TaskCard ────────────────────────────────────────────────────────────────
function TaskCard({ task, onUpdateStatus, canUpdate }) {
  const items    = typeof task.items === 'string' ? JSON.parse(task.items) : task.items;
  const elapsed  = Math.floor((Date.now() - new Date(task.created_at).getTime()) / 60000);
  const next     = NEXT_STATUS[task.status];
  const station  = STATION_META[task.station] || STATION_META['ALL'];
  const isUrgent = task.status === 'PENDING' && elapsed >= 5;
  const isReady  = task.status === 'READY';

  return (
    <Card
      className={`bg-slate-900 border-slate-800 overflow-hidden transition-all ${isReady ? 'ring-1 ring-green-700/50' : ''}`}
      style={{ borderLeft: `3px solid ${STATUS_BORDER[task.status] || '#475569'}` }}
    >
      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Station badge */}
          <span
            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
            style={{ color: station.color, background: `${station.color}18` }}
          >
            {station.icon && <station.icon className="w-2.5 h-2.5" />}
            {task.station || 'Bếp chính'}
          </span>
          <span className="text-xs text-slate-500">Bàn {task.table_id}</span>
          <span className="text-[10px] text-slate-600">#{task.order_id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-xs ${isUrgent ? 'text-red-400 font-semibold animate-pulse' : 'text-slate-500'}`}>
            <Clock className="w-3 h-3" />
            {elapsed < 1 ? '< 1p' : `${elapsed}p`}
          </span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${STATUS_BADGE[task.status] || ''}`}>
            {STATUS_LABELS[task.status]}
          </Badge>
        </div>
      </div>

      {/* Items */}
      <CardContent className="px-4 pb-3 pt-0 space-y-2">
        <ul className="space-y-1 border-t border-slate-800 pt-2">
          {items?.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-blue-400 font-bold flex-shrink-0 w-6">×{item.quantity}</span>
              <span className="text-slate-200 flex-1 leading-tight">
                {item.name || `${item.category} #${item.menuItemId || item.menu_item_id}`}
              </span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800">
          <span className="text-xs text-slate-600">P{task.priority_score}</span>
          {canUpdate && next && (
            <Button
              size="sm"
              onClick={() => onUpdateStatus(task.id, next)}
              className={`h-7 text-xs px-3 gap-1 ${
                next === 'IN_PROGRESS' ? 'bg-orange-700 hover:bg-orange-600 text-white border-0' :
                next === 'READY'       ? 'bg-green-700 hover:bg-green-600 text-white border-0' :
                                         'bg-slate-700 hover:bg-slate-600 text-slate-100 border-0'
              }`}
            >
              {NEXT_LABEL[next]} →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function KitchenDisplay({ canUpdate = false }) {
  const { token } = useAuth();
  const [tasks, setTasks]             = useState([]);
  const [connected, setConnected]     = useState(false);
  const [overloadAlert, setOverloadAlert] = useState(null);
  const [statusFilter, setStatusFilter]   = useState('active'); // active | all
  const [stationFilter, setStationFilter] = useState('ALL');
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io('/', { path: '/socket.io', auth: { token } });
    socketRef.current = socket;
    socket.on('connect',              () => setConnected(true));
    socket.on('disconnect',           () => setConnected(false));
    socket.on('initial_queue',        (data) => setTasks(data));
    socket.on('new_kitchen_task',     (task) => setTasks((prev) => [task, ...prev]));
    socket.on('task_status_updated',  (upd)  => setTasks((prev) => prev.map((t) => t.id === upd.id ? upd : t)));
    socket.on('kitchen_overload',     (data) => {
      setOverloadAlert(data);
      setTimeout(() => setOverloadAlert(null), 10000);
    });
    return () => socket.disconnect();
  }, []);

  const updateStatus = (taskId, status) => {
    socketRef.current?.emit('update_task_status', { taskId, status });
  };

  // Filter by status
  const byStatus = statusFilter === 'active'
    ? tasks.filter((t) => ['PENDING', 'IN_PROGRESS', 'READY'].includes(t.status))
    : tasks;

  // Filter by station
  const byStation = stationFilter === 'ALL'
    ? byStatus
    : byStatus.filter((t) => (t.station || 'Bếp chính') === stationFilter);

  // Sort by priority desc, then time asc
  const sorted = [...byStation].sort(
    (a, b) => b.priority_score - a.priority_score || new Date(a.created_at) - new Date(b.created_at)
  );

  // Counts per station (active only)
  const activeTasks = tasks.filter((t) => ['PENDING', 'IN_PROGRESS', 'READY'].includes(t.status));
  const stationCounts = activeTasks.reduce((acc, t) => {
    const s = t.station || 'Bếp chính';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Status summary counts
  const counts = {
    PENDING:     activeTasks.filter((t) => t.status === 'PENDING').length,
    IN_PROGRESS: activeTasks.filter((t) => t.status === 'IN_PROGRESS').length,
    READY:       activeTasks.filter((t) => t.status === 'READY').length,
  };

  return (
    <div className="space-y-4">

      {/* ── Connection + status summary ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <Badge
            variant="outline"
            className={connected
              ? 'border-green-700 text-green-400 bg-green-900/20'
              : 'border-slate-700 text-slate-500 bg-slate-800/30'}
          >
            {connected
              ? <><Wifi className="w-3 h-3 mr-1.5" /><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block mr-1" />Trực tiếp</>
              : <><WifiOff className="w-3 h-3 mr-1.5" />Mất kết nối</>}
          </Badge>

          {/* Status counts */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-yellow-400 flex items-center gap-1">
              <strong>{counts.PENDING}</strong>
              <span className="text-slate-500 text-xs">Chờ</span>
            </span>
            <span className="text-blue-400 flex items-center gap-1">
              <strong>{counts.IN_PROGRESS}</strong>
              <span className="text-slate-500 text-xs">Đang nấu</span>
            </span>
            <span className="text-green-400 flex items-center gap-1">
              <strong>{counts.READY}</strong>
              <span className="text-slate-500 text-xs">Sẵn sàng</span>
            </span>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex gap-1">
          {[['active', 'Đang hoạt động'], ['all', 'Tất cả']].map(([f, label]) => (
            <Button
              key={f}
              size="sm"
              variant={statusFilter === f ? 'secondary' : 'ghost'}
              onClick={() => setStatusFilter(f)}
              className={statusFilter === f ? 'bg-slate-700 text-slate-100 h-7 text-xs' : 'text-slate-400 hover:text-slate-100 h-7 text-xs'}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Station tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {STATIONS.map((s) => {
          const count = s.id === 'ALL' ? activeTasks.length : (stationCounts[s.id] || 0);
          const isActive = stationFilter === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStationFilter(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                isActive
                  ? `${s.active} border-transparent`
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }`}
            >
              {s.icon && <s.icon className="w-3.5 h-3.5" />}
              {s.label}
              {count > 0 && (
                <span className={`ml-0.5 px-1.5 py-0 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-slate-700 text-slate-300'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Overload alert ── */}
      {overloadAlert && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm font-medium animate-pulse">
          ⚠ QUÁ TẢI — {overloadAlert.activeTaskCount} nhiệm vụ đang chờ! Cần thêm nhân lực.
        </div>
      )}

      {/* ── Task grid ── */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-4xl mb-3">🍳</div>
          <p className="text-sm">
            {stationFilter === 'ALL' ? 'Không có đơn nào đang hoạt động' : `${stationFilter} không có đơn nào`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={updateStatus}
              canUpdate={canUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
