const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const { ValidSuperAdmin } = require('../../middlewares/AuthMiddleware')

const GroupController = require('../../controllers/Backoffice/Group');

router.get('/list',
ValidSuperAdmin,
GroupController.list_get);

router.post('/create',
ValidSuperAdmin,
    body('name').not().isEmpty().trim().isLength({ min: 3, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().isLength({ min: 8 }),
    body('latitude').isDecimal(),
    body('longitude').isDecimal(),
GroupController.create_post);

router.post('/edit/:idGroup',
ValidSuperAdmin,
    body('name').not().isEmpty().trim().isLength({ min: 3, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('latitude').isDecimal(),
    body('longitude').isDecimal(),
GroupController.edit_post);

router.get('/:idGroup',
ValidSuperAdmin,
GroupController.get_get);

module.exports = router;