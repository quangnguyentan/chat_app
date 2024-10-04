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
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    console.log(file);
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = require("express").Router();
router.get("/", [verifyToken], getAllUsers);
router.get("/get-current", verifyToken, getCurrent);
router.get("/:userId", verifyToken, getUserById);
router.delete("/delete/:userId", verifyToken, deleteUserById);

router.get("/searchContact/:query", verifyToken, getContact);
router.get("/:userId/searchChat/:query", verifyToken, searchGroupById);
router.put(
  "/:userId/update",
  verifyToken,
  upload.single("images"),
  updateUserById
);
router.put("/:userId/updateByinfo", verifyToken, updateUserByInfo);

module.exports = router;
