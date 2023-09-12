const sharp = require('sharp');

// Middleware to optimize the image
const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Resize the image (e.g., to a maximum width of 800px)
  sharp(req.file.buffer)
    .resize({ width: 800 })
    // Compress the image (e.g., to 80% quality)
    .jpeg({ quality: 80 })
    .toBuffer()
    .then((optimizedBuffer) => {
      req.file.buffer = optimizedBuffer;
      next();
    })
    .catch((error) => {
      console.error('Image optimization error:', error);
      next();
    });
};

module.exports = optimizeImage;
