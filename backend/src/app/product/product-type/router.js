const router = require("express").Router();
const { addProductType, updateProductType, deleteProductType, getAllProductTypes, getProductTypeById } = require("./controller");
const { tokenCheck } = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");

// Ürün Tipi Ekleme
router.post("/add", tokenCheck, authorize('admin'), addProductType);

// Ürün Tipi Güncelleme
router.put("/update/:id", tokenCheck, authorize('admin'), updateProductType);

// Ürün Tipi Silme
router.delete("/delete/:id", tokenCheck, authorize('admin'), deleteProductType);

// Tüm Ürün Tiplerini Getirme
router.get("/all", getAllProductTypes);

// Tek Bir Ürün Tipini Getirme
router.get("/:id", getProductTypeById);

module.exports = router;