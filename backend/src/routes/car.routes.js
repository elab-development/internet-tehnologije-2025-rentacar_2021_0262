const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');
const {
  getCars,
  getCarById,
  createCar,
  updateCar
} = require('../controllers/car.controller');

router.get('/', optionalAuth, getCars);
router.get('/:id', optionalAuth, getCarById);
router.post('/', protect, authorize('admin'), createCar);
router.put('/:id', protect, authorize('admin'), updateCar);

module.exports = router;
