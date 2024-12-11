const router = require("express").Router();
const { tokenCheck } = require("../../middlewares/auth");
const authorize = require("../../middlewares/authorize");
const { getUsers, getUserSingle, updateUserRole, me } = require("./controller");

// Kullanıcı bilgilerini alma rotası
router.get("/me", tokenCheck, me);
router.get("/list",tokenCheck, authorize('admin'), getUsers);
router.get("/:id", tokenCheck, authorize('admin'), getUserSingle);
router.put("/update-role/:id",tokenCheck, authorize('admin'),  updateUserRole);

module.exports = router;