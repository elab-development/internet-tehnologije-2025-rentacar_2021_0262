require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  {
    name: 'Ekonomska',
    slug: 'ekonomska',
    description: 'Pristupačna vozila za svakodnevnu upotrebu sa niskom potrošnjom goriva.',
    isActive: true
  },
  {
    name: 'Luksuzna',
    slug: 'luksuzna',
    description: 'Premijum vozila sa visokom opremom i vrhunskim komforom.',
    isActive: true
  },
  {
    name: 'SUV',
    slug: 'suv',
    description: 'Terenska i porodična vozila sa visokim klirenseom.',
    isActive: true
  },
  {
    name: 'Sportska',
    slug: 'sportska',
    description: 'Vozila sa snažnim motorima i sportskim karakteristikama.',
    isActive: true
  },
  {
    name: 'Električna i hibridna',
    slug: 'elektricna-hibridna',
    description: 'Ekološki prihvatljiva vozila sa niskim emisijama.',
    isActive: true
  }
];

const seedCategories = async () => {
  for (const catData of categories) {
    const existing = await Category.findOne({ slug: catData.slug });
    if (existing) {
      console.log(`Kategorija '${catData.name}' već postoji, preskačem...`);
    } else {
      const category = new Category(catData);
      await category.save();
      console.log(`Kategorija '${catData.name}' kreirana uspešno!`);
    }
  }
  console.log('✅ Seed kategorija završen!');
};

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => seedCategories())
    .then(() => process.exit(0))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = seedCategories;
