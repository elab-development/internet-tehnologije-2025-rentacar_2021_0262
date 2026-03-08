require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const admins = [
  {
    email: 'admin@rentacar.com',
    passwordHash: 'admin123',
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
  console.log('✅ Seed admin korisnika završen!');
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => seedAdmins())
    .then(() => process.exit(0))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = seedAdmins;
