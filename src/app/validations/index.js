import * as Yup from 'yup';

const constants = require('./yupConst');

class Validations {
  constructor() {
    this.error = null;

    this.setLocale();
  }

  async isValid(schema, params) {
    try {
      await schema.validate(params);
    } catch (err) {
      this.setError(err);
    }
  }

  sendError(res) {
    const { message } = this.getError();
    this.setError(null);
    return res.status(401).json({ error: 'Validation failed', message });
  }

  setError(msg) {
    this.error = msg;
  }

  getError() {
    return this.error;
  }

  setLocale() {
    return Yup.setLocale({
      mixed: {
        default: constants.DEFAULT,
        required: constants.REQUIRE,
        oneOf: constants.ONEOF,
      },
      string: {
        length: constants.LENGTH,
        min: constants.STRING_MIN,
        max: constants.STRING_MAX,
        matches: constants.MATCHES,
        email: constants.EMAIL,
        url: constants.URL,
        trim: constants.TRIM,
        lowercase: constants.LOWERCASE,
        uppercase: constants.UPPERCASE,
      },
      number: {
        min: constants.NUMBER_MIN,
        max: constants.NUMBER_MAX,
        lessThan: constants.LESSTHAN,
        moreThan: constants.MORETHAN,
        notEqual: constants.NOTEQUAL,
        positive: constants.POSITIVE,
        negative: constants.NEGATIVE,
        integer: constants.INTEGER,
      },
      date: {
        min: constants.DATE_MIN,
        max: constants.DATE_MAX,
      },
      object: {
        noUnknown: constants.NOUNKNOW,
      },
      array: {
        min: constants.ARRAY_MIN,
        max: constants.ARRAY_MAX,
      },
    });
  }
}

export default Validations;
