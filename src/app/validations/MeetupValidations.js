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

class MeetupValidation extends Validations {
  // to validate POST :: /meetups
  async validateStore(req, res) {
    const schema = Yup.object().shape({
      banner: Yup.number().required(),
      title: Yup.string().required(),
      description: Yup.string().required(),
      address: Yup.string().required(),
      date: Yup.date().required(),
    });

    await this.isValid(schema, req.body, res);
  }
}

export default new MeetupValidation();
