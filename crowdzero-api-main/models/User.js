const Sequelize = require('sequelize');
const db = require('../configs/Database');

const User = db.define('user', {
    idu: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cargo:{
        type: Sequelize.INTEGER
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    idade:{
        type: Sequelize.INTEGER,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    pass:{
        type: Sequelize.STRING
    },
    contacto:{
        type: Sequelize.INTEGER
    },
    cc:{
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
    },
    idgoogle:{
        type: Sequelize.INTEGER
    },
},{timestamps: false})

module.exports = User;