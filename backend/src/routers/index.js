const router = require("express").Router();
const multer = require("multer");
const { upload, resizeImage } = require("../middlewares/lib/upload");
const APIError = require("../utils/errors");
const Response = require("../utils/response");

const auth = require("../app/auth/router");
const user = require("../app/users/router");
const product = require("../app/product/product/router");
const brand = require("../app/product/brand/router");
const productType = require("../app/product/product-type/router");

router.use("/auth",auth);
router.use("/user", user);
router.use("/product", product);
router.use("/brand", brand);
router.use("/product-type",productType);

router.post("/upload", upload.single('image'), resizeImage, function (req, res) {
  if (req.file) {
    return new Response(req.file, "Yükleme Başarılı").success(res);
  } else {
    throw new APIError("Resim Yüklenirken Hata Çıktı");
  }
});

module.exports = router;