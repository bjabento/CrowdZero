var JwtHelper = require('../helpers/JwtHelper');
var UserModel = require('../models/UserModel');
var GroupModel = require('../models/GroupModel');

const AuthMiddleware = {};

VerifyToken = function (req, res) {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const splittedAuth = authHeader.split(' ');
        
        if (splittedAuth.length != 2 || splittedAuth[0] !== "Bearer") {
            return res.sendStatus(401);
        }

        const token = splittedAuth[1];
        var Decrypted = JwtHelper.decode(token);
        if (!Decrypted) {
            return res.sendStatus(401);
        }

        req.user = Decrypted.User;
    } else {
        return res.sendStatus(401);
    }
};

AuthMiddleware.ValidUser = async function (req, res, next) {
    VerifyToken(req, res);

    if (!req.user.hasOwnProperty('IdUser') || req.user.IdUser == -1) {
        return res.sendStatus(401);
    }

    await UserModel.findOne({ 
        where: {
            IdUser: req.user.IdUser,
            Active: true
        }
    }).then(User => {
        if(!User) return res.sendStatus(401);

        next();
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
};

AuthMiddleware.ValidGroup = async function (req, res, next) {
    VerifyToken(req, res);

    if (!req.user.hasOwnProperty('IdGroup')) {
        return res.sendStatus(401);
    }

    await GroupModel.findOne({ 
        where: {
            IdGroup: req.user.IdGroup
        }
    }).then(Group => {
        if(!Group) return res.sendStatus(401);

        next();
    }).catch(err => {
        return res.status(500).send({ error: true, message: err.message });
    });
};

AuthMiddleware.ValidSuperAdmin = function (req, res, next) {
    VerifyToken(req, res);

    if (!req.user.hasOwnProperty('IdUser')) {
        return res.sendStatus(401);
    }

    if (!req.user.IsSuperAdmin) {
        return res.sendStatus(401);
    }

    next();
};

module.exports = AuthMiddleware;