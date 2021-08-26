var Sequelize = require('sequelize');
var sequelize = require('./db');

var User = require('./UserModel');

var UserEmail = sequelize.define('tbl_user_emails', {
    IdUserEmail: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Email: {
        type: Sequelize.STRING(100),
        unique: true
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
    }
}, {
    timestamps: false,
});

UserEmail.belongsTo(User, {
    as: 'IdUser',
    foreignKey: 'IdUserFK'
})

module.exports = UserEmail