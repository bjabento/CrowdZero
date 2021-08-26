const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const GroupController = require('../../controllers/Web/Group');
const { ValidGroup } = require('../../middlewares/AuthMiddleware')

router.get('/name',
ValidGroup,
GroupController.name_get);

router.put('/name',
ValidGroup,
body('name').not().isEmpty().trim().isLength({ min: 3, max: 100 }),
GroupController.name_put);

router.put('/password',
ValidGroup,
body('current_password').not().isEmpty().isLength({ min: 8 }),
body('new_password').not().isEmpty().isLength({ min: 8 }),
GroupController.password_put);

module.exports = router;