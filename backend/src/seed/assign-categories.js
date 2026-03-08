require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('../models/Car');
const Category = require('../models/Category');

const categoryMapping = [
  { brand: 'BMW', model: '3 Series', categorySlug: 'luksuzna' },
  { brand: 'Mercedes-Benz', model: 'C-Class', categorySlug: 'luksuzna' },
  { brand: 'Audi', model: 'A4', categorySlug: 'luksuzna' },
  { brand: 'Toyota', model: 'Corolla', categorySlug: 'elektricna-hibridna' },
  { brand: 'Škoda', model: 'Octavia', categorySlug: 'ekonomska' },
  { brand: 'Ford', model: 'Focus', categorySlug: 'ekonomska' },
  { brand: 'Opel', model: 'Astra', categorySlug: 'ekonomska' }
];

const assignCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    for (const mapping of categoryMapping) {
      const category = await Category.findOne({ slug: mapping.categorySlug });
      if (!category) {
        console.log(`Kategorija '${mapping.categorySlug}' nije pronađena, preskačem...`);
        continue;
      }

      const result = await Car.updateMany(
        { brand: mapping.brand, model: mapping.model },
        { $set: { categoryId: category._id } }
      );

      console.log(`${mapping.brand} ${mapping.model} → ${category.name} (${result.modifiedCount} automobila ažurirano)`);
    }

    console.log('\n✅ Dodela kategorija završena!');
    process.exit(0);
  } catch (error) {
    console.error('Greška:', error);
    process.exit(1);
  }
};

assignCategories();
