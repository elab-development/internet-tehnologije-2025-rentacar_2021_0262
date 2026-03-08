const Review = require('../models/Review');
const Car = require('../models/Car');

const recalculateAverageRating = async (carId) => {
  const result = await Review.aggregate([
    { $match: { carId: carId, isApproved: true } },
    { $group: { _id: '$carId', avg: { $avg: '$rating' } } }
  ]);
  const avg = result.length > 0 ? Math.round(result[0].avg * 10) / 10 : 0;
  await Car.findByIdAndUpdate(carId, { averageRating: avg });
};

exports.getReviews = async (req, res) => {
  try {
    const filter = { isApproved: true };
    if (req.query.carId) {
      filter.carId = req.query.carId;
    }
    const reviews = await Review.find(filter)
      .populate('userId', 'firstName lastName')
      .populate('carId', 'brand model')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('getReviews error:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju recenzija' });
  }
};

exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: false })
      .populate('userId', 'firstName lastName email')
      .populate('carId', 'brand model')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('getPendingReviews error:', error);
    res.status(500).json({ message: 'Greška pri dohvatanju recenzija' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    const car = await Car.findOne({ _id: carId, isActive: true });
    if (!car) {
      return res.status(404).json({ message: 'Automobil nije pronađen' });
    }

    const existing = await Review.findOne({ userId: req.user._id, carId });
    if (existing) {
      return res.status(409).json({ message: 'Već ste ostavili recenziju za ovaj automobil' });
    }

    const review = new Review({
      userId: req.user._id,
      carId,
      rating,
      comment,
      isApproved: false
    });

    await review.save();
    res.status(201).json({
      message: 'Recenzija je poslata i čeka odobrenje',
      review
    });
  } catch (error) {
    console.error('createReview error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Greška pri kreiranju recenzije' });
  }
};

exports.approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: 'Recenzija nije pronađena' });
    }
    await recalculateAverageRating(review.carId);
    res.json({ message: 'Recenzija je odobrena', review });
  } catch (error) {
    console.error('approveReview error:', error);
    res.status(500).json({ message: 'Greška pri odobravanju recenzije' });
  }
};

exports.rejectReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Recenzija nije pronađena' });
    }
    res.json({ message: 'Recenzija je odbijena i obrisana' });
  } catch (error) {
    console.error('rejectReview error:', error);
    res.status(500).json({ message: 'Greška pri odbijanju recenzije' });
  }
};
