import jwt from 'jsonwebtoken';
import User from '../models/Users';
import authConfig from '../../config/auth';

class SessionController {
  async store(__request, __response) {
    const { email, password } = __request.body;
    const user = await User.findOne({ where: { email } });

    /**
     * Check user exists.
     */
    if (!user) {
      return __response.status(401).json({ error: 'User not found!' });
    }

    /**
     * Validate password
     */
    if ((await user.passwordCorrect(password)) === false) {
      return __response.status(401).json({ error: 'Password does not match!' });
    }
    const { id, name } = user;
    /**
     * Session token + informations about user
     */
    return __response.json({
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
