import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_LABELS = {
  PLACED:      'Chờ tiếp nhận',
  CONFIRMED:   'Đã tiếp nhận',
  IN_PROGRESS: 'Đang chế biến',
  READY:       'Sẵn sàng phục vụ',
};

const STATUS_BADGE = {
  PLACED:      'border-yellow-700 text-yellow-400 bg-yellow-900/20',
  CONFIRMED:   'border-blue-700  text-blue-400  bg-blue-900/20',
  IN_PROGRESS: 'border-orange-700 text-orange-400 bg-orange-900/20',
  READY:       'border-green-700 text-green-400 bg-green-900/20',
};

const STATUS_BORDER = {
  PLACED:      '#f59e0b',
  CONFIRMED:   '#3b82f6',
  IN_PROGRESS: '#f97316',
  READY:       '#22c55e',
};

function formatPrice(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v));
}

function elapsed(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return '< 1 phút';
  if (mins < 60) return `${mins} phút`;
  return `${Math.floor(mins / 60)}g ${mins % 60}p`;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function OrderCard({ order, canAct, acting, onAction }) {
  const [expanded, setExpanded] = useState(true);
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items ?? []);
  const isActing = acting === order.id;
  const mins = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);
  const isUrgent = order.status === 'PLACED' && mins >= 3;

  return (
    <Card
      className="bg-slate-900 border-slate-800 overflow-hidden"
      style={{ borderLeft: `3px solid ${STATUS_BORDER[order.status] || '#475569'}` }}
    >
      {/* Card header — only chevron toggles expand */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">#{order.id}</span>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${STATUS_BADGE[order.status] || 'border-slate-700 text-slate-400'}`}>
            {STATUS_LABELS[order.status] || order.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-xs ${isUrgent ? 'text-red-400 font-semibold' : 'text-slate-500'}`}>
            <Clock className="w-3 h-3" />
            {elapsed(order.created_at)}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded hover:bg-slate-700 text-slate-600 hover:text-slate-300 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <CardContent className="px-4 pb-4 space-y-3 pt-0">
          {/* Items */}
          <ul className="space-y-1 border-t border-slate-800 pt-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-blue-400 font-medium flex-shrink-0 w-6">×{item.quantity}</span>
                <span className="text-slate-300 flex-1 leading-tight">{item.name}</span>
                <span className="text-slate-500 text-xs flex-shrink-0">{formatPrice(Number(item.price) * item.quantity)}</span>
              </li>
            ))}
            {items.some((i) => i.special_instructions) && (
              <li className="text-xs text-amber-400/80 italic pl-8">
                * {items.filter((i) => i.special_instructions).map((i) => i.special_instructions).join(' · ')}
              </li>
            )}
          </ul>

          {/* Footer */}
          <div className="flex justify-between items-center pt-1 border-t border-slate-800">
            <span className="text-sm font-semibold text-slate-200">{formatPrice(order.total_price)}</span>
            {canAct && (
              <div className="flex gap-1.5">
                {order.status === 'PLACED' && (
                  <Button
                    size="sm"
                    disabled={isActing}
                    onClick={(e) => { e.stopPropagation(); onAction(order.id, 'confirm'); }}
                    className="h-7 text-xs bg-blue-700 hover:bg-blue-600 text-white gap-1 px-2.5"
                  >
                    {isActing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                    Tiếp nhận
                  </Button>
                )}
                {['PLACED', 'CONFIRMED'].includes(order.status) && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isActing}
                    onClick={(e) => { e.stopPropagation(); onAction(order.id, 'cancel'); }}
                    className="h-7 text-xs border-red-900 text-red-400 hover:bg-red-900/30 gap-1 px-2.5"
                  >
                    {isActing ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                    Từ chối
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function OrdersPanel() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing]   = useState(null);
  const canAct = ['MANAGER', 'WAITER'].includes(user.role);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders/active', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error();
      setOrders(await res.json());
    } catch {
      toast({ title: 'Không thể tải đơn hàng', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 8000);
    return () => clearInterval(id);
  }, [fetchOrders]);

  async function handleAction(orderId, action) {
    setActing(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/${action}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast({ title: action === 'confirm' ? '✓ Đã tiếp nhận đơn' : 'Đã từ chối đơn' });
      await fetchOrders();
    } catch (err) {
      toast({ title: err.message || 'Thao tác thất bại', variant: 'destructive' });
    } finally {
      setActing(null);
    }
  }

  async function confirmAll() {
    const placed = orders.filter((o) => o.status === 'PLACED');
    for (const o of placed) await handleAction(o.id, 'confirm');
  }

  // Sort: PLACED first (urgent last created), then READY, then others — within each group by created_at asc
  const sorted = [...orders].sort((a, b) => {
    const rank = { PLACED: 0, READY: 1, IN_PROGRESS: 2, CONFIRMED: 3 };
    const ra = rank[a.status] ?? 9;
    const rb = rank[b.status] ?? 9;
    if (ra !== rb) return ra - rb;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  const byTable = sorted.reduce((acc, o) => {
    if (!acc[o.table_id]) acc[o.table_id] = [];
    acc[o.table_id].push(o);
    return acc;
  }, {});

  const counts = {
    PLACED:      orders.filter((o) => o.status === 'PLACED').length,
    CONFIRMED:   orders.filter((o) => o.status === 'CONFIRMED').length,
    IN_PROGRESS: orders.filter((o) => o.status === 'IN_PROGRESS').length,
    READY:       orders.filter((o) => o.status === 'READY').length,
  };

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { key: 'PLACED',      label: 'Chờ tiếp nhận', color: 'text-yellow-400', bg: 'bg-yellow-900/10 border-yellow-900/40' },
          { key: 'CONFIRMED',   label: 'Đã tiếp nhận',  color: 'text-blue-400',   bg: 'bg-blue-900/10 border-blue-900/40' },
          { key: 'IN_PROGRESS', label: 'Đang chế biến', color: 'text-orange-400', bg: 'bg-orange-900/10 border-orange-900/40' },
          { key: 'READY',       label: 'Sẵn sàng',      color: 'text-green-400',  bg: 'bg-green-900/10 border-green-900/40' },
        ].map(({ key, label, color, bg }) => (
          <div key={key} className={`rounded-lg border px-4 py-3 ${bg}`}>
            <div className={`text-2xl font-bold ${color}`}>{counts[key]}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {counts.PLACED > 0 && canAct && (
            <Button
              size="sm"
              onClick={confirmAll}
              className="bg-blue-700 hover:bg-blue-600 text-white gap-1.5 text-xs h-8"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Tiếp nhận tất cả ({counts.PLACED})
            </Button>
          )}
          {counts.READY > 0 && (
            <Badge className="bg-green-900/30 text-green-400 border border-green-800 animate-pulse text-xs">
              {counts.READY} đơn sẵn sàng phục vụ!
            </Badge>
          )}
        </div>
        <Button size="sm" variant="ghost" onClick={fetchOrders} className="text-slate-400 hover:text-slate-100 gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </Button>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
        </div>
      ) : Object.keys(byTable).length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="text-sm">Không có đơn hàng nào đang hoạt động</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(byTable).map(([tableId, tableOrders]) => {
            const tableTotal = tableOrders.reduce((s, o) => s + Number(o.total_price), 0);
            const hasPlaced  = tableOrders.some((o) => o.status === 'PLACED');
            const hasReady   = tableOrders.some((o) => o.status === 'READY');
            return (
              <div key={tableId}>
                <div className="flex items-center justify-between mb-2 px-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-200">Bàn {tableId}</h3>
                    {hasPlaced && (
                      <Badge className="text-[10px] px-1.5 h-4 bg-yellow-900/30 text-yellow-400 border border-yellow-800">
                        Chờ tiếp nhận
                      </Badge>
                    )}
                    {hasReady && (
                      <Badge className="text-[10px] px-1.5 h-4 bg-green-900/30 text-green-400 border border-green-800 animate-pulse">
                        Sẵn sàng!
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {tableOrders.length} đơn · <span className="text-slate-300 font-medium">{formatPrice(tableTotal)}</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tableOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      canAct={canAct}
                      acting={acting}
                      onAction={handleAction}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
