import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { getOrderFlow } from '../api/analytics.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag, TrendingUp, BadgeDollarSign, CheckCircle2,
  XCircle, Clock, Flame,
} from 'lucide-react';

const PERIODS = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'last_7_days', label: '7 ngày qua' },
];

function formatPrice(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v));
}

function formatPriceShort(v) {
  const n = Number(v);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}tr`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

// ── Tooltip for trend chart ──────────────────────────────────────────────────
function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-300 font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === 'revenue' ? formatPrice(p.value) : `${p.value} đơn`}
        </p>
      ))}
    </div>
  );
}

// ── Tooltip for category pie ─────────────────────────────────────────────────
function CategoryTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-slate-200 mb-1">{d.name}</p>
      <p className="text-slate-300">{formatPrice(d.revenue)}</p>
      <p className="text-slate-400">{d.qty} phần</p>
    </div>
  );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color = 'text-slate-100', iconBg = 'bg-slate-700/60' }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`p-2 rounded-lg flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 truncate">{label}</p>
          <p className={`text-lg font-bold leading-tight mt-0.5 ${color}`}>{value}</p>
          {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Circular progress for completion rate ────────────────────────────────────
function CircularProgress({ value, size = 72 }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1e293b" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#22c55e" strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="central" fill="#f1f5f9" fontSize="13" fontWeight="700">
        {value}%
      </text>
    </svg>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function OrderFlowReport() {
  const [period, setPeriod] = useState('today');
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getOrderFlow(period)
      .then(setData)
      .catch(() => setError('Không thể tải báo cáo.'))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Báo cáo vận hành</h2>
          <p className="text-xs text-slate-500 mt-0.5">Phân tích đơn hàng & doanh thu theo thời gian thực</p>
        </div>
        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
          {PERIODS.map((p) => (
            <Button
              key={p.value}
              size="sm"
              variant="ghost"
              onClick={() => setPeriod(p.value)}
              className={`h-7 text-xs px-3 rounded-md transition-all ${
                period === p.value
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
              }`}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin mr-3" />
          Đang tải dữ liệu...
        </div>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {data && !loading && (
        <>
          {/* ── KPI cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              icon={ShoppingBag}
              label="Tổng đơn hàng"
              value={data.totalOrders ?? 0}
              sub={`${data.cancelledOrders ?? 0} đơn huỷ`}
              color="text-blue-400"
              iconBg="bg-blue-900/40"
            />
            <KpiCard
              icon={BadgeDollarSign}
              label="Tổng doanh thu"
              value={formatPrice(data.totalRevenue ?? 0)}
              color="text-green-400"
              iconBg="bg-green-900/40"
            />
            <KpiCard
              icon={TrendingUp}
              label="Giá trị TB / đơn"
              value={formatPrice(data.averageOrderValue ?? 0)}
              color="text-orange-400"
              iconBg="bg-orange-900/40"
            />
            <KpiCard
              icon={Clock}
              label="Giờ cao điểm"
              value={data.peakHours?.length ? data.peakHours[0] : '—'}
              sub={data.peakHours?.slice(1).join(' · ')}
              color="text-purple-400"
              iconBg="bg-purple-900/40"
            />
          </div>

          {/* ── Completion rate + cancelled ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex items-center gap-4">
                <CircularProgress value={data.completionRate ?? 0} />
                <div>
                  <p className="text-xs text-slate-500">Tỷ lệ hoàn thành</p>
                  <p className="text-2xl font-bold text-green-400">{data.completionRate ?? 0}%</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {(data.totalOrders ?? 0) - (data.cancelledOrders ?? 0)} hoàn thành
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <XCircle className="w-3 h-3 text-red-500" />
                      {data.cancelledOrders ?? 0} huỷ
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Doanh thu theo danh mục
                </p>
                {data.categoryBreakdown?.length > 0 ? (
                  <div className="space-y-2">
                    {data.categoryBreakdown.map((cat) => {
                      const maxRev = Math.max(...data.categoryBreakdown.map((c) => c.revenue), 1);
                      return (
                        <div key={cat.key} className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: cat.color }}
                          />
                          <span className="text-xs text-slate-400 w-28 truncate flex-shrink-0">{cat.name}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${(cat.revenue / maxRev) * 100}%`, background: cat.color }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-16 text-right flex-shrink-0">
                            {formatPriceShort(cat.revenue)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 text-center py-3">Chưa có dữ liệu</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Trend chart ── */}
          {data.trendData?.length > 0 && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-1 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-200">
                    {period === 'today' ? 'Đơn hàng theo giờ hôm nay' : 'Xu hướng 7 ngày qua'}
                  </CardTitle>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-orange-400">
                      <span className="w-3 h-0.5 bg-orange-400 rounded inline-block" /> Doanh thu
                    </span>
                    <span className="flex items-center gap-1 text-blue-400">
                      <span className="w-3 h-0.5 bg-blue-400 rounded inline-block" /> Đơn hàng
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-2 pb-4 pt-2">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data.trendData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gOrd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false} tickLine={false}
                      interval={period === 'today' ? 2 : 0}
                    />
                    <YAxis
                      yAxisId="rev"
                      orientation="right"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={formatPriceShort}
                      axisLine={false} tickLine={false}
                      width={46}
                    />
                    <YAxis
                      yAxisId="ord"
                      orientation="left"
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false} tickLine={false}
                      width={28}
                      allowDecimals={false}
                    />
                    <Tooltip content={<TrendTooltip />} />
                    <Area
                      yAxisId="rev"
                      type="monotone" dataKey="revenue"
                      stroke="#f97316" strokeWidth={2}
                      fill="url(#gRev)" dot={false}
                    />
                    <Area
                      yAxisId="ord"
                      type="monotone" dataKey="orders"
                      stroke="#3b82f6" strokeWidth={2}
                      fill="url(#gOrd)" dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* ── Popular dishes + Category pie ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

            {/* Top dishes bar chart */}
            {data.popularDishes?.length > 0 && (
              <Card className="bg-slate-900 border-slate-800 lg:col-span-3">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold text-slate-200">
                    Món bán chạy nhất
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 pb-4 pt-1">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={data.popularDishes}
                      layout="vertical"
                      margin={{ top: 0, right: 60, left: 4, bottom: 0 }}
                      barSize={12}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis
                        type="category" dataKey="name"
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        width={110}
                        axisLine={false} tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: '#1e293b' }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0].payload;
                          return (
                            <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
                              <p className="font-semibold text-slate-200 mb-1 max-w-[160px] truncate">{d.name}</p>
                              <p className="text-orange-300">{d.count} phần đã bán</p>
                              <p className="text-green-300">{formatPrice(d.revenue)}</p>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.popularDishes.map((_, i) => (
                          <Cell
                            key={i}
                            fill={`hsl(${210 + i * 15}, 70%, ${60 - i * 3}%)`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Category donut */}
            {data.categoryBreakdown?.length > 0 && (
              <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold text-slate-200">
                    Cơ cấu doanh thu
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pb-4 pt-1">
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={data.categoryBreakdown}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%" cy="50%"
                        innerRadius={42} outerRadius={62}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {data.categoryBreakdown.map((cat) => (
                          <Cell key={cat.key} fill={cat.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CategoryTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="w-full space-y-1.5 mt-2">
                    {data.categoryBreakdown.map((cat) => {
                      const total = data.categoryBreakdown.reduce((s, c) => s + c.revenue, 0);
                      const pct = total > 0 ? Math.round((cat.revenue / total) * 100) : 0;
                      return (
                        <div key={cat.key} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                            {cat.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4 border-slate-700 text-slate-400"
                            >
                              {pct}%
                            </Badge>
                            <span className="text-slate-300 font-medium w-16 text-right">
                              {formatPriceShort(cat.revenue)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}
