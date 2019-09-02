/**
 * @overview Session controller
 * This file manupulate authentication and access token.
 *
 * @requires jsonwebtoken
 * @requires yup
 *
 * @requires /app/config/auth
 * @requires /app/models/Users
 * @requires /app/validations/UserValidations
 */
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/Users';

import SessionValidation from '../validations/SessionValidation';

class SessionController {
  async store(req, res) {
    // Validate fields.
    await SessionValidation.validateStore(req);

    if (SessionValidation.getError()) {
      return SessionValidation.sendError(res);
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
