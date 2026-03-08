const User = require('../models/User');
const Car = require('../models/Car');
const Category = require('../models/Category');
const Review = require('../models/Review');

const seedAdmins = require('./admin.seed');
const seedUsers = require('./user.seed');
const seedCategories = require('./category.seed');
const seedCars = require('./car.seed');
const seedReviews = require('./review.seed');

const autoSeed = async () => {
  try {
    console.log('Pokretanje automatskog seed-a...');

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('Admini: tabela prazna, seedujem...');
      await seedAdmins();
    } else {
      console.log(`Admini: ${adminCount} već postoji, preskačem.`);
    }

    const userCount = await User.countDocuments({ role: 'user' });
    if (userCount === 0) {
      console.log('Korisnici: tabela prazna, seedujem...');
      await seedUsers();
    } else {
      console.log(`Korisnici: ${userCount} već postoji, preskačem.`);
    }

    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('Kategorije: tabela prazna, seedujem...');
      await seedCategories();
    } else {
      console.log(`Kategorije: ${categoryCount} već postoji, preskačem.`);
    }

    const carCount = await Car.countDocuments();
    if (carCount === 0) {
      console.log('Automobili: tabela prazna, seedujem...');
      await seedCars();
    } else {
      console.log(`Automobili: ${carCount} već postoji, preskačem.`);
    }

    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('Recenzije: tabela prazna, seedujem...');
      await seedReviews();
    } else {
      console.log(`Recenzije: ${reviewCount} već postoji, preskačem.`);
    }

    console.log('✅ Auto-seed završen.');
  } catch (error) {
    console.error('Greška pri automatskom seed-u:', error);
  }
};

module.exports = autoSeed;
