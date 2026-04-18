import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Printer, RefreshCw, QrCode } from 'lucide-react';

const TABLET_BASE_URL = import.meta.env.VITE_TABLET_URL || 'http://localhost:3000';
const PRESET_TABLES = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10'];

function QRCard({ tableId, token, expiresAt, onRegenerate, loading }) {
  const url = `${TABLET_BASE_URL}/?t=${token}`;
  const expiresTime = new Date(expiresAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const canvasRef = useRef(null);

  function handlePrint() {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const html = `<html><head><title>QR Bàn ${tableId}</title>
      <style>body{font-family:sans-serif;text-align:center;padding:40px}h2{font-size:28px;margin-bottom:8px}p{color:#666;margin-bottom:24px}</style>
      </head><body>
      <h2>Bàn ${tableId}</h2><p>Quét để xem thực đơn &amp; đặt món</p>
      <img src="${dataUrl}" width="300" height="300" onload="window.print();window.onafterprint=()=>window.close()"/>
      </body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    win?.addEventListener('unload', () => URL.revokeObjectURL(url));
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 text-sm">Bàn {tableId}</span>
          <Badge variant="outline" className="border-slate-700 text-slate-500 text-xs">
            Hết hạn {expiresTime}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex flex-col items-center gap-3">
        <div className="bg-white p-3 rounded-lg">
          <QRCodeSVG value={url} size={160} level="M" />
        </div>
        <div ref={canvasRef} style={{ display: 'none' }}>
          <QRCodeCanvas value={url} size={600} level="H" />
        </div>
        <p className="text-xs text-slate-500 truncate max-w-full">{url}</p>
        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5 text-xs"
          >
            <Printer className="w-3 h-3" /> In QR
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRegenerate(tableId)}
            disabled={loading}
            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '...' : 'Tạo lại'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function loadSavedSessions() {
  try { return JSON.parse(sessionStorage.getItem('irms_qr_sessions') || '{}'); }
  catch { return {}; }
}

export default function TableQRPanel() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState(loadSavedSessions);
  const [loadingTable, setLoadingTable] = useState(null);
  const [error, setError] = useState('');
  const [customTable, setCustomTable] = useState('');

  useEffect(() => {
    if (Object.keys(sessions).length === 0) return;
    const check = async () => {
      const entries = Object.entries(sessions);
      const results = await Promise.allSettled(
        entries.map(([tableId]) =>
          fetch(`/api/table/active-token/${tableId}`).then((r) => (r.ok ? r.json() : null))
        )
      );
      setSessions((prev) => {
        let changed = false;
        const next = { ...prev };
        entries.forEach(([tableId, s], i) => {
          const val = results[i].status === 'fulfilled' ? results[i].value : null;
          if (!val || val.token !== s.token) { delete next[tableId]; changed = true; }
        });
        if (!changed) return prev;
        sessionStorage.setItem('irms_qr_sessions', JSON.stringify(next));
        return next;
      });
    };
    const id = setInterval(check, 10_000);
    return () => clearInterval(id);
  }, [sessions]);

  async function generateQR(tableId) {
    setLoadingTable(tableId);
    setError('');
    try {
      const res = await fetch('/api/table/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tableId }),
      });
      if (!res.ok) throw new Error('Tạo QR thất bại');
      const data = await res.json();
      setSessions((prev) => {
        const next = { ...prev, [tableId]: { token: data.token, expiresAt: data.expiresAt } };
        sessionStorage.setItem('irms_qr_sessions', JSON.stringify(next));
        return next;
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingTable(null);
    }
  }

  function handleCustomSubmit(e) {
    e.preventDefault();
    const id = customTable.trim().toUpperCase();
    if (id) { generateQR(id); setCustomTable(''); }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-400">
        Tạo QR cho từng bàn — khách quét bằng điện thoại để vào thực đơn. QR có hiệu lực 8 giờ và tự hủy sau khi thanh toán.
      </p>

      {/* Preset + custom row */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {PRESET_TABLES.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={sessions[t] ? 'secondary' : 'outline'}
              onClick={() => generateQR(t)}
              disabled={loadingTable === t}
              className={sessions[t]
                ? 'bg-blue-900/40 border-blue-700 text-blue-300 hover:bg-blue-900/60'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800'}
            >
              <QrCode className="w-3 h-3 mr-1" />
              {loadingTable === t ? '...' : t}
            </Button>
          ))}
        </div>

        <form onSubmit={handleCustomSubmit} className="flex gap-2 max-w-xs">
          <Input
            value={customTable}
            onChange={(e) => setCustomTable(e.target.value)}
            placeholder="Bàn khác (VD: VIP01)"
            className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 h-9"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!customTable.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Tạo QR
          </Button>
        </form>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>

      {/* QR grid */}
      {Object.keys(sessions).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(sessions).map(([tableId, s]) => (
            <QRCard
              key={tableId}
              tableId={tableId}
              token={s.token}
              expiresAt={s.expiresAt}
              onRegenerate={generateQR}
              loading={loadingTable === tableId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
