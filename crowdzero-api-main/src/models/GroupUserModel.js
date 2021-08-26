var Sequelize = require('sequelize');
var sequelize = require('./db');

var User = require('./UserModel');
var Group = require('./GroupModel');

var UserEmail = require('./UserEmailModel');
var GroupDomain = require('./GroupDomainModel');

var GroupUser = sequelize.define('tbl_groups_users', {
    IdGroupUser: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    CreatedIn: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, {
    timestamps: false,
});

GroupUser.belongsTo(Group, {
    as: 'Group',
    foreignKey: 'GroupFK'
})

GroupUser.belongsTo(User, {
    as: 'User',
    foreignKey: 'UserFK'
})

GroupUser.belongsTo(GroupDomain, {
    as: 'GroupDomain',
    foreignKey: 'GroupDomainFK'
})

module.exports = GroupUser