/**
 * @overview User controller
 * This file controls all user-related business rules.
 *
 * @require yup
 *
 * @require models
 */
import * as Yup from 'yup';

import User from '../models/Users';

class UserController {
  // POST :: /users
  async store(req, res) {
    // Yup setting to validate some rules
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Check if it is a valid schema.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    // Check if already exist a user on database.
    if (userExist) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  // PUT :: /users
  async update(req, res) {
    // Yup setting to validate some rules
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      // .when('password', (password, field) =>
      //   password ? field.required() : field
      // ),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    // Check if it is a valid schema.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword, password } = req.body;
    const user = await User.findByPk(req.userId);

    // Check if email in the req body is not equal as the user`s current email.
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      // Check if already exist a user.
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
