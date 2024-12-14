const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Resmi yeniden boyutlandırma middleware'i
const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const filePath = req.file.path;
  const outputFilePath = path.join(path.dirname(filePath), 'resized-' + path.basename(filePath));

  try {
    await sharp(filePath)
      .resize(640, 1280, {
        fit: sharp.fit.cover,
        withoutEnlargement: true
      })
      .toFile(outputFilePath);

    // Orijinal dosyayı silin ve yeniden boyutlandırılmış dosyayı kullanın
    fs.unlinkSync(filePath);
    req.file.path = outputFilePath;
    req.file.filename = 'resized-' + req.file.filename;

    next();
  } catch (error) {
    console.error('Resim yeniden boyutlandırma hatası:', error);
    res.status(500).json({ error: 'Resim yeniden boyutlandırma hatası' });
  }
};

module.exports = {
  upload,
  resizeImage
};