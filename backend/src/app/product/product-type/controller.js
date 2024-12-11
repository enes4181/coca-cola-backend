const ProductType = require("./model");
const APIError = require("../../../utils/errors");
const Response = require("../../../utils/response");
const Brand = require("../brand/model");

// Ürün Tipi Ekleme
const addProductType = async (req, res) => {
  const { name } = req.body;

  const newProductType = new ProductType({
    name,
  });

  await newProductType
    .save()
    .then((data) =>
      new Response(data, "Ürün Tipi Başarıyla Eklendi").created(res)
    )
    .catch((err) => {
      console.error("Ürün Tipi Eklenemedi Hatası:", err);
      throw new APIError("Ürün Tipi Eklenemedi", 400);
    });
};

// Ürün Tipi Güncelleme
const updateProductType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  await ProductType.findByIdAndUpdate(
    id,
    {
      name,
    },
    { new: true }
  )
    .then((data) =>
      new Response(data, "Ürün Tipi Başarıyla Güncellendi").success(res)
    )
    .catch((err) => {
      console.error("Ürün Tipi Güncellenemedi Hatası:", err);
      throw new APIError("Ürün Tipi Güncellenemedi", 400);
    });
};

// Ürün Tipi Silme
const deleteProductType = async (req, res) => {
  const { id } = req.params;

  await ProductType.findByIdAndDelete(id)
    .then(() => new Response(null, "Ürün Tipi Başarıyla Silindi").success(res))
    .catch((err) => {
      console.error("Ürün Tipi Silinemedi Hatası:", err);
      throw new APIError("Ürün Tipi Silinemedi", 400);
    });
};

// Tüm Ürün Tiplerini Getirme
const getAllProductTypes = async (req, res) => {
  await ProductType.find()
    .then((data) =>
      new Response(data, "Ürün Tipleri Başarıyla Getirildi").success(res)
    )
    .catch((err) => {
      console.error("Ürün Tipleri Getirilemedi Hatası:", err);
      throw new APIError("Ürün Tipleri Getirilemedi", 400);
    });
};

// Tek Bir Ürün Tipini Getirme
const getProductTypeById = async (req, res) => {
  const { id } = req.params;

  await ProductType.findById(id)
    .then((data) => {
      if (!data) throw new APIError("Ürün Tipi Bulunamadı", 404);
      new Response(data, "Ürün Tipi Başarıyla Getirildi").success(res);
    })
    .catch((err) => {
      console.error("Ürün Tipi Getirilemedi Hatası:", err);
      throw new APIError("Ürün Tipi Getirilemedi", 400);
    });
};

module.exports = {
  addProductType,
  updateProductType,
  deleteProductType,
  getAllProductTypes,
  getProductTypeById,
};
