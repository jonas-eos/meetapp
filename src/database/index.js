/**
 * @overview database index
 * This file handles all database connections and communication with models.
 *
 * @requires sequelize
 *
 * @requires /config/database
 * @requires /app/models/
 */
import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/Users';
import Files from '../app/models/Files';
import Meetup from '../app/models/Meetup';

// Models reference.
const models = [User, Files, Meetup];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.forEach(model => model.init(this.connection));
    models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
