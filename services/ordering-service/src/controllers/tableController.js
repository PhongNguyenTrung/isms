const tableSessionRepository = require('../repositories/tableSessionRepository');

// GET /api/table/resolve?t=<token>
// Public — tablet calls this on startup to exchange token → tableId
const resolveSession = async (req, res) => {
  const { t } = req.query;
  if (!t) return res.status(400).json({ message: 'Token không hợp lệ' });

  const session = await tableSessionRepository.resolveToken(t);
  if (!session) {
    return res.status(401).json({ message: 'QR code không hợp lệ hoặc đã hết hạn. Vui lòng quét lại.' });
  }

  return res.json({ tableId: session.table_id, sessionToken: session.token });
};

// POST /api/table/sessions  — MANAGER only
// Body: { tableId }
// Tạo session mới, trả về QR URL
const createSession = async (req, res) => {
  const { tableId } = req.body;
  if (!tableId) return res.status(400).json({ message: 'tableId là bắt buộc' });

  const session = await tableSessionRepository.createSession(tableId);
  const qrUrl = `/table?t=${session.token}`;

  return res.status(201).json({
    tableId: session.table_id,
    token: session.token,
    qrUrl,
    expiresAt: session.expires_at,
  });
};

// GET /api/table/active-token/:tableId
// Dùng bởi tablet cố định để phát hiện session mới sau khi session cũ hết hạn
const getActiveToken = async (req, res) => {
  const { tableId } = req.params;
  const session = await tableSessionRepository.getActiveTokenByTableId(tableId);
  if (!session) return res.status(404).json({ message: 'Chưa có session' });
  return res.json({ token: session.token, expiresAt: session.expires_at });
};

module.exports = { resolveSession, createSession, getActiveToken };
