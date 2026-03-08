const Car = require('../models/Car');
const Rental = require('../models/Rental');

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isActive: true }).sort({ createdAt: 1 });

    const now = new Date();

    const carsWithAvailability = await Promise.all(
      cars.map(async (car) => {
        const activeRental = await Rental.findOne({
          carId: car._id,
          status: { $in: ['reserved', 'active'] },
          startDate: { $lte: now },
          endDate: { $gte: now }
        });

        return {
          ...car.toObject(),
          available: !activeRental
        };
      })
    );

    res.json(carsWithAvailability);
  } catch (error) {
    console.error('getCars error:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju automobila' });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, isActive: true });
    if (!car) {
      return res.status(404).json({ message: 'Automobil nije pronađen' });
    }

    const now = new Date();
    const activeRental = await Rental.findOne({
      carId: car._id,
      status: { $in: ['reserved', 'active'] },
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    res.json({ ...car.toObject(), available: !activeRental });
  } catch (error) {
    console.error('getCarById error:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju automobila' });
  }
};

exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ ...car.toObject(), available: true });
  } catch (error) {
    console.error('createCar error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Greška pri kreiranju automobila' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!car) {
      return res.status(404).json({ message: 'Automobil nije pronađen' });
    }
    res.json(car);
  } catch (error) {
    console.error('updateCar error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Greška pri izmeni automobila' });
  }
};
