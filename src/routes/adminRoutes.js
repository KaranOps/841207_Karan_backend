const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/adminAuth');

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected route example
router.get('/dashboard', verifyAdmin, (req, res) => {
  res.json({ message: `Welcome admin ${req.admin.username}` });
});

module.exports = router;
