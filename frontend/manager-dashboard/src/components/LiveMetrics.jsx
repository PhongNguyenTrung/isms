import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { getActiveOrders, getKitchenTasks } from '../api/orders.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Wifi, WifiOff,
  ShoppingBag, BadgeDollarSign, Timer, Flame,
  AlertCircle, ChefHat, CheckCircle2, Loader2,
  UtensilsCrossed, Clock,
} from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────
function formatPrice(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v ?? 0));
}

function formatPrepTime(v) {
  if (v == null) return '—';
  const m = Math.floor(v / 60);
  const s = v % 60;
  return m > 0 ? `${m}p ${s}s` : `${s}s`;
}

function elapsed(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return '< 1p';
  if (mins < 60) return `${mins}p`;
  return `${Math.floor(mins / 60)}g${mins % 60}p`;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// ── static configs ───────────────────────────────────────────────────────────
const STATUS_LABELS = {
  PLACED:      'Chờ tiếp nhận',
  CONFIRMED:   'Đã tiếp nhận',
  IN_PROGRESS: 'Đang chế biến',
  READY:       'Sẵn sàng phục vụ',
};

const STATUS_BADGE = {
  PLACED:      'border-yellow-700 text-yellow-400 bg-yellow-900/20',
  CONFIRMED:   'border-blue-700 text-blue-400 bg-blue-900/20',
  IN_PROGRESS: 'border-orange-700 text-orange-400 bg-orange-900/20',
  READY:       'border-green-700 text-green-400 bg-green-900/20',
};

const STATUS_DOT = {
  PLACED:      'bg-yellow-400',
  CONFIRMED:   'bg-blue-400',
  IN_PROGRESS: 'bg-orange-400',
  READY:       'bg-green-400',
};

const STATUS_ORDER = ['PLACED', 'CONFIRMED', 'IN_PROGRESS', 'READY'];

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color = 'text-slate-100', iconBg = 'bg-slate-700/60', alert }) {
  return (
    <Card className={`bg-slate-900 border-slate-800 relative overflow-hidden ${alert ? 'ring-1 ring-yellow-600/60' : ''}`}>
      {alert && <div className="absolute inset-x-0 top-0 h-0.5 bg-yellow-500 animate-pulse" />}
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500">{label}</p>
          <p className={`text-xl font-bold leading-tight mt-0.5 ${color}`}>{value ?? '—'}</p>
          {sub && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function LiveMetrics() {
  const { token } = useAuth();

  // WebSocket metrics
  const [wsMetrics, setWsMetrics] = useState({ active_orders: null, daily_revenue: null, avg_prep_time: null });
  const [connected, setConnected]  = useState(false);

  // REST-polled data
  const [orders, setOrders]         = useState([]);
  const [kitchenTasks, setKitchenTasks] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const intervalRef = useRef(null);

  // ── WebSocket ──
  useEffect(() => {
    const socket = io('/', { path: '/analytics.io' });
    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('initial_state', (d) => setWsMetrics({ active_orders: d.active_orders, daily_revenue: d.daily_revenue, avg_prep_time: d.avg_prep_time }));
    socket.on('metric_update', ({ metric, data }) => setWsMetrics((p) => ({ ...p, [metric]: data })));
    return () => socket.disconnect();
  }, []);

  // ── REST poll ──
  const fetchOperationalData = useCallback(async () => {
    try {
      const [ord, tasks] = await Promise.all([
        getActiveOrders(token),
        getKitchenTasks(token),
      ]);
      setOrders(Array.isArray(ord) ? ord : []);
      setKitchenTasks(Array.isArray(tasks) ? tasks : []);
      setLastUpdated(new Date());
    } catch {
      // silently ignore — WebSocket data still shows
    }
  }, [token]);

  useEffect(() => {
    fetchOperationalData();
    intervalRef.current = setInterval(fetchOperationalData, 10000);
    return () => clearInterval(intervalRef.current);
  }, [fetchOperationalData]);

  // ── Derived ──
  const statusCounts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const placedCount      = statusCounts.PLACED || 0;
  const readyCount       = statusCounts.READY  || 0;
  const kitchPending     = kitchenTasks.filter((t) => t.status === 'PENDING').length;
  const kitchCooking     = kitchenTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const kitchOverload    = kitchenTasks.length >= 10;

  const avgOrderValue = orders.length > 0
    ? orders.reduce((s, o) => s + Number(o.total_price), 0) / orders.length
    : 0;

  // Recent activity: last 8 orders sorted newest first
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Tổng quan vận hành</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lastUpdated
              ? `Cập nhật lúc ${lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
              : 'Đang tải...'}
          </p>
        </div>
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
      </div>

      {/* ── Alert banner ── */}
      {(placedCount > 0 || readyCount > 0 || kitchOverload) && (
        <div className="flex flex-wrap gap-2">
          {placedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-900/25 border border-yellow-700/60 rounded-lg text-yellow-400 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {placedCount} đơn chờ tiếp nhận
            </div>
          )}
          {readyCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-900/25 border border-green-700/60 rounded-lg text-green-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              {readyCount} đơn sẵn sàng phục vụ
            </div>
          )}
          {kitchOverload && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-900/25 border border-red-700/60 rounded-lg text-red-400 text-xs font-medium animate-pulse">
              <Flame className="w-3.5 h-3.5 flex-shrink-0" />
              Bếp quá tải — {kitchenTasks.length} nhiệm vụ đang xử lý
            </div>
          )}
        </div>
      )}

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={ShoppingBag}
          label="Đơn đang hoạt động"
          value={wsMetrics.active_orders ?? orders.length}
          sub={`${placedCount} chờ xác nhận`}
          color="text-blue-400"
          iconBg="bg-blue-900/40"
          alert={placedCount > 0}
        />
        <KpiCard
          icon={BadgeDollarSign}
          label="Doanh thu hôm nay"
          value={formatPrice(wsMetrics.daily_revenue)}
          color="text-green-400"
          iconBg="bg-green-900/40"
        />
        <KpiCard
          icon={UtensilsCrossed}
          label="Giá trị TB / đơn"
          value={orders.length > 0 ? formatPrice(avgOrderValue) : '—'}
          sub={`${orders.length} đơn đang xử lý`}
          color="text-orange-400"
          iconBg="bg-orange-900/40"
        />
        <KpiCard
          icon={Timer}
          label="Thời gian chế biến TB"
          value={formatPrepTime(wsMetrics.avg_prep_time)}
          color="text-purple-400"
          iconBg="bg-purple-900/40"
        />
      </div>

      {/* ── Operational status row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Order status breakdown */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pt-4 pb-2 px-4">
            <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
              Trạng thái đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 grid grid-cols-2 gap-3">
            {STATUS_ORDER.map((s) => (
              <div key={s} className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[s]}`} />
                  <span className="text-xs text-slate-400 leading-tight">{STATUS_LABELS[s]}</span>
                </div>
                <span className={`text-lg font-bold ${statusCounts[s] > 0 ? 'text-slate-100' : 'text-slate-600'}`}>
                  {statusCounts[s]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Kitchen queue */}
        <Card className={`bg-slate-900 border-slate-800 ${kitchOverload ? 'ring-1 ring-red-700/50' : ''}`}>
          <CardHeader className="pt-4 pb-2 px-4">
            <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ChefHat className="w-3.5 h-3.5 text-slate-400" />
              Trạng thái bếp
              {kitchOverload && (
                <Badge variant="outline" className="ml-auto text-[10px] px-1.5 border-red-700 text-red-400 bg-red-900/20 animate-pulse">
                  Quá tải
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {/* Pending bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  Chờ xử lý
                </span>
                <span className="font-semibold text-yellow-400">{kitchPending}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ width: kitchenTasks.length > 0 ? `${(kitchPending / Math.max(kitchenTasks.length, 1)) * 100}%` : '0%' }}
                />
              </div>
            </div>

            {/* Cooking bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  Đang nấu
                </span>
                <span className="font-semibold text-orange-400">{kitchCooking}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all"
                  style={{ width: kitchenTasks.length > 0 ? `${(kitchCooking / Math.max(kitchenTasks.length, 1)) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between border-t border-slate-800 text-xs text-slate-500">
              <span>Tổng nhiệm vụ đang hoạt động</span>
              <span className={`font-semibold ${kitchOverload ? 'text-red-400' : 'text-slate-300'}`}>
                {kitchenTasks.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent activity ── */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pt-4 pb-2 px-4">
          <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Hoạt động gần đây
            <span className="ml-auto text-[11px] text-slate-500 font-normal">{orders.length} đơn đang xử lý</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-600">
              <UtensilsCrossed className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentOrders.map((order) => {
                const mins = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
                const isUrgent = order.status === 'PLACED' && mins >= 3;
                return (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    {/* Status dot */}
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[order.status] || 'bg-slate-500'}`} />

                    {/* Table */}
                    <span className="text-xs font-semibold text-slate-300 w-16 flex-shrink-0">
                      Bàn {order.table_id}
                    </span>

                    {/* Status badge */}
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 flex-shrink-0 ${STATUS_BADGE[order.status] || 'border-slate-700 text-slate-400'}`}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </Badge>

                    {/* Spacer */}
                    <span className="flex-1" />

                    {/* Price */}
                    <span className="text-xs text-slate-300 font-medium flex-shrink-0">
                      {formatPrice(order.total_price)}
                    </span>

                    {/* Time */}
                    <span className={`text-[11px] flex-shrink-0 w-14 text-right ${isUrgent ? 'text-red-400 font-semibold' : 'text-slate-500'}`}>
                      {elapsed(order.created_at)}
                    </span>

                    {/* Created at */}
                    <span className="text-[10px] text-slate-600 flex-shrink-0 w-10 text-right hidden sm:block">
                      {formatTime(order.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
