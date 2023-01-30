'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banks extends Model {
    static associate(models) {}
  }
  Banks.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      bank_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      bank_code: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      bank_logo_url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Banks',
      tableName: 'banks',
      timestamps: true,
      underscored: true,
    }
  );
  return Banks;
};
