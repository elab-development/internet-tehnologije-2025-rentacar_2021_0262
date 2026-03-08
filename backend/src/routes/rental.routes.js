const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { createRental, getMyRentals, getAllRentals } = require('../controllers/rental.controller');

router.post('/', protect, createRental);
router.get('/my', protect, getMyRentals);
router.get('/all', protect, authorize('admin'), getAllRentals);

module.exports = router;
