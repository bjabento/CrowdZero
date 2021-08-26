const JwtHelper = require('../../helpers/JwtHelper')
const bcrypt = require('bcrypt')

const BackofficeConfig = require('../../configs/Backoffice');

const { validationResult } = require('express-validator');

const controller = {};

controller.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    if (req.body.password == BackofficeConfig.PASSWORD) {
        const UserForJwt = {
            "IdUser": -1,
            "Name": "Root",
            "IsSuperAdmin": true
        }

        return res.status(200).json({ error: false, message: "Logado com sucesso!", token: JwtHelper.encode({ "User": UserForJwt }) });
    } else {
        return res.status(401).json({ error: true, message: "Password incorreta!" });
    }
}

module.exports = controller;