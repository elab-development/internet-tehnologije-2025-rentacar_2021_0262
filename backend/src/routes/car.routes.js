const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getCars,
  getCarById,
  createCar,
  updateCar
} = require('../controllers/car.controller');

router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', protect, authorize('admin'), createCar);
router.put('/:id', protect, authorize('admin'), updateCar);

module.exports = router;
