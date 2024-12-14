const router = require("express").Router();
const { addProduct, updateProduct, deleteProduct, getAllProducts, getProductById } = require("./controller");
const { tokenCheck } = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");
const { resizeImages, upload } = require("../../../middlewares/lib/upload");

// Ürün Ekleme
router.post("/add",upload, resizeImages, tokenCheck, authorize('admin'), addProduct);

// Ürün Güncelleme
router.put("/update/:id",upload, resizeImages, tokenCheck, authorize('admin'), updateProduct);

// Ürün Silme
router.delete("/delete/:id", tokenCheck, authorize('admin'), deleteProduct);

// Tüm Ürünleri Getirme
router.get("/all", getAllProducts);

// Tek Bir Ürünü Getirme
router.get("/:id", getProductById);

module.exports = router;