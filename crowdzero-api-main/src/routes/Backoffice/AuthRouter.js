const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const AuthController = require('../../controllers/Backoffice/Auth');

router.post('/login',
    body('password').not().isEmpty().withMessage('O campo Password não pode ser vazio!'),
AuthController.login);

module.exports = router;