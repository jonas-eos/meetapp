/**
 * @overview File Controller
 * This is the file controller with a simple task to save a file reference to
 * database.
 *
 * @requires app/models
 *
 * @requires app/validatons/FileValidations
 *
 */
import File from '../models/Files';

import FileValidations from '../validations/FileValidations';

class FileController {
  async store(req, res) {
    // Validate req file exists on request
    await FileValidations.validateStore(req.file);
    if (FileValidations.getError()) {
      return FileValidations.sendError(res);
    }

    const { originalname: filename, filename: path } = req.file;

    const url = `${process.env.APP_URL}/files/${path}`;

    const file = await File.create({
      path,
      filename,
      url,
    });

    return res.json(file);
  }
}

export default new FileController();
