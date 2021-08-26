var GroupUserModel = require('../../models/GroupUserModel');
var UserModel = require('../../models/UserModel');

const { fn, col } = require("sequelize");

const controller = {};

controller.list_get = async (req, res) => {
    await GroupUserModel.findAll({
        where: {
            GroupFK: req.user.IdGroup
        },
        attributes: {
            include: [
                [fn('to_char', col('tbl_groups_users.CreatedIn'), 'DD/MM/YYYY HH24:MI'), 'CreatedInFormatted']
            ]
        },
        include: [
            {
                model: UserModel,
                as: 'User',
                attributes: { 
                    exclude: [
                        'Email',
                        'Password',
                        'Active',
                        'ActivatedIn'
                    ]
                }
            }
        ]
    })
    .then(users => {
        return res.status(200).send({ error: false, data: users });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.accept_get = async (req, res) => {
    await GroupUserModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            IdGroupUser: req.params.idGroupUser,
            Accepted: false
        }
    })
    .then(groupUser => {
        if (!groupUser) {
            return res.status(404).send({ error: true, message: "Nenhum utilizador econtrado!" });
        }

        groupUser.update({
            Accepted: true
        });

        return res.status(200).send({ error: false, message: "Utilizador aceite!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.refuse_get = async (req, res) => {
    await GroupUserModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            IdGroupUser: req.params.idGroupUser,
            Accepted: false
        }
    })
    .then(groupUser => {
        if (!groupUser) {
            return res.status(404).send({ error: true, message: "Nenhum utilizador econtrado!" });
        }

        groupUser.destroy();

        return res.status(200).send({ error: false, message: "Utilizador recusado!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.remove_delete = async (req, res) => {
    await GroupUserModel.findOne({
        where: {
            GroupFK: req.user.IdGroup,
            IdGroupUser: req.params.idGroupUser
        }
    })
    .then(groupUser => {
        if (!groupUser) {
            return res.status(404).send({ error: true, message: "Nenhum utilizador econtrado!" });
        }

        groupUser.destroy();

        return res.status(200).send({ error: false, message: "Utilizador removido!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

module.exports = controller;