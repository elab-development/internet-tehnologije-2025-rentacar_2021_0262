const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Korisnik sa ovim email-om već postoji' });
    }

    const user = new User({
      email,
      passwordHash: password,
      firstName,
      lastName,
      age,
      role: 'user'
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Uspešna registracija',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Greška pri registraciji' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email i lozinka su obavezni' });
    }

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Pogrešan email ili lozinka' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Pogrešan email ili lozinka' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Uspešno logovanje',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Greška pri logovanju' });
  }
};
