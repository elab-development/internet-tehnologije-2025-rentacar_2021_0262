const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { createRental, getMyRentals, getAllRentals } = require('../controllers/rental.controller');

/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: Upravljanje rezervacijama automobila
 */

/**
 * @swagger
 * /api/rentals:
 *   post:
 *     summary: Kreiraj novu rezervaciju
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId, startDate, endDate]
 *             properties:
 *               carId:
 *                 type: string
 *                 description: MongoDB ID automobila
 *                 example: 64a1b2c3d4e5f6789abcdef0
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-04-01'
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: '2026-04-05'
 *     responses:
 *       201:
 *         description: Rezervacija kreirana
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Greška pri kreiranju rezervacije
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Neautorizovan pristup
 */
router.post('/', protect, createRental);

/**
 * @swagger
 * /api/rentals/my:
 *   get:
 *     summary: Dohvati rezervacije ulogovanog korisnika
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista rezervacija korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rental'
 *       401:
 *         description: Neautorizovan pristup
 */
router.get('/my', protect, getMyRentals);

/**
 * @swagger
 * /api/rentals/all:
 *   get:
 *     summary: Dohvati sve rezervacije (samo admin)
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista svih rezervacija
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rental'
 *       401:
 *         description: Neautorizovan pristup
 *       403:
 *         description: Nedovoljne privilegije
 */
router.get('/all', protect, authorize('admin'), getAllRentals);

module.exports = router;
