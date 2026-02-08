require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const admins = [
  {
    email: 'admin@rentacar.com',
    passwordHash: 'admin123', // Bice hashovan automatski
    role: 'admin',
    firstName: 'Admin',
    lastName: 'Adminović',
    age: 30
  },
  {
    email: 'manager@rentacar.com',
    passwordHash: 'manager123',
    role: 'admin',
    firstName: 'Menadžer',
    lastName: 'Menadžerović',
    age: 35
  }
];

const seedAdmins = async () => {
  try {
    // Konekcija na bazu
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Provera da li admini već postoje
    for (const adminData of admins) {
      const existingAdmin = await User.findOne({ email: adminData.email });
      
      if (existingAdmin) {
        console.log(`Admin ${adminData.email} već postoji, preskačem...`);
      } else {
        const admin = new User(adminData);
        await admin.save();
        console.log(`Admin ${adminData.email} kreiran uspešno!`);
      }
    }

    console.log('\n✅ Seed admin korisnika završen!');
    console.log('\nKredenijali za login:');
    console.log('─────────────────────────────');
    admins.forEach(admin => {
      console.log(`Email: ${admin.email}`);
      console.log(`Lozinka: ${admin.passwordHash}`);
      console.log('─────────────────────────────');
    });

    process.exit(0);
  } catch (error) {
    console.error('Greška pri seed-ovanju admina:', error);
    process.exit(1);
  }
};

seedAdmins();
