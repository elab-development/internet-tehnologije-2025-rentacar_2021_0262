const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: [true, 'Datum početka je obavezan']
  },
  endDate: {
    type: Date,
    required: [true, 'Datum kraja je obavezan'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'Datum kraja mora biti posle datuma početka'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Ukupna cena je obavezna'],
    min: [0, 'Cena mora biti pozitivna']
  },
  status: {
    type: String,
    enum: {
      values: ['reserved', 'active', 'returned'],
      message: 'Status mora biti reserved, active ili returned'
    },
    default: 'reserved'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index za pretragu iznajmljivanja po korisniku i autu
rentalSchema.index({ userId: 1, createdAt: -1 });
rentalSchema.index({ carId: 1, startDate: 1, endDate: 1 });

// Metoda za proveru da li je auto dostupan u zadatom periodu
rentalSchema.statics.isCarAvailable = async function(carId, startDate, endDate, excludeRentalId = null) {
  const query = {
    carId,
    status: { $in: ['reserved', 'active'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  };
  
  if (excludeRentalId) {
    query._id = { $ne: excludeRentalId };
  }
  
  const conflictingRental = await this.findOne(query);
  return !conflictingRental;
};

module.exports = mongoose.model('Rental', rentalSchema);
