import File from '../models/Files';

class FileController {
  async store(req, res) {
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
