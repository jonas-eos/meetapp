/**
 * @overview Meetup model
 * This file controls the fields that will have database connection, and rules
 * that are applied before change data in the DB.
 *
 * @requires sequelize
 */
import { Sequelize, Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        organizer_id: Sequelize.INTEGER,
        banner_id: Sequelize.INTEGER,
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        address: Sequelize.STRING,
        date: Sequelize.DATE,
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
   * Link organizer_id with User ID.
   * Link banner_id with File ID.
   *
   * @param {object} models
   *
   * @static
   */
  static associate(models) {
    this.belongsTo(models.User, {
      foreingKey: 'organizer_id',
      as: 'organizer',
    });
    this.belongsTo(models.File, {
      foreignKey: 'banner_id',
      as: 'banner',
    });
  }
}

export default Meetup;
