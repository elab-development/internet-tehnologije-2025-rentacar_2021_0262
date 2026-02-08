require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Rent-a-Car API Running' });
});

// Routes will be added here
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/cars', require('./routes/car.routes'));
// app.use('/api/rentals', require('./routes/rental.routes'));
// app.use('/api/users', require('./routes/user.routes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
