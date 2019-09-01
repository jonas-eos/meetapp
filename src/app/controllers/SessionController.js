/**
 * @overview Session controller
 * This file manupulate authentication and access token.
 *
 * @require jsonwebtoken
 * @require yup
 *
 * @require app/config/auth
 * @require /models/User
 */
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/Users';

class SessionController {
  async store(req, res) {
    // Set schema field validations
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    // Validate request body.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    //  Check if user exists.
    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    // Validate password
    if ((await user.passwordCorrect(password)) === false) {
      return res.status(401).json({ error: 'Password does not match!' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
