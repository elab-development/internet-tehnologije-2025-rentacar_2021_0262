require('dotenv').config();
const mongoose = require('mongoose');

const runMigration = async (name, migrateFn) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    const db = mongoose.connection.db;

    const alreadyRan = await db.collection('migrations').findOne({ name });
    if (alreadyRan) {
      console.log(`Migracija '${name}' je već primenjena (${alreadyRan.appliedAt.toISOString()}). Preskačem.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`Pokretanje migracije: ${name}`);
    const result = await migrateFn(db);

    await db.collection('migrations').insertOne({
      name,
      appliedAt: new Date(),
      result
    });

    console.log(`\n✅ Migracija '${name}' uspešno primenjena!`);
    if (result) console.log('Rezultat:', JSON.stringify(result, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Greška pri migraciji '${name}':`, error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

module.exports = { runMigration };
