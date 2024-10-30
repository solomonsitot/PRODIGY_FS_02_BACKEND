require("dotenv").config();
const { Chapa } = require("chapa-nodejs");
const Provider = require("../models/providerProfileModel");
const Tourist = require("../models/touristProfileModel");
const cloudinary = require("../utils/cloudinary");

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY,
});

module.exports.providerCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, description, address, acc_name, acc_number, bank } =
      req.body;
    console.log(req.body);
    const { profile_image, bussiness_license, image1, image2, image3 } =
      req.files;
    console.log(image1);
    const profileUpload = await cloudinary.uploader.upload(
      profile_image[0].path
    );
    const profileImage = profileUpload.secure_url;

    const bussinessLicenseUpload = await cloudinary.uploader.upload(
      bussiness_license[0].path
    );
    const bussinessLicense = bussinessLicenseUpload.secure_url;

    const image1Upload = await cloudinary.uploader.upload(image1[0].path);
    const Image1 = image1Upload.secure_url;
    const image2Upload = await cloudinary.uploader.upload(image2[0].path);
    const Image2 = image2Upload.secure_url;
    const image3Upload = await cloudinary.uploader.upload(image3[0].path);
    const Image3 = image3Upload.secure_url;

    if (
      !company_name ||
      !description ||
      !address ||
      !acc_name ||
      !acc_number ||
      !bank
    ) {
      return res.status(400).json({ message: "all fields are required" });
    }
    let bank_code;
    if (bank === "Awash Bank") {
      bank_code = "656";
    } else if (bank === "Bank of Abyssinia") {
      bank_code = "347";
    } else if (bank === "Commercial Bank of Ethiopia (CBE)") {
      bank_code = "946";
    } else if (bank === "Dashen Bank") {
      bank_code = "880";
    } else if (bank === "telebirr") {
      bank_code = "855";
    } else if (bank === "M-Pesa") {
      bank_code = "266";
    }
    const response = await chapa.createSubaccount({
      business_name: company_name,
      account_name: acc_name,
      bank_code: bank_code,
      account_number: acc_number,
      split_type: "flat",
      split_value: 25,
    });
    const user = new Provider({
      _id: id,
      company_name: company_name,
      description: description,
      address: address,
      profile_image: profileImage,
      images: [Image1, Image2, Image3],
      bussiness_license: bussinessLicense,
      payment_info: {
        acc_name: acc_name,
        acc_number: acc_number,
        bank: bank,
        subaccount_id: response.data.subaccount_id,
      },
    });
    await user.save();
    res.json({ message: "user signup successfully", body: user }).status(200);
  } catch (err) {
    console.log("the error: " + err);
  }
};

module.exports.touristCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { passport_id, phone_number } = req.body;
    const profile_image = req.files;
    // Should log file object if uploaded

    const profileUpload = await cloudinary.uploader.upload(req.file.path);
    const profileImage = profileUpload.secure_url;

    if (!passport_id || !phone_number) {
      return res.status(400).json({ message: "all fields are required" });
    }
    const user = new Tourist({
      _id: id,
      passport_id: passport_id,
      phone_number: phone_number,
      profile_image: profileImage,
    });
    await user.save();
    res.json({ message: "user signup successfully", body: user }).status(200);
  } catch (err) {
    console.log("the error: " + err);
  }
};

module.exports.getCredential = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role === "tourist") {
      const user = await Tourist.findById(id).populate("_id");
      // console.log(user);
      return res.json({ body: user }).status(200);
    } else {
      const user = await Provider.findById(id).populate("_id");
      // console.log(user);

      return res.json({ body: user }).status(200);
    }
  } catch (err) {
    console.log("the error: " + err);
  }
};
// module.exports.getProviderCredential = async (req, res) => {
//   try {
//     const { id } = req.user;

//   } catch (err) {
//     console.log("the error: " + err);
//   }
// };


