/**
 * @overview user validations
 * This file validate all required fields before save in the database.
 *
 * @requires yup
 *
 * @requires ./index
 */
import * as Yup from 'yup';
import Validations from './index';

class UserValidation extends Validations {
  // to validate POST :: /users
  async validateStore(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    await this.isValid(schema, req.body, res);
  }

  // to validate PUT :: /users
  async validateUpdate(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      changePassword: Yup.boolean(),
      oldPassword: Yup.string()
        .min(6)
        .required(),
      password: Yup.string()
        .min(6)
        .when('changePassword', (changePassword, field) =>
          changePassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when(
        'changePassword',
        (changePassword, field) =>
          changePassword ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    await this.isValid(schema, req.body, res);
  }
}

export default new UserValidation();
