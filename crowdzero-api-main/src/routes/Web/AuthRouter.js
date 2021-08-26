const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const AuthController = require('../../controllers/Web/Auth');

router.post('/login',
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty(),
AuthController.login);

module.exports = router;