/**
 * @overview Files models
 * Fields reference to database Files table.
 *
 * @requires Sequelize
 *
 */
import { Model, Sequelize } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        path: Sequelize.STRING,
        filename: Sequelize.STRING,
        url: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
