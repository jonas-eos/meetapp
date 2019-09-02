/**
 * @overview auth middleware
 * This file authenticates the header token.
 *
 * @requires jsonwebtoken
 * @requires util.promisify
 *
 * @requires /app/config/auth
 */
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

/**
 * @middleware
 *
 * @description
 * Get and validate authHeader from request.
 */
export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if authHeader is empty
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided!' });
  }

  const [, token] = authHeader.split(' ');

  // Verify if the token has a valid key
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token!' });
  }
};
