const express = require('express');
const router = express.Router();
const {
  getCombos,
  createCombo,
  updateCombo,
  toggleComboAvailability,
  deleteCombo
} = require('../controllers/comboController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getCombos);
router.post('/', protect, adminOnly, createCombo);
router.put('/:id', protect, adminOnly, updateCombo);
router.patch('/:id/availability', protect, adminOnly, toggleComboAvailability);
router.delete('/:id', protect, adminOnly, deleteCombo);

module.exports = router;
