var Sequelize = require('sequelize');
var sequelize = require('./db');

var Group = require('./GroupModel');
var User = require('./UserModel');
var GroupPlaceReportLike = require('./GroupPlaceReportLikeModel');

var GroupPlaceReport = sequelize.define('tbl_groups_places_reports', {
    IdGroupPlaceReport: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Level: Sequelize.INTEGER,
    CreatedIn: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, {
    timestamps: false,
});

GroupPlaceReport.belongsTo(Group, {
    as: 'Group',
    foreignKey: 'GroupFK'
})

GroupPlaceReport.belongsTo(User, {
    as: 'User',
    foreignKey: 'UserFK'
})

GroupPlaceReport.hasMany(GroupPlaceReportLike, {
    as: 'Likes',
    foreignKey: 'GroupPlaceReportFK',
    allowNull: true
});

module.exports = GroupPlaceReport