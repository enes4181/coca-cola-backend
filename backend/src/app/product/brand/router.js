const router = require("express").Router();
const { addBrand, updateBrand, deleteBrand, getAllBrands, getBrandById } = require("./controller");
const { tokenCheck } = require("../../../middlewares/auth");
const authorize = require("../../../middlewares/authorize");

// Marka Ekleme
router.post("/add", tokenCheck, authorize('admin'), addBrand);

// Marka Güncelleme
router.put("/update/:id", tokenCheck, authorize('admin'), updateBrand);

// Marka Silme
router.delete("/delete/:id", tokenCheck, authorize('admin'), deleteBrand);

// Tüm Markaları Getirme
router.get("/all", getAllBrands);

// Tek Bir Markayı Getirme
router.get("/:id", getBrandById);

module.exports = router;