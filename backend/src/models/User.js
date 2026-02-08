const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email je obavezan'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Unesite validan email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Lozinka je obavezna']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  firstName: {
    type: String,
    required: [true, 'Ime je obavezno'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Prezime je obavezno'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Broj godina je obavezan'],
    min: [18, 'Morate imati najmanje 18 godina']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password pre cuvanja
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Metoda za proveru lozinke
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Ne vracaj passwordHash u JSON odgovoru
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
