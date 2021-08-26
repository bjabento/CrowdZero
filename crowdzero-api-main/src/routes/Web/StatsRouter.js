const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const StatsController = require('../../controllers/Web/Stats');
const { ValidGroup } = require('../../middlewares/AuthMiddleware')

router.get('/today',
ValidGroup,
StatsController.today_get);

router.get('/last_24h',
ValidGroup,
StatsController.last_24h_get);

router.get('/week',
ValidGroup,
StatsController.week_get);

router.get('/month',
ValidGroup,
StatsController.week_get);

module.exports = router;