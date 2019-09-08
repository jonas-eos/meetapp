/**
 * @overview multer config
 * This file contains settings that handdle how uploads works.
 * All file uploaded will be save to /tmp/uploads with a random hex name
 * plus file extension
 *
 * @requires multer
 * @requires crypto
 * @requires path
 */
import multer from 'multer';
import crypto from 'crypto';
import { resolve, extname } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (_req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
