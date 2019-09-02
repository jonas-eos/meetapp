/**
 * @overview User controller
 * This file controls all user-related business rules.
 *
 * @requires yup
 *
 * @requires /app/models
 * @requires /app/validations/UserValidations
 */
import User from '../models/Users';

import UserValidations from '../validations/UserValidations';

class UserController {
  // POST :: /users
  async store(req, res) {
    // Validate fields
    await UserValidations.validateStore(req);

    if (UserValidations.getError()) {
      return UserValidations.sendError(res);
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
    // Validate fields
    await UserValidations.validateUpdate(req);

    if (UserValidations.getError()) {
      return UserValidations.sendError(res);
    }

    const { email, oldPassword } = req.body;
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
    if ((await user.passwordCorrect(oldPassword)) === false) {
      return res.status(401).json({ error: 'Password does not match' });
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
