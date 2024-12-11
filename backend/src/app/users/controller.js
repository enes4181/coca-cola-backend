const user = require("./model");
const APIError = require("../../utils/errors");
const Response = require("../../utils/response");

const me = async (req, res) => {
  return new Response(req.user).success(res);
};

// Kullanıcıları listeleme rotası (sadece adminler erişebilir)
const getUsers = async (req, res) => {
  try {
    const users = await user.find().select("_id name lastname email role");
    return new Response(users, "Kullanıcılar Listelendi").success(res);
  } catch (err) {
    console.error("Kullanıcılar Listelenemedi Hatası:", err);
    throw new APIError("Kullanıcılar Listelenemedi", 500);
  }
};

// // Tek bir kullanıcıyı getirme rotası (sadece adminler erişebilir)

const getUserSingle = async (req, res) => {
  const { id } = req.params;

  try {
    const singleUser = await user
      .findById(id)
      .select("_id name lastname email role");
    if (!singleUser) {
      throw new APIError("Kullanıcı Bulunamadı", 404);
    }
    return new Response(singleUser, "Kullanıcı Bilgileri Getirildi").success(
      res
    );
  } catch (err) {
    console.error("Kullanıcı Bilgileri Getirilemedi Hatası:", err);
    throw new APIError("Kullanıcı Bilgileri Getirilemedi", 500);
  }
};

// Kullanıcı rolünü güncelleme rotası (sadece adminler erişebilir)

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    throw new APIError("Geçersiz Rol", 400);
  }

  try {
    const updatedUser = await user.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      throw new APIError("Kullanıcı Bulunamadı", 404);
    }
    return new Response(updatedUser, "Kullanıcı Rolü Güncellendi").success(res);
  } catch (err) {
    console.error("Kullanıcı Rolü Güncellenemedi Hatası:", err);
    throw new APIError("Kullanıcı Rolü Güncellenemedi", 500);
  }
};

module.exports = {
  me,
  getUsers,
  getUserSingle,
  updateUserRole,
};
