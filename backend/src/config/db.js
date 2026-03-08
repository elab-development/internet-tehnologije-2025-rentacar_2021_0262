const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 3000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`Konekcija na MongoDB neuspešna (pokušaj ${i}/${retries}): ${error.message}`);
      if (i === retries) {
        console.error('Nije moguće konektovati se na MongoDB. Gašenje...');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;
