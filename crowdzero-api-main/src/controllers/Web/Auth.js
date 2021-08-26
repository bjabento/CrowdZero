var GroupModel = require('../../models/GroupModel');
const JwtHelper = require('../../helpers/JwtHelper');
const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');

const controller = {};

controller.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await GroupModel.findOne({ 
        where: {
            Email: req.body.email
        }
    }).then(Group => {
        if(!Group) return res.status(401).json({ error: true, message: "Email ou Password incorretos!" });

        bcrypt.compare(req.body.password, Group.Password, (error, match) => {
            if (error) return res.status(500).json(error);

            if (match) {
                const GroupForJwt = {
                    "IdGroup": Group.IdGroup,
                    "Email": Group.Email,
                    "Name": Group.Name,
                    "IsSuperAdmin": false
                }

                return res.status(200).json({ error: false, message: "Logado com sucesso!", data: {"name": Group.Name}, token: JwtHelper.encode({ "User": GroupForJwt }) });
            }

            return res.status(401).json({ error: true, message: "Email ou Password incorretos!" });
        });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

module.exports = controller;