/**
 * @overview Subscription model
 * This file controls the fields that will have database connection, and rules
 * that are applied before change data in the DB.
 *
 * @requires sequelize
 */
import { Sequelize, Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {
        meetup_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  /**
   * @method associate
   *
   * @description
   * Link meetup_id with meetups ID
   * Link user_id with User ID
   *
   * @param {object} models
   *
   * @static
   */
  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id', as: 'meetup' });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Subscription;
