var Sequelize = require('sequelize');
var sequelize = require('./db');

var User = require('./UserModel');
var ReportLike = require('./ReportLikeModel');

var Report = sequelize.define('tbl_reports', {
    IdReport: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Location: Sequelize.GEOMETRY('POINT'),
    Level: Sequelize.INTEGER,
    CreatedIn: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, {
    timestamps: false,
});

Report.belongsTo(User, {
    as: 'User',
    foreignKey: 'CreatedByFK'
});

Report.hasMany(ReportLike, {
    as: 'Likes',
    foreignKey: 'ReportFK',
    allowNull: true
});

module.exports = Report