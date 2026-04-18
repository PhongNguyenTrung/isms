import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMenuAdmin, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '../api/menu.js';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2, ImagePlus, X } from 'lucide-react';

const CATEGORIES = [
  { value: 'MAIN_DISH',  label: 'Món chính' },
  { value: 'APPETIZER',  label: 'Nguyên liệu' },
  { value: 'BEVERAGE',   label: 'Đồ uống' },
  { value: 'DESSERT',    label: 'Tráng miệng' },
];
const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

const EMPTY_FORM = {
  name_vi: '', name_en: '', description: '',
  price: '', category: '', is_available: true, image_url: '',
};

function formatPrice(v) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(v));
}

function ItemThumbnail({ src, name }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className="w-10 h-10 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
        <ImagePlus className="w-4 h-4 text-slate-600" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className="w-10 h-10 rounded-md object-cover flex-shrink-0 border border-slate-700"
    />
  );
}

export default function MenuPanel() {
  const { token } = useAuth();
  const { toast } = useToast();

  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [categoryFilter, setFilter]     = useState('ALL');
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editingItem, setEditingItem]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [uploading, setUploading]       = useState(false);
  const fileInputRef                    = useRef(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    try {
      const data = await getMenuAdmin(token);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: 'Không thể tải thực đơn', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setForm({
      name_vi: item.name_vi,
      name_en: item.name_en,
      description: item.description || '',
      price: String(item.price),
      category: item.category,
      is_available: item.is_available,
      image_url: item.image_url || '',
    });
    setDialogOpen(true);
  }

  async function handleImagePick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadMenuImage(token, file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      toast({ title: err.message || 'Upload ảnh thất bại', variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleSave() {
    if (!form.name_vi || !form.name_en || !form.price || !form.category) {
      toast({ title: 'Vui lòng điền đầy đủ thông tin bắt buộc', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = { ...form, price: Number(form.price) };
    try {
      if (editingItem) {
        await updateMenuItem(token, editingItem.id, payload);
        toast({ title: `Đã cập nhật "${form.name_vi}"` });
      } else {
        await createMenuItem(token, payload);
        toast({ title: `Đã thêm "${form.name_vi}"` });
      }
      setDialogOpen(false);
      await fetchItems();
    } catch (err) {
      toast({ title: err.message || 'Lưu thất bại', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMenuItem(token, deleteTarget.id);
      toast({ title: `Đã xóa "${deleteTarget.name_vi}"` });
      setDeleteTarget(null);
      await fetchItems();
    } catch (err) {
      if (err.status === 409) {
        toast({ title: 'Không thể xóa: món này đã có trong đơn hàng', variant: 'destructive' });
      } else {
        toast({ title: err.message || 'Xóa thất bại', variant: 'destructive' });
      }
    } finally {
      setDeleting(false);
    }
  }

  const filtered = categoryFilter === 'ALL'
    ? items
    : items.filter((i) => i.category === categoryFilter);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={setFilter}>
            <SelectTrigger className="w-44 bg-slate-900 border-slate-700 text-slate-200 h-9">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="ALL" className="text-slate-200">Tất cả danh mục</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value} className="text-slate-200">{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="bg-slate-800 text-slate-300">
            {filtered.length} món
          </Badge>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5">
          <Plus className="w-4 h-4" /> Thêm món
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm py-6">
          <Loader2 className="w-4 h-4 animate-spin" /> Đang tải...
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent bg-slate-900/60">
                <TableHead className="text-slate-400 text-xs w-12">Ảnh</TableHead>
                <TableHead className="text-slate-400 text-xs">Tên món</TableHead>
                <TableHead className="text-slate-400 text-xs">Danh mục</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Giá</TableHead>
                <TableHead className="text-slate-400 text-xs text-center">Trạng thái</TableHead>
                <TableHead className="text-slate-400 text-xs text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 text-sm py-8">
                    Không có món nào.
                  </TableCell>
                </TableRow>
              ) : filtered.map((item) => (
                <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/40">
                  <TableCell className="py-2 pl-4">
                    <ItemThumbnail src={item.image_url} name={item.name_vi} />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="font-medium text-slate-200 text-sm">{item.name_vi}</div>
                    <div className="text-xs text-slate-500">{item.name_en}</div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-xs">
                      {CAT_LABEL[item.category] || item.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right text-sm text-slate-300 font-medium">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <Badge
                      variant="outline"
                      className={item.is_available
                        ? 'border-green-700 text-green-400 bg-green-900/20'
                        : 'border-slate-700 text-slate-500 bg-slate-800/50'}
                    >
                      {item.is_available ? 'Có sẵn' : 'Tạm hết'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(item)}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-slate-100 hover:bg-slate-700"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget(item)}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              {editingItem ? `Chỉnh sửa: ${editingItem.name_vi}` : 'Thêm món mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">

            {/* Image upload zone */}
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs">Ảnh món</Label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:border-blue-600 transition-colors group relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
                  ) : form.image_url ? (
                    <>
                      <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImagePlus className="w-5 h-5 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-500 group-hover:text-slate-300 transition-colors">
                      <ImagePlus className="w-6 h-6" />
                      <span className="text-[10px]">Chọn ảnh</span>
                    </div>
                  )}
                </div>

                {/* URL or remove */}
                <div className="flex-1 space-y-2">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    placeholder="URL ảnh (hoặc click ô bên để upload)"
                    className="bg-slate-800 border-slate-700 text-slate-100 h-8 text-xs"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="h-7 text-xs border-slate-700 text-slate-300 hover:bg-slate-700 gap-1"
                    >
                      <ImagePlus className="w-3 h-3" />
                      {uploading ? 'Đang tải...' : 'Upload ảnh'}
                    </Button>
                    {form.image_url && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setForm((f) => ({ ...f, image_url: '' }))}
                        className="h-7 text-xs text-slate-500 hover:text-red-400 gap-1"
                      >
                        <X className="w-3 h-3" /> Xóa ảnh
                      </Button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-600">JPG, PNG, WebP · Tối đa 5MB</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={handleImagePick}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs">Tên tiếng Việt *</Label>
                <Input
                  value={form.name_vi}
                  onChange={(e) => setForm((f) => ({ ...f, name_vi: e.target.value }))}
                  placeholder="VD: Phở bò"
                  className="bg-slate-800 border-slate-700 text-slate-100 h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs">Tên tiếng Anh *</Label>
                <Input
                  value={form.name_en}
                  onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                  placeholder="VD: Beef Pho"
                  className="bg-slate-800 border-slate-700 text-slate-100 h-8 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-300 text-xs">Mô tả</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Mô tả ngắn (tuỳ chọn)"
                className="bg-slate-800 border-slate-700 text-slate-100 h-8 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs">Giá (VND) *</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="VD: 85000"
                  className="bg-slate-800 border-slate-700 text-slate-100 h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300 text-xs">Danh mục *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 h-8 text-sm">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-slate-200">{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-slate-300 text-sm">Còn phục vụ</Label>
              <Switch
                checked={form.is_available}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_available: v }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-slate-400 hover:text-slate-100">
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving || uploading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              {editingItem ? 'Lưu thay đổi' : 'Thêm món'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-slate-100 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-slate-100 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-400" /> Xóa món
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-300">
            Xóa <strong className="text-slate-100">{deleteTarget?.name_vi}</strong>? Hành động này không thể hoàn tác.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-slate-100">
              Hủy
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
