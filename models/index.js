'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
    {
      host: config.host,
      dialect: config.dialect,
      //   pool: config.pool,
      timezone: config.timezone,
      //   define: {
      //     underscored: true,
      //     freezeTableName: true, //use singular table name
      //     timestamps: false, // I do not want timestamp fields by default
      //   },
      dialectOptions: {
        options: {
          encrypt: false,
        },
        //     useUTC: false,
        //     charset: 'utf8mb4',
        //     dateStrings: true,
        //     typeCast: function (field, next) {
        //       if (field.type === 'DATETIME') {
        //         return field.string();
        //       }
        //       return next();
        //     },
      },
    }
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
