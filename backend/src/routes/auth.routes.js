const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Unesite validan email'),
    body('password').isLength({ min: 6 }).withMessage('Lozinka mora imati najmanje 6 karaktera'),
    body('firstName').notEmpty().withMessage('Ime je obavezno'),
    body('lastName').notEmpty().withMessage('Prezime je obavezno'),
    body('age').isInt({ min: 18 }).withMessage('Morate imati najmanje 18 godina')
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Unesite validan email'),
    body('password').notEmpty().withMessage('Lozinka je obavezna')
  ],
  authController.login
);

module.exports = router;
