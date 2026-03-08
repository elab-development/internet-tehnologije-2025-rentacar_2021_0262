const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createRental, getMyRentals } = require('../controllers/rental.controller');

router.post('/', protect, createRental);
router.get('/my', protect, getMyRentals);

module.exports = router;
