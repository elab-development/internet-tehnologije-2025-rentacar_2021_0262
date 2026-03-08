const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  brand: {
    type: String,
    required: [true, 'Marka je obavezna'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model je obavezan'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Godište je obavezno'],
    min: [1990, 'Godište mora biti nakon 1990'],
    max: [new Date().getFullYear() + 1, 'Godište ne može biti u budućnosti']
  },
  power: {
    type: Number,
    required: [true, 'Snaga motora je obavezna'],
    min: [30, 'Snaga mora biti najmanje 30 KS']
  },
  seats: {
    type: Number,
    required: [true, 'Broj sedišta je obavezan'],
    min: [1, 'Broj sedišta mora biti najmanje 1'],
    max: [9, 'Broj sedišta ne može biti veći od 9']
  },
  fuelType: {
    type: String,
    required: [true, 'Vrsta goriva je obavezna'],
    enum: {
      values: ['diesel', 'petrol', 'hybrid'],
      message: 'Gorivo mora biti diesel, petrol ili hybrid'
    }
  },
  transmission: {
    type: String,
    required: [true, 'Menjač je obavezan'],
    enum: {
      values: ['manual', 'automatic'],
      message: 'Menjač mora biti manual ili automatic'
    }
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Cena po danu je obavezna'],
    min: [0, 'Cena mora biti pozitivna']
  },
  imageUrl: {
    type: String,
    default: null
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

carSchema.index({ brand: 1, model: 1 });

module.exports = mongoose.model('Car', carSchema);
