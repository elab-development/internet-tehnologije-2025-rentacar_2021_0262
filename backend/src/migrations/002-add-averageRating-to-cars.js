const { runMigration } = require('./migration-runner');

runMigration('002-add-averageRating-to-cars', async (db) => {
  const result = await db.collection('cars').updateMany(
    {
      $or: [
        { averageRating: { $exists: false } },
        { averageRating: null }
      ]
    },
    { $set: { averageRating: 0 } }
  );

  console.log(`  Automobila ažurirano: ${result.modifiedCount}`);
  console.log(`  Automobila bez promene (polje već ima vrednost): ${result.matchedCount - result.modifiedCount}`);

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount
  };
});
