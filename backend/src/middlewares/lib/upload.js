const multer = require("multer");
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
        fs.mkdirSync(path.join(rootDir, "/public/uploads"), { recursive: true });
        cb(null, path.join(rootDir, "/public/uploads"));
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

module.exports = upload;