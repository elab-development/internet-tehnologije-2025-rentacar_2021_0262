require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('../models/Car');

const cars = [
  {
    brand: 'BMW',
    model: '3 Series',
    year: 2023,
    power: 190,
    seats: 5,
    fuelType: 'diesel',
    transmission: 'automatic',
    pricePerDay: 80,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    power: 200,
    seats: 5,
    fuelType: 'diesel',
    transmission: 'automatic',
    pricePerDay: 90,
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    brand: 'Audi',
    model: 'A4',
    year: 2022,
    power: 150,
    seats: 5,
    fuelType: 'petrol',
    transmission: 'automatic',
    pricePerDay: 75,
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    brand: 'Toyota',
    model: 'Corolla',
    year: 2023,
    power: 122,
    seats: 5,
    fuelType: 'hybrid',
    transmission: 'automatic',
    pricePerDay: 45,
    imageUrl: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    brand: 'Škoda',
    model: 'Octavia',
    year: 2022,
    power: 150,
    seats: 5,
    fuelType: 'diesel',
    transmission: 'manual',
    pricePerDay: 55,
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500&h=300&fit=crop',
    isActive: true
  },
  {
    brand: 'Ford',
    model: 'Focus',
    year: 2023,
    power: 125,
    seats: 5,
    fuelType: 'petrol',
    transmission: 'automatic',
    pricePerDay: 48,
    imageUrl: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=500&h=300&fit=crop',
    isActive: false
  },
  {
    brand: 'Opel',
    model: 'Astra',
    year: 2022,
    power: 105,
    seats: 5,
    fuelType: 'petrol',
    transmission: 'manual',
    pricePerDay: 42,
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop',
    isActive: true
  }
];

const seedCars = async () => {
  for (const carData of cars) {
    const existing = await Car.findOne({ brand: carData.brand, model: carData.model, year: carData.year });
    if (existing) {
      console.log(`Automobil ${carData.brand} ${carData.model} (${carData.year}) već postoji, preskačem...`);
    } else {
      const car = new Car(carData);
      await car.save();
      console.log(`Automobil ${carData.brand} ${carData.model} (${carData.year}) kreiran uspešno!`);
    }
  }
  console.log('✅ Seed automobila završen!');
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => seedCars())
    .then(() => process.exit(0))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = seedCars;
