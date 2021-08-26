var UserModel = require('../models/UserModel');
const JwtHelper = require('../helpers/JwtHelper');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const MailConfig = require('../configs/MailConfig');
const moment = require('moment')

const { validationResult } = require('express-validator');

const controller = {};

controller.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await UserModel.findOne({ 
        where: {
            Email: req.body.email,
            Active: true
        }
    }).then(User => {
        if(!User) return res.status(401).json({ error: true, message: "Email ou Password incorretos!" });

        bcrypt.compare(req.body.password, User.Password, (error, match) => {
            if (error) return res.status(500).json(error);

            if (match) {
                const UserForJwt = {
                    "IdUser": User.IdUser,
                    "Email": User.Email,
                    "Name": User.Name,
                    "IsSuperAdmin": false
                }

                return res.status(200).json({ error: false, message: "Logado com sucesso!", token: JwtHelper.encode({ "User": UserForJwt }), id_user: User.IdUser });
            }

            return res.status(401).json({ error: true, message: "Email ou Password incorretos!" });
        });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    await UserModel.create({
        Name: req.body.name,
        Email: req.body.email,
        Password: hashedPassword,
        Active: false,
        ActivatedIn: null
    }).then(User => {
        if (!User) {
            return res.status(500).send({ error: true, message: "Não foi possível criar uma conta!" });
        }

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MailConfig.Email,
                pass: MailConfig.Password
            }
        });

        var mailOptions = {
            from: MailConfig.Email,
            to: req.body.email,
            subject: 'CrowdZero Account Confirmation',
            text: 'Confirmation Link: ' + MailConfig.UrlForConfirmation + JwtHelper.encode({ "Email": req.body.email })
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).send({ error: false, message: "Conta criada com sucesso!", user: User });
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}

controller.confirm_get = async (req, res) => {
    var decodedJwt = JwtHelper.decode(req.params.jwt);

    if (!decodedJwt) {
        return res.status(400).json({ error: true, message: "Token inválido!" });
    }

    await UserModel.findOne({
        where: {
            Email: decodedJwt.Email
        }
    })
    .then(user => {
        user.update({
            Active: true
        })

        return res.status(200).send({ error: false, message: "Conta ativada!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
}


controller.forgot_password_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    await UserModel.findOne({
        where:{
            Email: req.body.email
        }
    })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: true, message: "Email não encontrado!" });
        }

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: MailConfig.Email,
                pass: MailConfig.Password
            }
        });

        var mailOptions = {
            from: MailConfig.Email,
            to: req.body.email,
            subject: 'CrowdZero Password Reset',
            text: 'Reset Link: ' + MailConfig.UrlForConfirmation3 + JwtHelper.encode({ "Email": req.body.email, "ExpiresIn": moment().add(15, 'minutes').toDate() })
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.status(503).send({ error: true, message: "Não foi possível enviar um mail! Tente de novo mais tarde!" });
            } else {
                return res.status(200).send({ error: false, message: "Email de reset password enviado!" });
            }
        });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}

controller.reset_password_post = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, errors: errors.array() });
    }

    var decodedJwt = JwtHelper.decode(req.params.jwt);
    if (!decodedJwt) {
        return res.status(400).json({ error: true, message: "Token inválido!" });
    }

    if (decodedJwt.ExpiresIn < moment().toDate()) {
        return res.status(400).json({ error: true, message: "Token inválido!" });
    }

    await UserModel.findOne({
        where:{
            Email: decodedJwt.Email
        }
    })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: true, message: "Email não encontrado!" });
        }

        var hashedPassword = bcrypt.hashSync(req.body.password, 8);

        user.update({
            Password: hashedPassword
        })

        return res.status(200).send({ error: false, message: "Password atualizada!" });
    })
    .catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    })
}


module.exports = controller;