const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registracija i prijava korisnika
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registracija novog korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName, age]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: korisnik@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: lozinka123
 *               firstName:
 *                 type: string
 *                 example: Petar
 *               lastName:
 *                 type: string
 *                 example: Petrović
 *               age:
 *                 type: integer
 *                 minimum: 18
 *                 example: 25
 *     responses:
 *       201:
 *         description: Korisnik uspešno registrovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validaciona greška
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@rentacar.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Uspešna prijava
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Pogrešni kredencijali
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Unesite validan email'),
    body('password').notEmpty().withMessage('Lozinka je obavezna')
  ],
  authController.login
);

module.exports = router;
