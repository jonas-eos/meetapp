/**
 * @overview database index
 * This file handles all database connections and communication with models.
 *
 * @require sequelize
 *
 * @require config/database
 * @require app/models/ *
 */
import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/Users';

// Models reference.
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.forEach(model => model.init(this.connection));
  }
}

export default new Database();
