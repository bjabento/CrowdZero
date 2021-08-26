const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const GroupController = require('../controllers/Group')
const { ValidUser } = require('../middlewares/AuthMiddleware')

router.get('/my/list',
    ValidUser,
GroupController.my_list_get);

router.get('/search/:search',
    ValidUser,
GroupController.search_get);

router.post('/enter',
    ValidUser,
    body('IdGroup').isInt(),
GroupController.enter_post);

router.post('/leave',
    ValidUser,
    body('IdGroup').isInt(),
GroupController.leave_post);


router.get('/:idGroup/places',
    ValidUser,
GroupController.places_get);

router.get('/:idGroup/place/:idPlace/reports',
    ValidUser,
GroupController.place_reports_get);

router.get('/:idGroup/place/:idPlace/reports/last',
    ValidUser,
GroupController.place_reports_last_get);

router.post('/:idGroup/place/report',
    ValidUser,
    body('idPlace').isInt(),
    body('level').isInt({ min: 1, max: 3 }),
GroupController.place_report_post);

router.post('/:idGroup/place/report/:IdReport/like',
    ValidUser,
    body('isLike').isBoolean(),
    GroupController.place_report_like_post);

router.delete('/:idGroup/place/report/like/:IdReportLike',
    ValidUser,
GroupController.place_report_like_delete);


module.exports = router;