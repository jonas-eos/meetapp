/**
 * @overview User model
 * This file controls the fields that will have database connection, and rules
 * that are applied before change data in the DB.
 *
 * @requires sequelize
 * @requires bcryptjs
 */
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  // Start sequelize methods.
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Apply encryptation to the password before saving it to the database.
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  /**
   * @method checkPassword
   *
   * @description
   * Check if password match the user password_hash.
   *
   * @param password
   *
   * @return true || false
   */
  passwordCorrect(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
