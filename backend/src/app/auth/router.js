const router = require("express").Router();
const {
    login,
    register,
    forgetPassword,
    resetCodeCheck,
    resetPassword,
    verifyEmail
} = require("./controller");
const authValidation = require("../../middlewares/validations/auth.validation");

router.post("/login", authValidation.login, login);
router.post("/register", authValidation.register, register);
router.post("/forget-password", authValidation.forgetPassword, forgetPassword);
router.post("/reset-code-check", resetCodeCheck);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);

module.exports = router;