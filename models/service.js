'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Services extends Model {
    static associate(models) {
      // define association here
    }
  }
  Services.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(20),
      },
      content: {
        type: DataTypes.STRING(4000),
      },
    },
    {
      sequelize,
      modelName: 'Services',
      tableName: 'services',
      timestamps: true,
      underscored: true,
    }
  );
  return Services;
};
