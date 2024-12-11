const Brand = require("./model");
const APIError = require("../../../utils/errors");
const Response = require("../../../utils/response");

// Marka Ekleme
const addBrand = async (req, res) => {
    const { name } = req.body;

    const newBrand = new Brand({ name });

    await newBrand.save()
        .then(data => new Response(data, "Marka Başarıyla Eklendi").created(res))
        .catch(err => {
            console.error("Marka Eklenemedi Hatası:", err);
            throw new APIError("Marka Eklenemedi", 400);
        });
};

// Marka Güncelleme
const updateBrand = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    await Brand.findByIdAndUpdate(id, { name }, { new: true })
        .then(data => new Response(data, "Marka Başarıyla Güncellendi").success(res))
        .catch(err => {
            console.error("Marka Güncellenemedi Hatası:", err);
            throw new APIError("Marka Güncellenemedi", 400);
        });
};

// Marka Silme
const deleteBrand = async (req, res) => {
    const { id } = req.params;

    await Brand.findByIdAndDelete(id)
        .then(() => new Response(null, "Marka Başarıyla Silindi").success(res))
        .catch(err => {
            console.error("Marka Silinemedi Hatası:", err);
            throw new APIError("Marka Silinemedi", 400);
        });
};

// Tüm Markaları Getirme
const getAllBrands = async (req, res) => {
    await Brand.find()
        .then(data => new Response(data, "Markalar Başarıyla Getirildi").success(res))
        .catch(err => {
            console.error("Markalar Getirilemedi Hatası:", err);
            throw new APIError("Markalar Getirilemedi", 400);
        });
};

// Tek Bir Markayı Getirme
const getBrandById = async (req, res) => {
    const { id } = req.params;

    await Brand.findById(id)
        .then(data => {
            if (!data) throw new APIError("Marka Bulunamadı", 404);
            new Response(data, "Marka Başarıyla Getirildi").success(res);
        })
        .catch(err => {
            console.error("Marka Getirilemedi Hatası:", err);
            throw new APIError("Marka Getirilemedi", 400);
        });
};

module.exports = {
    addBrand,
    updateBrand,
    deleteBrand,
    getAllBrands,
    getBrandById
};