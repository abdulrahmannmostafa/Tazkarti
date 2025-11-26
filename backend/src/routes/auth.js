const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }),
  body('password').isLength({ min: 6 }),
  body('email').isEmail(),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('birthDate').isISO8601(),
  body('gender').isIn(['male', 'female']),
  body('city').notEmpty(),
  body('role').isIn(['manager', 'fan']),
  validateRequest
], authController.register);

// Login
router.post('/login', [
  body('username').notEmpty(),
  body('password').notEmpty(),
  validateRequest
], authController.login);

module.exports = router;