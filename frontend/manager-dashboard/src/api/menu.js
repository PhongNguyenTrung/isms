async function apiFetch(path, token, method = 'GET', body) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const e = new Error(err.message || 'Lỗi không xác định');
    e.status = res.status;
    throw e;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const getMenuAdmin     = (token)           => apiFetch('/api/menu/admin/all', token);
export const createMenuItem   = (token, data)     => apiFetch('/api/menu', token, 'POST', data);
export const updateMenuItem   = (token, id, data) => apiFetch(`/api/menu/${id}`, token, 'PUT', data);
export const deleteMenuItem   = (token, id)       => apiFetch(`/api/menu/${id}`, token, 'DELETE');

export async function uploadMenuImage(token, file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch('/api/menu/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload thất bại');
  }
  return res.json(); // { url }
}
