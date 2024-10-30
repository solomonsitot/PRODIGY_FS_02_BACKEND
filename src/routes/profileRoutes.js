const {
  providerCredential,
  touristCredential,

  getCredential,
} = require("../controller/profileController");
const path = require("path");
const express = require("express");
const auth_mw = require("../middleware/auth_mw");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.post(
  "/provider-credential/:id?",
  // auth_mw,
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "bussiness_license", maxCount: 1 },
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
  ]),
  providerCredential
);

router.post(
  "/tourist-credential/:id?",
  // auth_mw,
  upload.single("profile_image"),
  touristCredential
);

// router.put(
//   "/update-provider-credential",
//   auth_mw,
//   // upload.fields([
//   //   { name: "profile_image", maxCount: 1 },
//   //   { name: "image1", maxCount: 1 },
//   //   { name: "image2", maxCount: 1 },
//   //   { name: "image3", maxCount: 1 },
//   // ]),
//   upload.single("profile_image"),
//   updateProviderCredential
// );




// router.get("/get-tourist-credential/:id?", getTouristCredential);
// router.get("/get-provider-credential/:id?", getProviderCredential);
router.get("/get-credential", auth_mw, getCredential);

module.exports = router;
