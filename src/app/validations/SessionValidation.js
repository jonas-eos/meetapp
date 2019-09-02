/**
 * @overview session validations
 * This file validate all required fields before start a bew session.
 *
 * @requires yup
 *
 * @requires ./index
 */
import * as Yup from 'yup';
import Validations from './index';

class SessionValidation extends Validations {
  // to validate POST :: /sessions
  async validateStore(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string()
        .required()
        .min(6),
    });

    await this.isValid(schema, req.body, res);
  }
}

export default new SessionValidation();
