const {
  getAllUsers,
  getCurrent,
  getContact,
  getUserById,
  searchGroupById,
  updateUserById,
  updateUserByInfo,
  searchChatId,
  deleteUserById,
} = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const router = require("express").Router();
router.get("/", [verifyToken], getAllUsers);
router.get("/get-current", verifyToken, getCurrent);
router.get("/:userId", verifyToken, getUserById);
router.delete("/delete/:userId", verifyToken, deleteUserById);

router.get("/searchContact/:query", verifyToken, getContact);
router.get("/:userId/searchChat/:query", verifyToken, searchGroupById);
router.put("/:userId/update", verifyToken, updateUserById);
router.put("/:userId/updateByinfo", verifyToken, updateUserByInfo);

module.exports = router;
