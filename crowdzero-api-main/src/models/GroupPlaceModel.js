var Sequelize = require('sequelize');
var sequelize = require('./db');

var Group = require('./GroupModel');
var GroupPlaceReport = require('./GroupPlaceReportModel');
var GroupPlaceAlert = require('./GroupPlaceAlertModel');

var GroupPlace = sequelize.define('tbl_groups_places', {
    IdGroupPlace: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Name: Sequelize.STRING(100),
    Color: Sequelize.STRING(7),
    CreatedIn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW 
    }
}, {
    timestamps: false,
});

GroupPlace.belongsTo(Group, {
    as: 'Group',
    foreignKey: 'GroupFK'
})

GroupPlace.hasMany(GroupPlaceReport, {
    as: 'Reports',
    foreignKey: 'GroupPlaceFK',
    allowNull: true
})

GroupPlace.hasMany(GroupPlaceAlert, {
    as: 'Alerts',
    foreignKey: 'GroupPlaceFK',
    allowNull: true
})

GroupPlaceAlert.belongsTo(GroupPlace, {
    as: 'GroupPlace',
    foreignKey: 'GroupPlaceFK'
})

module.exports = GroupPlace;