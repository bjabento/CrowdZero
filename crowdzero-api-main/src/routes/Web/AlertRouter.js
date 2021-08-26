const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const AlertController = require('../../controllers/Web/Alert');
const { ValidGroup } = require('../../middlewares/AuthMiddleware')

router.get('/list/:alertType',
ValidGroup,
AlertController.list_get);

router.get('/fix/:idGroupPlaceAlert',
ValidGroup,
AlertController.fix_get);

module.exports = router;