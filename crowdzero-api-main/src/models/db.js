var Sequelize = require('sequelize');
const DatabaseConfig = require('../configs/Database')

var sequelize;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL,
        {
            host: DatabaseConfig.DB_HOST,
            port: '5432',
            dialect: 'postgres',
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    );
} else {
    sequelize = new Sequelize(
        DatabaseConfig.DB_NAME,
        DatabaseConfig.DB_USER,
        DatabaseConfig.DB_PASSWORD,
        {
            host: DatabaseConfig.DB_HOST,
            port: '5432',
            dialect: 'postgres',
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    );
}

sequelize.sync();

module.exports = sequelize;