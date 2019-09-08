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

class FileValidation extends Validations {
  // to validate POST :: /files
  async validateStore(data, res) {
    const schema = Yup.object().shape({
      filename: Yup.string().required(),
      path: Yup.string().required(),
    });

    await this.isValid(schema, data, res);
  }
}

export default new FileValidation();
