import * as Yup from 'yup';
import User from '../models/Users';

class UserController {
  async store(req, res) {
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
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExist = await User.findOne({
      where: { email: req.body.email },
    });

    /**
     * Check if the e-mail already exists on database.
     */
    if (userExist) {
      return res.status(400).json({ error: 'User already exists' });
    }

    /**
     * Create a new user.
     */
    const { id, name, email } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    /**
     * Setting fields properties
     * Passowrd: required if oldPassowrd exist, min 6 character
     * confirmPassword: required if Password and oldPassword exist
     *    min 6 character.
     */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    /**
     * Validate request body.
     */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword, password } = req.body;
    const user = await User.findByPk(req.userId);

    /**
     * Validate if email exist on body
     * find user email on database
     * return error if user email exist.
     */
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    /**
     * Validade if oldPassword is present and check if it is match with the
     * user account.
     * If password is filled, and oldPassword not, the method will return a error.
     */
    if (oldPassword) {
      if ((await user.passwordCorrect(oldPassword)) === false) {
        return res
          .status(401)
          .json({ error: 'Password does not match', teste: oldPassword });
      }
    } else if (password && !oldPassword) {
      return res.json({ error: 'Old password must be filled!' });
    }

    const { id, name, email: userEmail } = await user.update(req.body);

    return res.json({
      id,
      name,
      email: userEmail,
    });
  }
}

export default new UserController();
