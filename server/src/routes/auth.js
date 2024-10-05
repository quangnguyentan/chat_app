const {
  register,
  getAllUsers,
  login,
  changePassword,
} = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const { checkExpiredToken } = require("../middlewares/jwt");

const router = require("express").Router();
router.get("/", [verifyToken], getAllUsers);
router.post("/login", login);
router.post("/register", register);
router.put("/changePassword/:userId", [verifyToken], changePassword);

module.exports = router;
