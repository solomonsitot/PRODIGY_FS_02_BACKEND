const path = require("path");
const express = require("express");
const {
  signup,
  Login,
  userInfo,
  logout,
  getLoginStatus,
  searchShop,
  getSingleShop,
  getMyActivity,
} = require("../controller/userController");
const auth_mw = require("../middleware/auth_mw");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", Login);
router.get("/logout", logout);
router.get("/get-user-status", getLoginStatus);
router.get("/get-single-shop/:id?", getSingleShop);
router.get("/get-user-info", auth_mw, userInfo);
router.get("/search-shop/:key?", auth_mw, searchShop);
router.get("/get-my-activity", auth_mw, getMyActivity);

// router.put("/verify-user/:id",  verifyUser);
// router.put("/ban-user/:id",  banUser);

module.exports = router;
