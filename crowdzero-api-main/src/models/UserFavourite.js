var Sequelize = require('sequelize');
var sequelize = require('./db');

var User = require('./UserModel');

var UserFavourite = sequelize.define('tbl_user_favourites', {
    IdUserFavourite: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Location: Sequelize.GEOMETRY('POINT'),
    CreatedIn: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, {
    timestamps: false,
});

UserFavourite.belongsTo(User, {
    as: 'User',
    foreignKey: 'UserFK'
})

module.exports = UserFavourite