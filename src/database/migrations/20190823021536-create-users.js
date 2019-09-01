/**
 * @overview create table: user
 *
 * @description
 * This file create user table with fields:
 * ID: { Integer, autoIncrement, PK }
 * name: { String }
 * email: { string, unique }
 * password_hash: { String }
 * provider: { Boolean, defaul value = false }
 * created_at: { date }
 * updated_at: { date }
 *
 * @require Sequelize
 */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
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
    return queryInterface.dropTable('users');
  },
};
