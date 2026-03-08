require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  {
    email: 'marko@example.com',
    passwordHash: 'user123',
    role: 'user',
    firstName: 'Marko',
    lastName: 'Marković',
    age: 28
  },
  {
    email: 'ana@example.com',
    passwordHash: 'user123',
    role: 'user',
    firstName: 'Ana',
    lastName: 'Anić',
    age: 25
  },
  {
    email: 'stefan@example.com',
    passwordHash: 'user123',
    role: 'user',
    firstName: 'Stefan',
    lastName: 'Stefanović',
    age: 32
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`Korisnik ${userData.email} već postoji, preskačem...`);
      } else {
        const user = new User(userData);
        await user.save();
        console.log(`Korisnik ${userData.email} kreiran uspešno!`);
      }
    }

    console.log('\n✅ Seed korisnika završen!');
    console.log('\nKredenijali:');
    console.log('─────────────────────────────');
    users.forEach(u => {
      console.log(`Email: ${u.email} | Lozinka: user123`);
    });
    console.log('─────────────────────────────');
    process.exit(0);
  } catch (error) {
    console.error('Greška pri seed-ovanju korisnika:', error);
    process.exit(1);
  }
};

seedUsers();
