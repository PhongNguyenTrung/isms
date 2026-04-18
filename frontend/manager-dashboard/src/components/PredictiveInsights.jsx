import { useEffect, useState } from 'react';
import { getPredictiveInsights } from '../api/analytics.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

const LOAD_VARIANT = {
  High: 'destructive',
  Medium: 'outline',
  Low: 'secondary',
};

const LOAD_CLASS = {
  High: 'border-red-700 text-red-400 bg-red-900/20',
  Medium: 'border-yellow-700 text-yellow-400 bg-yellow-900/20',
  Low: 'border-green-700 text-green-400 bg-green-900/20',
};

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

  if (loading) return <p className="text-sm text-slate-500">Đang tải...</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Busy period forecast */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-300">Dự báo thời điểm bận rộn</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.busyPeriodForecast?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 text-xs">Thời điểm</TableHead>
                  <TableHead className="text-slate-400 text-xs">Mức độ</TableHead>
                  <TableHead className="text-slate-400 text-xs text-right">Nhân viên đề xuất</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.busyPeriodForecast.map((row, i) => (
                  <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="text-slate-300 text-sm py-2">{row.time}</TableCell>
                    <TableCell className="py-2">
                      <Badge variant="outline" className={LOAD_CLASS[row.expectedLoad] || 'border-slate-700 text-slate-400'}>
                        {row.expectedLoad}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300 text-sm text-right py-2">{row.suggestedStaff} người</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-slate-500">Chưa có dự báo.</p>
          )}
        </CardContent>
      </Card>

      {/* Menu recommendations */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-300">Khuyến nghị thực đơn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.menuRecommendations ? (
            <>
              {data.menuRecommendations.toPromote?.length > 0 && (
                <div>
                  <Badge className="mb-2 bg-green-900/30 text-green-400 border border-green-800 hover:bg-green-900/30">
                    Nên quảng bá
                  </Badge>
                  <ul className="space-y-1">
                    {data.menuRecommendations.toPromote.map((item) => (
                      <li key={item} className="text-sm text-slate-300 pl-3 border-l-2 border-green-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.menuRecommendations.toConsiderRemoving?.length > 0 && (
                <div>
                  <Badge className="mb-2 bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/30">
                    Cân nhắc loại bỏ
                  </Badge>
                  <ul className="space-y-1">
                    {data.menuRecommendations.toConsiderRemoving.map((item) => (
                      <li key={item} className="text-sm text-slate-300 pl-3 border-l-2 border-red-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500">Chưa có khuyến nghị.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
