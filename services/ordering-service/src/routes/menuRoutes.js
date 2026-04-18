const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const { getMenu, getMenuItem, getMenuAdmin, createItem, updateItem, deleteItem } = require('../controllers/menuController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'menu');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
  },
});

router.get('/', getMenu);
// ⚠️ Static paths must be declared before /:id
router.get('/admin/all', verifyToken, verifyRole(['MANAGER']), getMenuAdmin);
router.post('/upload', verifyToken, verifyRole(['MANAGER']), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Không có file hoặc định dạng không hỗ trợ' });
  res.json({ url: `/uploads/menu/${req.file.filename}` });
});
router.get('/:id', getMenuItem);
router.post('/', verifyToken, verifyRole(['MANAGER']), createItem);
router.put('/:id', verifyToken, verifyRole(['MANAGER']), updateItem);
router.delete('/:id', verifyToken, verifyRole(['MANAGER']), deleteItem);

module.exports = router;
