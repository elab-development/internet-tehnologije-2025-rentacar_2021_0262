const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');
const {
  getReviews,
  getPendingReviews,
  createReview,
  approveReview,
  rejectReview
} = require('../controllers/review.controller');

router.get('/', optionalAuth, getReviews);
router.get('/pending', protect, authorize('admin'), getPendingReviews);
router.post('/', protect, authorize('user', 'admin'), createReview);
router.put('/:id/approve', protect, authorize('admin'), approveReview);
router.delete('/:id/reject', protect, authorize('admin'), rejectReview);

module.exports = router;
