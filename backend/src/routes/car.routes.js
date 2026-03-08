const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');
const {
  getCars,
  getCarById,
  createCar,
  updateCar
} = require('../controllers/car.controller');

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Upravljanje automobilima
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Dohvati listu automobila
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filtriranje po kategoriji
 *     responses:
 *       200:
 *         description: Lista automobila
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
router.get('/', optionalAuth, getCars);

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Dohvati jedan automobil po ID-u
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID automobila
 *     responses:
 *       200:
 *         description: Podaci o automobilu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Automobil nije pronađen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', optionalAuth, getCarById);

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Dodaj novi automobil (samo admin)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand, model, year, power, seats, fuelType, transmission, pricePerDay]
 *             properties:
 *               brand:
 *                 type: string
 *                 example: BMW
 *               model:
 *                 type: string
 *                 example: 3 Series
 *               year:
 *                 type: integer
 *                 example: 2023
 *               power:
 *                 type: integer
 *                 example: 190
 *               seats:
 *                 type: integer
 *                 example: 5
 *               fuelType:
 *                 type: string
 *                 enum: [diesel, petrol, hybrid]
 *               transmission:
 *                 type: string
 *                 enum: [manual, automatic]
 *               pricePerDay:
 *                 type: number
 *                 example: 80
 *               imageUrl:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Automobil kreiran
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       401:
 *         description: Neautorizovan pristup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Nedovoljne privilegije
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, authorize('admin'), createCar);

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Izmeni automobil (samo admin)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ID automobila
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Automobil ažuriran
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       401:
 *         description: Neautorizovan pristup
 *       403:
 *         description: Nedovoljne privilegije
 *       404:
 *         description: Automobil nije pronađen
 */
router.put('/:id', protect, authorize('admin'), updateCar);

module.exports = router;
