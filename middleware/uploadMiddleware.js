const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const IMAGE_MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const imageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },

  filename: (req, file, callback) => {
    const name = file.originalname.replace(/[\s.]+/g, '_');
    const extension = IMAGE_MIME_TYPES[file.mimetype];
    callback(null, `${name}_${Date.now()}.${extension}`);
  }
});

const imageUploadMiddleware = multer({ storage: imageStorage }).single('image');

module.exports = imageUploadMiddleware;

module.exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const outputFilePath = path.join('images', `resized_${fileName}`);

  try {
    await sharp(filePath)
      .resize({ width: 206, height: 260 })
      .toFile(outputFilePath);

    await fs.unlink(filePath);

    req.file.path = outputFilePath;
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};
