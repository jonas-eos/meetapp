/**
 * @overview create table: files
 *
 * @description
 * This file create user table with fields:
 * ID: { Integer, autoIncrement, PK }
 * name: { String }
 * path: { string, unique }
 * created_at: { date }
 * updated_at: { date }
 *
 * @requires Sequelize
 */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('files');
  },
};
