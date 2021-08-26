var Sequelize = require('sequelize');
var sequelize = require('./db');

var Group = require('./GroupModel');

var GroupDomain = sequelize.define('tbl_group_domains', {
    IdGroupDomain: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Domain: {
        type: Sequelize.STRING(100)
    },
    CreatedIn: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, {
    timestamps: false,
});

GroupDomain.belongsTo(Group, {
    as: 'Group',
    foreignKey: 'GroupFK'
})

module.exports = GroupDomain