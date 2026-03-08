require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Car = require('../models/Car');
const Review = require('../models/Review');

const reviewTemplates = [
  { rating: 5, comment: 'Odličan automobil, sve je bilo savršeno. Toplo preporučujem!' },
  { rating: 4, comment: 'Vrlo dobro iskustvo, automobil čist i uredan. Mala primedba na potrošnju goriva.' },
  { rating: 5, comment: 'Fantastičan komfor i performanse. Definitivno ću ponovo iznajmiti.' },
  { rating: 3, comment: 'Solidno vozilo, ali klimatizacija nije radila kako treba.' },
  { rating: 4, comment: 'Dobro stanje automobila i brza usluga preuzimanja.' },
  { rating: 5, comment: 'Sve pohvale, vozilo kao novo. Preporučujem svima.' }
];

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const users = await User.find({ role: 'user' }).limit(3);
    const cars = await Car.find({ isActive: true }).limit(6);

    if (users.length === 0) {
      console.log('Nema korisnika sa ulogom user. Prvo pokrenite seed za korisnike.');
      process.exit(1);
    }

    if (cars.length === 0) {
      console.log('Nema automobila u bazi. Prvo pokrenite seed:cars.');
      process.exit(1);
    }

    let count = 0;
    for (let i = 0; i < Math.min(cars.length, reviewTemplates.length); i++) {
      const user = users[i % users.length];
      const car = cars[i];
      const template = reviewTemplates[i];

      const existing = await Review.findOne({ userId: user._id, carId: car._id });
      if (existing) {
        console.log(`Recenzija za ${car.brand} ${car.model} od ${user.firstName} već postoji, preskačem...`);
        continue;
      }

      const review = new Review({
        userId: user._id,
        carId: car._id,
        rating: template.rating,
        comment: template.comment,
        isApproved: true
      });

      await review.save();

      const result = await Review.aggregate([
        { $match: { carId: car._id, isApproved: true } },
        { $group: { _id: '$carId', avg: { $avg: '$rating' } } }
      ]);
      if (result.length > 0) {
        const avg = Math.round(result[0].avg * 10) / 10;
        await Car.findByIdAndUpdate(car._id, { averageRating: avg });
      }

      console.log(`Recenzija za ${car.brand} ${car.model} kreirana (ocena: ${template.rating})`);
      count++;
    }

    console.log(`\n✅ Seed recenzija završen! Kreirano ${count} recenzija.`);
    process.exit(0);
  } catch (error) {
    console.error('Greška pri seed-ovanju recenzija:', error);
    process.exit(1);
  }
};

seedReviews();
