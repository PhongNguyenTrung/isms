const tableSessionRepository = require('../repositories/tableSessionRepository');

// Validates that the sessionToken in req.body belongs to the tableId being ordered for.
// Prevents: ordering to arbitrary tables, remote orders without a valid QR scan.
const validateTableSession = async (req, res, next) => {
  // tableId có thể từ body (placeOrder) hoặc URL param (requestPayment)
  const tableId = req.body.tableId ?? req.params.tableId;
  const { sessionToken } = req.body;

  if (!sessionToken) {
    return res.status(401).json({ message: 'Phiên đặt món không hợp lệ. Vui lòng quét lại QR.' });
  }

  const session = await tableSessionRepository.resolveToken(sessionToken);

  if (!session) {
    return res.status(401).json({ message: 'QR code đã hết hạn hoặc không hợp lệ. Vui lòng quét lại.' });
  }

  if (session.table_id !== String(tableId ?? '')) {
    return res.status(403).json({ message: 'Session không khớp với bàn này.' });
  }

  next();
};

module.exports = { validateTableSession };
