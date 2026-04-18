import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, ChevronDown, ChevronUp, Clock, Banknote, Users } from 'lucide-react';

function formatPrice(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v));
}

function diningDuration(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins} phút`;
  return `${Math.floor(mins / 60)}g ${mins % 60}p`;
}

function TableCard({ table, onConfirm, confirming }) {
  const [expanded, setExpanded] = useState(false);
  const [bill, setBill] = useState(null);
  const [billLoading, setBillLoading] = useState(false);
  const { token } = useAuth();

  const mins = Math.floor((Date.now() - new Date(table.first_order_at).getTime()) / 60000);
  const isLongDining = mins >= 90;

  async function loadBill() {
    if (bill) { setExpanded((v) => !v); return; }
    setBillLoading(true);
    try {
      const res = await fetch(`/api/orders/table/${table.table_id}/bill`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBill(data);
      setExpanded(true);
    } catch {
      // ignore
    } finally {
      setBillLoading(false);
    }
  }

  return (
    <Card className={`bg-slate-900 border-slate-800 overflow-hidden transition-all ${isLongDining ? 'border-l-2 border-l-amber-600' : ''}`}>
      <CardContent className="p-0">
        {/* Main row */}
        <div className="px-4 pt-4 pb-3 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-base">Bàn {table.table_id}</span>
                {isLongDining && (
                  <Badge className="text-[10px] px-1.5 h-4 bg-amber-900/30 text-amber-400 border border-amber-800">
                    {diningDuration(table.first_order_at)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                Từ {new Date(table.first_order_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                {!isLongDining && <span className="ml-1">· {diningDuration(table.first_order_at)}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-400">{formatPrice(table.grand_total)}</div>
              <div className="text-xs text-slate-500">{table.order_count} đơn</div>
            </div>
          </div>

          {/* Actions — two independent buttons, stopPropagation to prevent cross-trigger */}
          <div className="flex gap-2">
            <Button
              className="flex-1 bg-green-700 hover:bg-green-600 text-white text-sm h-9 gap-1.5"
              onClick={(e) => { e.stopPropagation(); onConfirm(table.table_id); }}
              disabled={confirming === table.table_id}
            >
              {confirming === table.table_id
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Banknote className="w-4 h-4" />}
              Thu tiền
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); loadBill(); }}
              disabled={billLoading}
              className="h-9 border-slate-700 text-slate-400 hover:text-slate-100 hover:bg-slate-800 px-3"
            >
              {billLoading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Expanded bill detail */}
        {expanded && bill && (
          <div className="border-t border-slate-800 px-4 py-3 space-y-3 bg-slate-950/40">
            {bill.orders?.map((order, idx) => {
              const statusColors = {
                PLACED: 'text-yellow-400', CONFIRMED: 'text-blue-400',
                IN_PROGRESS: 'text-orange-400', READY: 'text-green-400', COMPLETED: 'text-slate-500',
              };
              const statusLabels = {
                PLACED: 'Chờ', CONFIRMED: 'Tiếp nhận', IN_PROGRESS: 'Chế biến',
                READY: 'Sẵn sàng', COMPLETED: 'Xong',
              };
              return (
                <div key={order.id}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-slate-400">Đơn #{idx + 1}</span>
                    <span className={`text-[10px] font-semibold ${statusColors[order.status] || 'text-slate-500'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {order.items?.map((item, i) => (
                      <li key={i} className="flex justify-between text-xs">
                        <span className="text-slate-400">×{item.quantity} {item.name}</span>
                        <span className="text-slate-500">{formatPrice(Number(item.price) * item.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  {idx < bill.orders.length - 1 && <div className="mt-2 border-t border-slate-800/60" />}
                </div>
              );
            })}
            <div className="flex justify-between pt-1 border-t border-slate-700">
              <span className="text-sm font-semibold text-slate-300">Tổng cộng</span>
              <span className="text-sm font-bold text-blue-400">{formatPrice(bill.grandTotal)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PaymentPanel() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [tables, setTables]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // tableId pending confirm dialog

  useEffect(() => {
    fetchTables();
    const id = setInterval(fetchTables, 5000);
    return () => clearInterval(id);
  }, []);

  async function fetchTables() {
    try {
      const res = await fetch('/api/orders/active-tables', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTables(Array.isArray(data) ? data : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  async function doConfirm(tableId) {
    setConfirmTarget(null);
    setConfirming(tableId);
    try {
      const res = await fetch(`/api/orders/table/${tableId}/complete-payment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTables((prev) => prev.filter((t) => t.table_id !== tableId));
        toast({ title: `✓ Đã thu tiền bàn ${tableId}` });
      } else {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message);
      }
    } catch (err) {
      toast({ title: err.message || 'Xác nhận thất bại', variant: 'destructive' });
    } finally {
      setConfirming(null);
    }
  }

  const totalRevenue = tables.reduce((s, t) => s + Number(t.grand_total), 0);

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-blue-900/40 bg-blue-900/10 px-4 py-3">
          <div className="text-2xl font-bold text-blue-400">{tables.length}</div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Users className="w-3 h-3" /> Bàn đang phục vụ
          </div>
        </div>
        <div className="rounded-lg border border-green-900/40 bg-green-900/10 px-4 py-3 col-span-2">
          <div className="text-2xl font-bold text-green-400">{formatPrice(totalRevenue)}</div>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <Banknote className="w-3 h-3" /> Tổng doanh thu đang chờ
          </div>
        </div>
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
        </div>
      ) : tables.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <div className="text-4xl mb-3">💳</div>
          <p className="text-sm">Không có bàn nào cần thanh toán</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map((t) => (
            <TableCard
              key={t.table_id}
              table={t}
              confirming={confirming}
              onConfirm={(tableId) => setConfirmTarget(tableId)}
            />
          ))}
        </div>
      )}

      {/* Confirm dialog */}
      <Dialog open={!!confirmTarget} onOpenChange={(o) => !o && setConfirmTarget(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-green-400" />
              Xác nhận thu tiền
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-300">
            Xác nhận đã thu tiền <strong className="text-slate-100">bàn {confirmTarget}</strong>?
            Tất cả đơn hàng của bàn sẽ được đánh dấu hoàn thành và mã QR sẽ bị thu hồi.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setConfirmTarget(null)} className="text-slate-400 hover:text-slate-100">
              Hủy
            </Button>
            <Button
              onClick={() => doConfirm(confirmTarget)}
              className="bg-green-700 hover:bg-green-600 text-white gap-1.5"
            >
              <Banknote className="w-4 h-4" />
              Xác nhận thu tiền
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
