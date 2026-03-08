const { runMigration } = require('./migration-runner');

runMigration('003-add-isVerified-to-users', async (db) => {
  const result = await db.collection('users').updateMany(
    { isVerified: { $exists: false } },
    { $set: { isVerified: false } }
  );

  console.log(`  Korisnika ažurirano: ${result.modifiedCount}`);
  console.log(`  Korisnika bez promene (polje već postoji): ${result.matchedCount - result.modifiedCount}`);

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount
  };
});
