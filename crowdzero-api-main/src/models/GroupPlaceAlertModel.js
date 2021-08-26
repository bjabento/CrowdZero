var Sequelize = require('sequelize');
var sequelize = require('./db');

var Group = require('./GroupModel');

var GroupPlaceAlert = sequelize.define('tbl_groups_places_alerts', {
    IdGroupPlaceAlert: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    FirstReportDateTime: {
        type: Sequelize.DATE
    },
    AvgLevel: {
        type: Sequelize.DOUBLE
    },
    Level: Sequelize.INTEGER,
    IsFixed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    FixedIn: {
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

GroupPlaceAlert.belongsTo(Group, {
    as: 'Group',
    foreignKey: 'GroupFK'
})

module.exports = GroupPlaceAlert