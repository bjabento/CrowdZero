var GroupModel = require('../../models/GroupModel');

const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const controller = {};

controller.name_get = async (req, res) => {
    await GroupModel.findOne({
        attributes: [
            'Name'
        ],
        where: {
            IdGroup: req.user.IdGroup
        }
    })
    .then(group => {
        return res.status(200).send({ error: false, data: group });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.name_put = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupModel.findOne({
        where: {
            IdGroup: req.user.IdGroup
        }
    })
    .then(group => {
        group.update({
            Name: req.body.name
        })

        return res.status(200).send({ error: false, message: "Nome editado!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.password_put = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupModel.findOne({
        where: {
            IdGroup: req.user.IdGroup
        }
    })
    .then(group => {
        bcrypt.compare(req.body.current_password, group.Password, (error, match) => {
            if (error) return res.status(500).json(error);

            if (match) {
                group.update({
                    Password: bcrypt.hashSync(req.body.new_password, 8)
                })

                return res.status(200).json({ error: false, message: "Password alterada!" });
            }

            return res.status(400).json({ error: true, message: "Password incorreta!" });
        });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

module.exports = controller;