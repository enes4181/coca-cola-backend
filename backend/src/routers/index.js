const router = require("express").Router();
const {upload, resizeImages} = require("../middlewares/lib/upload");

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

router.post("/upload", upload, resizeImages, (req, res) => {
    res.status(200).json({
      message: "Resimler başarıyla yüklendi ve yeniden boyutlandırıldı!",
      resizedImages: req.savedImages, // Yeniden boyutlandırılmış dosyaların yolları
    });
  });

module.exports = router;