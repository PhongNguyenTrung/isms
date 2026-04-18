import {
  LayoutDashboard, ClipboardList, ChefHat, CreditCard, UtensilsCrossed,
  QrCode, BarChart3, TrendingUp, LogOut,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const NAV_GROUPS = [
  {
    label: 'Tổng quan',
    items: [
      { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, roles: ['MANAGER'] },
    ],
  },
  {
    label: 'Vận hành',
    items: [
      { id: 'orders',  label: 'Đơn hàng',    icon: ClipboardList, roles: ['MANAGER', 'WAITER'] },
      { id: 'kds',     label: 'Nhà bếp (KDS)', icon: ChefHat,      roles: ['MANAGER', 'CHEF', 'WAITER'] },
      { id: 'payment', label: 'Thanh toán',   icon: CreditCard,    roles: ['MANAGER', 'CASHIER'] },
    ],
  },
  {
    label: 'Nhà hàng',
    items: [
      { id: 'menu', label: 'Thực đơn', icon: UtensilsCrossed, roles: ['MANAGER'] },
      { id: 'tables', label: 'Quản lý QR', icon: QrCode, roles: ['MANAGER'] },
    ],
  },
  {
    label: 'Phân tích',
    items: [
      { id: 'analytics', label: 'Báo cáo', icon: BarChart3, roles: ['MANAGER'] },
      { id: 'insights', label: 'Dự báo', icon: TrendingUp, roles: ['MANAGER'] },
    ],
  },
];

const ROLE_LABELS = {
  MANAGER: 'Quản lý',
  CHEF: 'Đầu bếp',
  WAITER: 'Phục vụ',
  CASHIER: 'Thu ngân',
};

export default function Sidebar({ activePage, onNavigate, user, onLogout }) {
  const filteredGroups = NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(user.role)) }))
    .filter((g) => g.items.length > 0);

  return (
    <aside className="w-60 flex-shrink-0 h-screen flex flex-col bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-slate-800">
        <span className="text-blue-400 font-black text-lg tracking-widest">IRMS</span>
        <span className="ml-2 text-slate-500 text-xs font-medium">Dashboard</span>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 px-3 py-3">
        {filteredGroups.map((group, idx) => (
          <div key={group.label}>
            {idx > 0 && <Separator className="my-2 bg-slate-800" />}
            <p className="text-[10px] font-semibold text-slate-600 px-2 mb-1 uppercase tracking-widest">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-0.5',
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </ScrollArea>

      {/* User info */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-200 truncate">{user.username}</p>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
              {ROLE_LABELS[user.role] ?? user.role}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-slate-400 hover:text-slate-100 hover:bg-slate-800 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
}
