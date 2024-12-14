const router = require("express").Router();
const { addProduct, updateProduct, deleteProduct, getAllProducts, getProductById } = require("./controller");
const { tokenCheck } = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");
const { upload, resizeImage } = require("../middlewares/lib/upload");

// Ürün Ekleme
router.post("/add",upload.single('image'), resizeImage, tokenCheck, authorize('admin'), addProduct);

// Ürün Güncelleme
router.put("/update/:id",upload.single('image'), resizeImage, tokenCheck, authorize('admin'), updateProduct);

// Ürün Silme
router.delete("/delete/:id", tokenCheck, authorize('admin'), deleteProduct);

// Tüm Ürünleri Getirme
router.get("/all", getAllProducts);

// Tek Bir Ürünü Getirme
router.get("/:id", getProductById);

module.exports = router;