const APIError = require("../utils/errors");
const { tokenCheck } = require("./auth");

const authorize = (roles = []) => {
    // roles parametresi tek bir rol veya bir dizi rol olabilir
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // Token kontrol middleware'i
        tokenCheck,

        // Yetkilendirme kontrol middleware'i
        (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                throw new APIError("Erişim Yetkiniz Yok", 403);
            }
            next();
        }
    ];
};

module.exports = authorize;