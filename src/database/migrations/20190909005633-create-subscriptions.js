/**
 * @overview create table: subscriptions
 *
 * @description
 * This file create user table with fields:
 * ID: { Integer, autoIncrement, PK }
 * meetup_id: { Integer, Relation with meetups:id }
 * user_id: { Integer, Relation with users:id }
 * created_at: { date }
 * updated_at: { date }
 *
 * @requires Sequelize
 */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      meetup_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'meetups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('subscriptions');
  },
};
