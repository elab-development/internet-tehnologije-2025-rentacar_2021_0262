const Rental = require('../models/Rental');
const Car = require('../models/Car');

exports.createRental = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    const car = await Car.findOne({ _id: carId, isActive: true });
    if (!car) {
      return res.status(404).json({ message: 'Automobil nije pronađen' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Datumi nisu validni' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'Datum kraja mora biti posle datuma početka' });
    }

    const isAvailable = await Rental.isCarAvailable(carId, start, end);
    if (!isAvailable) {
      return res.status(409).json({ message: 'Automobil nije dostupan u izabranom periodu' });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.pricePerDay;

    const rental = new Rental({
      userId: req.user._id,
      carId,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'reserved'
    });

    await rental.save();

    const populatedRental = await Rental.findById(rental._id)
      .populate('carId', 'brand model year pricePerDay imageUrl')
      .populate('userId', 'firstName lastName email');

    res.status(201).json({
      message: 'Rezervacija je uspešno kreirana',
      rental: populatedRental
    });
  } catch (error) {
    console.error('createRental error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Greška pri kreiranju rezervacije' });
  }
};

exports.getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ userId: req.user._id })
      .populate('carId', 'brand model year pricePerDay imageUrl')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    console.error('getMyRentals error:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju rezervacija' });
  }
};
