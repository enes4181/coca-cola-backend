const Product = require("./model");
const APIError = require("../../../utils/errors");
const Response = require("../../../utils/response");
const Brand = require("../brand/model");
const ProductType = require("../product-type/model");

// Ürün Ekleme
const addProduct = async (req, res) => {
  const { name, description, price, productTypeId, brandId } = req.body;

  if (!productTypeId || !brandId) {
    throw new APIError("Ürün Tipi ve Marka Zorunludur", 400);
  }

  const productTypeDoc = await ProductType.findById(productTypeId);
  const brandDoc = await Brand.findById(brandId);

  if (!productTypeDoc || !brandDoc) {
    throw new APIError("Geçersiz Ürün Tipi veya Marka", 400);
  }

  const images = req.savedImages || [];

  const newProduct = new Product({
    name,
    description,
    price,
    images,
    productTypeId,
    productTypeName: productTypeDoc.name,
    brandId,
    brandName: brandDoc.name,
  });

  await newProduct
    .save()
    .then((data) => new Response(data, "Ürün Başarıyla Eklendi").created(res))
    .catch((err) => {
      console.error("Ürün Eklenemedi Hatası:", err);
      throw new APIError("Ürün Eklenemedi", 400);
    });
};

// Ürün Güncelleme
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, productTypeId, brandId, existingImages, deletedImages } = req.body;

  if (!productTypeId || !brandId) {
    throw new APIError("Ürün Tipi ve Marka Zorunludur", 400);
  }

  const productTypeDoc = await ProductType.findById(productTypeId);
  const brandDoc = await Brand.findById(brandId);

  if (!productTypeDoc || !brandDoc) {
    throw new APIError("Geçersiz Ürün Tipi veya Marka", 400);
  }

  const newImages = req.savedImages || [];
  const product = await Product.findById(id);
  if (!product) {
    throw new APIError("Ürün Bulunamadı", 404);
  }

  // Mevcut resimleri koruyun ve yeni resimleri ekleyin
  let images = [...(existingImages || []), ...newImages];

  // Silinecek resimleri çıkarın
  if (deletedImages && deletedImages.length > 0) {
    images = images.filter(image => !deletedImages.includes(image));
  }

  await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price,
      images,
      productType: productTypeId,
      productTypeName: productTypeDoc.name,
      brand: brandId,
      brandName: brandDoc.name,
    },
    { new: true }
  )
    .then((data) =>
      new Response(data, "Ürün Başarıyla Güncellendi").success(res)
    )
    .catch((err) => {
      console.error("Ürün Güncellenemedi Hatası:", err);
      throw new APIError("Ürün Güncellenemedi", 400);
    });
};
// Ürün Silme
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  await Product.findByIdAndDelete(id)
    .then(() => new Response(null, "Ürün Başarıyla Silindi").success(res))
    .catch((err) => {
      console.error("Ürün Silinemedi Hatası:", err);
      throw new APIError("Ürün Silinemedi", 400);
    });
};

// Tüm Ürünleri Getirme
const getAllProducts = async (req, res) => {
  await Product.find()
    .then((data) =>
      new Response(data, "Ürünler Başarıyla Getirildi").success(res)
    )
    .catch((err) => {
      console.error("Ürünler Getirilemedi Hatası:", err);
      throw new APIError("Ürünler Getirilemedi", 400);
    });
};

// Tek Bir Ürünü Getirme
const getProductById = async (req, res) => {
  const { id } = req.params;

  await Product.findById(id)
    .then((data) => {
      if (!data) throw new APIError("Ürün Bulunamadı", 404);
      new Response(data, "Ürün Başarıyla Getirildi").success(res);
    })
    .catch((err) => {
      console.error("Ürün Getirilemedi Hatası:", err);
      throw new APIError("Ürün Getirilemedi", 400);
    });
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
};
