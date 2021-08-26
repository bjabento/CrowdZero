const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const PlaceController = require('../../controllers/Web/Place');
const { ValidGroup } = require('../../middlewares/AuthMiddleware')

router.get('/list',
ValidGroup,
PlaceController.list_get);

router.post('/create',
ValidGroup,
body('name').not().isEmpty().trim().isLength({ min: 3, max: 100 }),
PlaceController.create_post);

router.post('/edit/:idGroupPlace',
ValidGroup,
body('name').not().isEmpty().trim().isLength({ min: 3, max: 100 }),
PlaceController.edit_post);

router.delete('/:idGroupPlace',
ValidGroup,
PlaceController.delete_delete);

router.get('/stats/today/:idGroupPlace',
ValidGroup,
PlaceController.stats_today_get);

router.get('/stats/24h/:idGroupPlace',
ValidGroup,
PlaceController.stats_24h_get);

router.get('/stats/week/:idGroupPlace',
ValidGroup,
PlaceController.stats_week_get);

router.get('/stats/month/:idGroupPlace',
ValidGroup,
PlaceController.stats_month_get);

router.get('/:idGroupPlace',
ValidGroup,
PlaceController.get_get);

module.exports = router;