const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const ReportController = require('../controllers/Report')
const { ValidUser } = require('../middlewares/AuthMiddleware')

router.post('/create',
    ValidUser,
    body('latitude').isDecimal(),
    body('longitude').isDecimal(),
    body('level').isInt({ min: 1, max: 3 }),
ReportController.create_post);

router.get('/list',
    ValidUser,
ReportController.list_get);

// :isLastMinutes (0 = Todos; 1 = Ultimos 20min)
router.get('/list/location/:latitude/:longitude/:isLastMinutes',
    ValidUser,
ReportController.list_location_get);

router.post('/like/:IdReport',
    ValidUser,
    body('isLike').isBoolean(),
ReportController.like_post);

router.delete('/like/:IdReportLike',
    ValidUser,
ReportController.like_delete);

module.exports = router;