const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error("Bu Resim Tipi Desteklenmemektedir. Lütfen Farklı Bir Resim Seçiniz!"), false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const rootDir = path.dirname(require.main.filename);
        fs.mkdirSync(path.join(rootDir, "/public/uploads/originals"), { recursive: true }); // Orijinal dosyalar için ayrı bir klasör
        cb(null, path.join(rootDir, "/public/uploads/originals"));
    },
    filename: function (req, file, cb) {
        const extension = file.mimetype.split("/")[1];
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const url = `image_${uniqueSuffix}.${extension}`;

        if (!req.savedImages) req.savedImages = [];
        req.savedImages.push(url);

        cb(null, url);
    }
});

const upload = multer({ storage, fileFilter }).array("images", 20); // 20 resim yükleme sınırı

const resizeImages = async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next(); // Eğer dosya yüklenmediyse bir sonraki middleware'e geç

    const rootDir = path.dirname(require.main.filename);
    const resizedDir = path.join(rootDir, "/public/uploads/resized");

    fs.mkdirSync(resizedDir, { recursive: true }); // Yeniden boyutlandırılmış dosyalar için klasör oluştur

    try {
        const resizePromises = req.files.map(async (file) => {
            const outputFilePath = path.join(resizedDir, file.filename);

            await sharp(file.path)
                .resize(640, 1280, {
                    fit: sharp.fit.cover,
                    withoutEnlargement: true,
                })
                .toFile(outputFilePath);

            return outputFilePath; // Yeniden boyutlandırılan dosya yolunu döndür
        });

        const resizedPaths = await Promise.all(resizePromises);

        // Yüklenen dosyaların yollarını kaydedin
        req.savedImages = resizedPaths.map((filePath) => filePath.replace(rootDir, ""));

        next();
    } catch (error) {
        console.error("Resim yeniden boyutlandırma hatası:", error);
        res.status(500).json({ error: "Resim yeniden boyutlandırma hatası" });
    }
};

module.exports = { upload, resizeImages };
