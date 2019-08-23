import * as Yup from 'yup';
import User from '../models/Users';

class UserController {
  async store(__request, __response) {
    /**
     * Setting fields properties
     * name: required
     * email: required, email
     * Passowrd: required, min 6 character
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    /**
     * Validate if all schema is valid.
     */
    if (!(await schema.isValid(__request.body))) {
      return __response.status(400).json({ error: 'Validation fails' });
    }

    const userExist = await User.findOne({
      where: { email: __request.body.email },
    });

    /**
     * Check if the e-mail already exists on database.
     */
    if (userExist) {
      return __response.status(400).json({ error: 'User already exists' });
    }

    /**
     * Create a new user.
     */
    const { id, name, email } = await User.create(__request.body);
    return __response.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
