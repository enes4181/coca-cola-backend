const user = require("../users/model");
const bcrypt = require("bcrypt");
const Response = require("../../utils/response");
const APIError = require("../../utils/errors");
const {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
} = require("../../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendMail");
const moment = require("moment");

const login = async (req, res) => {
  const { email, password } = req.body;

  const userInfo = await user.findOne({ email });

  if (!userInfo) throw new APIError("Email yada Şifre Hatalıdır !", 401);

  const comparePassword = await bcrypt.compare(password, userInfo.password);

  if (!comparePassword) throw new APIError("Email yada Şifre Hatalıdır !", 401);

  createToken(userInfo, res);
};

const register = async (req, res) => {
  const { email, name, lastname, password } = req.body;

  const userCheck = await user.findOne({ email });

  if (userCheck) {
    throw new APIError("Girmiş Olduğunuz Email Kullanımda !", 401);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = crypto.randomBytes(3).toString("hex");

  // Kullanıcı bilgilerini ve doğrulama kodunu geçici olarak saklayın
  const tempUser = {
    email,
    name,
    lastname,
    password: hashedPassword,
    verificationCode,
    verificationTime: moment(new Date())
      .add(15, "minute")
      .format("YYYY-MM-DD HH:mm:ss"),
  };

//  Doğrulama kodunu e-posta ile gönderin
  await sendEmail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Kayıt Doğrulama",
    text: `Kayıt Doğrulama Kodunuz ${verificationCode}`,
  });

  // Geçici kullanıcı bilgilerini yanıt olarak gönderin
  return new Response(
    tempUser,
    "Kayıt Başarıyla Eklendi, Lütfen Emailinizi Doğrulayın"
  ).created(res);
};

const verifyEmail = async (req, res) => {
  const { email, verificationCode, tempUser } = req.body;

  // Geçici kullanıcı bilgilerini alın
  const { name, lastname, password, verificationTime } = tempUser;

  const nowTime = moment(new Date());
  const dbTime = moment(verificationTime);

  const timeDiff = dbTime.diff(nowTime, "minutes");

  if (timeDiff <= 0 || tempUser.verificationCode !== verificationCode) {
    throw new APIError("Geçersiz Kod", 401);
  }

  // Kullanıcıyı veritabanına kaydedin
  const userSave = new user({
    email,
    name,
    lastname,
    password,
    verification: {
      code: null,
      time: null,
      verified: true,
    },
  });

  await userSave
    .save()
    .then(async (data) => {
      try {
        // Kullanıcıyı doğruladıktan sonra token oluşturun
        await createToken(data, res);
      } catch (err) {
        console.error("Token Oluşturulamadı Hatası:", err);
        throw new APIError("Token Oluşturulamadı !", 400);
      }
    })
    .catch((err) => {
      console.error("Kullanıcı Kayıt Edilemedi Hatası:", err);
      throw new APIError("Kullanıcı Kayıt Edilemedi !", 400);
    });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const userInfo = await user
    .findOne({ email })
    .select(" name lastname email ");

  if (!userInfo) throw new APIError("Geçersiz Kullanıcı", 400);

  const resetCode = crypto.randomBytes(3).toString("hex");


  await sendEmail({
    from: process.env.EMAIL_USER,
    to: userInfo.email,
    subject: "Şifre Sıfırlama",
    text: `Şifre Sıfırlama Kodunuz ${resetCode}`,
  });

  await user.updateOne(
    { email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date())
          .add(15, "minute")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
    }
  );

  return new Response(true, "Lütfen Mail Kutunuzu Kontrol Ediniz").success(res);
};

const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;

  const userInfo = await user
    .findOne({ email })
    .select("_id name lastname email reset");

  if (!userInfo) throw new APIError("Geçersiz Kod !", 401);

  const dbTime = moment(userInfo.reset.time);
  const nowTime = moment(new Date());

  const timeDiff = dbTime.diff(nowTime, "minutes");


  if (timeDiff <= 0 || userInfo.reset.code !== code) {
    throw new APIError("Geçersiz Kod", 401);
  }

  const temporaryToken = await createTemporaryToken(
    userInfo._id,
    userInfo.email
  );

  return new Response(
    { temporaryToken },
    "Şifre Sıfırlama Yapabilirsiniz"
  ).success(res);
};

const resetPassword = async (req, res) => {
  const { password, temporaryToken } = req.body;

  const decodedToken = await decodedTemporaryToken(temporaryToken);

  const hashPassword = await bcrypt.hash(password, 10);

  await user.findByIdAndUpdate(
    { _id: decodedToken._id },
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashPassword,
    }
  );

  return new Response(decodedToken, "Şifre Sıfırlama Başarılı").success(res);
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
  verifyEmail,
};
