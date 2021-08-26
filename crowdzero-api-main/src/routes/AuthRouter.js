const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const AuthController = require('../controllers/Auth');

router.get('/confirm/:jwt',
AuthController.confirm_get);

router.post('/login', 
    body('email').isEmail().normalizeEmail(), 
    body('password').not().isEmpty(), 
AuthController.login);

router.post('/register', 
    body('name').not().isEmpty().trim().isLength({ min: 3, max: 100 }), 
    body('email').isEmail().normalizeEmail(), 
    body('password').not().isEmpty().isLength({ min: 8 }), 
AuthController.register);


router.post('/forgot/password',
    body('email').isEmail().normalizeEmail(),
AuthController.forgot_password_post);

router.post('/reset/password/:jwt',
    body('password').not().isEmpty().isLength({ min: 8 }),
AuthController.reset_password_post);

module.exports = router;