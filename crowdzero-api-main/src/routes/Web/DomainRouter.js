const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const DomainController = require('../../controllers/Web/Domain');
const { ValidGroup } = require('../../middlewares/AuthMiddleware')

router.get('/list',
ValidGroup,
DomainController.list_get);

router.post('/create',
ValidGroup,
body('domain').not().isEmpty(),
DomainController.create_post);

router.post('/edit/:idGroupDomain',
ValidGroup,
body('domain').not().isEmpty(),
DomainController.edit_post);

router.get('/:idGroupDomain',
ValidGroup,
DomainController.get_get);

router.delete('/:idGroupDomain',
ValidGroup,
DomainController.delete_delete);

module.exports = router;