const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju kategorija' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, isActive: true });
    if (!category) {
      return res.status(404).json({ message: 'Kategorija nije pronađena' });
    }
    res.json(category);
  } catch (error) {
    console.error('getCategoryById error:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju kategorije' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('createCategory error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Kategorija sa ovim nazivom već postoji' });
    }
    res.status(500).json({ message: 'Greška pri kreiranju kategorije' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Kategorija nije pronađena' });
    }
    res.json(category);
  } catch (error) {
    console.error('updateCategory error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Greška pri izmeni kategorije' });
  }
};
