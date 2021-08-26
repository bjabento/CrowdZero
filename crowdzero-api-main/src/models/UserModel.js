var Sequelize = require('sequelize');
var sequelize = require('./db');

var User = sequelize.define('tbl_users', {
    IdUser: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Name: Sequelize.STRING(100),
    Email: {
        type: Sequelize.STRING(100),
        unique: true
    },
    Password: Sequelize.STRING(60),
    Avatar: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    Active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    ActivatedIn: {
        type: Sequelize.DATE,
        allowNull: true
    },
    CreatedIn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    Points: Sequelize.VIRTUAL
}, {
    timestamps: false,
});

module.exports = User