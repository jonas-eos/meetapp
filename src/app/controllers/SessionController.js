import jwt from 'jsonwebtoken';
import User from '../models/Users';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    /**
     * Check user exists.
     */
    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    /**
     * Validate password
     */
    if ((await user.passwordCorrect(password)) === false) {
      return res.status(401).json({ error: 'Password does not match!' });
    }
    const { id, name } = user;
    /**
     * Session token + informations about user
     */
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
