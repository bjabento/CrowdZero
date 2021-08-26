var GroupModel = require('../../models/GroupModel');
const bcrypt = require('bcrypt');

const BackofficeConfig = require('../../configs/Backoffice');

const { validationResult } = require('express-validator');

const controller = {};

controller.get_get = async (req, res) => {
    await GroupModel.findOne({
        where: {
            IdGroup: req.params.idGroup
        }
    })
    .then(Group => {
        return res.status(200).json({ error: false, group: Group });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.list_get = async (req, res) => {
    await GroupModel.findAll()
    .then(Groups => {
        return res.status(200).json({ error: false, data: Groups });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.create_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const _Location = { type: 'Point', coordinates: [req.body.latitude, req.body.longitude]};

    await GroupModel.create({
        Name: req.body.name,
        Email: req.body.email,
        Password: hashedPassword,
        Location: _Location,
        Active: false,
        ActivatedIn: null
    }).then(Group => {
        if (!Group) {
            return res.status(500).send({ error: true, message: "Não foi possível criar esse grupo!" });
        }

        return res.status(200).send({ error: false, message: "Grupo criado com sucesso!", group: Group });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.edit_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    const _Location = { type: 'Point', coordinates: [req.body.latitude, req.body.longitude]};

    await GroupModel.findOne({
        where: {
            IdGroup: req.params.idGroup
        }
    })
    .then(async Group => {
        await Group.update({
            Name: req.body.name,
            Email: req.body.email,
            Location: _Location,
        }).then(updatedGroup => {
            return res.status(200).send({ error: false, message: "Grupo editado!", group: updatedGroup });
        }).catch(err => {
            return res.status(500).send({ error: true, message: err.message });
        });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

module.exports = controller;