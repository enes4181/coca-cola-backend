const router = require("express").Router();
const multer = require("multer");
const upload = require("../middlewares/lib/upload");
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

router.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError)
      throw new APIError(
        "Resim Yüklenirken Multer Kaynaklı Hata Çıktı : ",
        err
      );
    else if (err) throw new APIError("Resim Yüklenirken Hata Çıktı : ", err);
    else return new Response(req.savedImages, "Yükleme Başarılı").success(res);
  });
});

module.exports = router;