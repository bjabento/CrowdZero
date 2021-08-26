var Sequelize = require('sequelize');
var sequelize = require('./db');

var User = require('./UserModel');

var ReportLike = sequelize.define('tbl_reports_likes', {
    IdReportLike: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    IsLike: Sequelize.BOOLEAN,
    CreatedIn: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, {
    timestamps: false,
});

ReportLike.belongsTo(User, {
    as: 'CreatedBy',
    foreignKey: 'CreatedByFK'
});

module.exports = ReportLike