const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
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
  fuelType: {
    type: String,
    required: [true, 'Vrsta goriva je obavezna'],
    enum: {
      values: ['diesel', 'petrol'],
      message: 'Gorivo mora biti diesel ili petrol'
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
