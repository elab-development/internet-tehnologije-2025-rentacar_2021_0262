const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Korisnik je obavezan']
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Automobil je obavezan']
  },
  rating: {
    type: Number,
    required: [true, 'Ocena je obavezna'],
    min: [1, 'Ocena mora biti najmanje 1'],
    max: [5, 'Ocena ne može biti veća od 5']
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ carId: 1, isApproved: 1 });
reviewSchema.index({ userId: 1, carId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
