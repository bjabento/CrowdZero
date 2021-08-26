const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const UserController = require('../controllers/User')
const { ValidUser } = require('../middlewares/AuthMiddleware')

router.get('/email/list',
    ValidUser,
UserController.email_list_get);

router.get('/email/confirm/:jwt',
UserController.email_confirm_get);

router.post('/email/link',
    ValidUser,
    body('email').isEmail().normalizeEmail(),
UserController.email_link_post);

router.delete('/email/delete/:idUserEmail',
    ValidUser,
UserController.email_delete_delete);

router.get('/profile',
    ValidUser,
UserController.profile_get);

router.put('/profile',
    ValidUser,
    body('name').not().isEmpty().trim().isLength({ min: 3, max: 100 }),
UserController.profile_put);

router.put('/avatar',
    ValidUser,
    body('avatar').isInt(),
UserController.avatar_put);

router.get('/stats/week',
    ValidUser,
UserController.stats_week_get);

router.get('/stats/month',
    ValidUser,
UserController.stats_month_get);

router.get('/stats/always',
    ValidUser,
UserController.stats_always_get);

router.put('/password/change',
    ValidUser,
    body('password').not().isEmpty(),
    body('new_password').not().isEmpty().isLength({ min: 8 }),
UserController.password_change_put);

router.get('/favourite/list',
    ValidUser,
UserController.favourite_list_get);

router.post('/favourite',
    ValidUser,
    body('latitude').isDecimal(),
    body('longitude').isDecimal(),
UserController.favourite_post);

router.delete('/favourite/:idUserFavourite',
    ValidUser,
UserController.favourite_delete);

module.exports = router;