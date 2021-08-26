var Sequelize = require('sequelize');
var sequelize = require('./db');

var User = require('./UserModel');

var GroupPlaceReportLike = sequelize.define('tbl_groups_places_reports_likes', {
    IdGroupPlaceReportLike: {
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

GroupPlaceReportLike.belongsTo(User, {
    as: 'CreatedBy',
    foreignKey: 'CreatedByFK'
});

module.exports = GroupPlaceReportLike