const mongoose = require("mongoose");

const dbUrl = process.env.DB_URL;

console.log("dbUrl : ", dbUrl);
mongoose.connect(dbUrl)
    .then(() => {
        console.log("Veritabanına Başarıyla Bağlandı");
    })
    .catch((err) => {
        console.log("Veritabanına bağlanırken hata çıktı : ", err);
    });