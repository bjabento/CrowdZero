const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const UserController = require('../../controllers/Web/User');
const { ValidGroup } = require('../../middlewares/AuthMiddleware')

router.get('/list',
ValidGroup,
UserController.list_get);

router.get('/accept/:idGroupUser',
ValidGroup,
UserController.accept_get);

router.get('/refuse/:idGroupUser',
ValidGroup,
UserController.refuse_get);

router.delete('/remove/:idGroupUser',
ValidGroup,
UserController.remove_delete);

module.exports = router;