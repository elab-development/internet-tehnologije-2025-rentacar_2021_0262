const { runMigration } = require('./migration-runner');

runMigration('001-add-categoryId-to-cars', async (db) => {
  const result = await db.collection('cars').updateMany(
    { categoryId: { $exists: false } },
    { $set: { categoryId: null } }
  );

  console.log(`  Automobila ažurirano: ${result.modifiedCount}`);
  console.log(`  Automobila bez promene (polje već postoji): ${result.matchedCount - result.modifiedCount}`);

  const existing = await db.collection('cars').indexExists('categoryId_1');
  if (!existing) {
    await db.collection('cars').createIndex({ categoryId: 1 }, { name: 'categoryId_1' });
    console.log('  Indeks categoryId_1 kreiran.');
  } else {
    console.log('  Indeks categoryId_1 već postoji.');
  }

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount
  };
});
