var Sequelize = require('sequelize');
var sequelize = require('./db');

var Group = sequelize.define('tbl_groups', {
    IdGroup: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Email: {
        type: Sequelize.STRING(100),
        unique: true
    },
    Password: Sequelize.STRING(60),
    Name: Sequelize.STRING(100),
    Location: Sequelize.GEOMETRY('POINT'),
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
    }
}, {
    timestamps: false,
});

module.exports = Group