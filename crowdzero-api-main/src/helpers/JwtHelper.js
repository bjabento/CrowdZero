const jwt = require('jsonwebtoken')
var JwtConfig = require('../configs/Jwt');

const JwtHelper = {};

JwtHelper.encode = (object) => {
    return jwt.sign(object, JwtConfig.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
}

JwtHelper.decode = (token) => {
    // jwt.verify(token, JwtConfig.secret, (err, value) => {
    //     if (err) return null;

    //     return value.data;
    // });

    try {
        return jwt.verify(token, JwtConfig.secret);
    } catch(err) {
        return null;
    }
}

module.exports = JwtHelper;