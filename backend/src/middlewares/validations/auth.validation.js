const joi = require("joi");
const APIError = require("../../utils/errors");

class authValidation {
    constructor() {}
    static register = async (req, res, next) => {
        try {
            await joi.object({
                name: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "İsim Alanı Normal Metin Olmalıdır",
                    "string.empty": "İsim Alanı Boş Olamaz !",
                    "string.min": "İsim Alanı Ez Az 3 Karakter Olmalıdır",
                    "string.max": "İsim Alanı En Fazla 100 Karakterden Oluşabilir",
                    "string.required": "İsim Alanı Zorunludur"
                }),
                lastname: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "Soyad Alanı Normal Metin Olmalıdır",
                    "string.empty": "Soyad Alanı Boş Olamaz !",
                    "string.min": "Soyad Alanı Ez Az 3 Karakter Olmalıdır",
                    "string.max": "Soyad Alanı En Fazla 100 Karakterden Oluşabilir",
                    "string.required": "Soyad Alanı Zorunludur"
                }),
                email: joi.string().email().trim().min(3).max(100).required().pattern(/^[\w-\.]+@cci\.com\.tr$/).messages({
                    "string.base": "Email Alanı Normal Metin Olmalıdır",
                    "string.empty": "Email Alanı Boş Olamaz !",
                    "string.min": "Email Alanı Ez Az 3 Karakter Olmalıdır",
                    "string.email": "Lütfen Geçerli Bir Email Giriniz",
                    "string.max": "Email Alanı En Fazla 100 Karakterden Oluşabilir",
                    "string.required": "Email Alanı Zorunludur",
                    "string.pattern.base": "Email Alanı @cci.com.tr ile bitmelidir"
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base": "Şifre Alanı Normal Metin Olmalıdır",
                    "string.empty": "Şifre Alanı Boş Olamaz !",
                    "string.min": "Şifre Alanı Ez Az 6 Karakter Olmalıdır",
                    "string.max": "Şifre Alanı En Fazla 36 Karakterden Oluşabilir",
                    "string.required": "Şifre Alanı Zorunludur"
                })
            }).validateAsync(req.body);

            next();
        } catch (error) {
            next(new APIError(error.details[0].message, 400));
        }
    };

    static login = async (req, res, next) => {
        try {
            await joi.object({
                email: joi.string().email().trim().min(3).max(100).required().pattern(/^[\w-\.]+@cci\.com\.tr$/).messages({
                    "string.base": "Email Alanı Normal Metin Olmalıdır",
                    "string.empty": "Email Alanı Boş Olamaz !",
                    "string.min": "Email Alanı Ez Az 3 Karakter Olmalıdır",
                    "string.email": "Lütfen Geçerli Bir Email Giriniz",
                    "string.max": "Email Alanı En Fazla 100 Karakterden Oluşabilir",
                    "string.required": "Email Alanı Zorunludur",
                    "string.pattern.base": "Email Alanı @cci.com.tr ile bitmelidir"
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base": "Şifre Alanı Normal Metin Olmalıdır",
                    "string.empty": "Şifre Alanı Boş Olamaz !",
                    "string.min": "Şifre Alanı Ez Az 6 Karakter Olmalıdır",
                    "string.max": "Şifre Alanı En Fazla 36 Karakterden Oluşabilir",
                    "string.required": "Şifre Alanı Zorunludur"
                })
            }).validateAsync(req.body);

            next();
        } catch (error) {
            next(new APIError(error.details[0].message, 400));
        }
    };

    static forgetPassword = async (req, res, next) => {
        try {
            await joi.object({
                email: joi.string().email().trim().min(3).max(100).required().pattern(/^[\w-\.]+@cci\.com\.tr$/).messages({
                    "string.base": "Email Alanı Normal Metin Olmalıdır",
                    "string.empty": "Email Alanı Boş Olamaz !",
                    "string.min": "Email Alanı Ez Az 3 Karakter Olmalıdır",
                    "string.email": "Lütfen Geçerli Bir Email Giriniz",
                    "string.max": "Email Alanı En Fazla 100 Karakterden Oluşabilir",
                    "string.required": "Email Alanı Zorunludur",
                    "string.pattern.base": "Email Alanı @cci.com.tr ile bitmelidir"
                }),
            }).validateAsync(req.body);

            next();
        } catch (error) {
            next(new APIError(error.details[0].message, 400));
        }
    };
}

module.exports = authValidation;