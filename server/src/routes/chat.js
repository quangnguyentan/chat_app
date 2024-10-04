const {
  createChat,
  getChatById,
  updateChatById,
  updateGroupChat,
  updateRoomGroup,
  deleteGroupChat,
  getChatAll,
} = require("../controllers/chatController");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const router = require("express").Router();
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
router.post("/create", [verifyToken], createChat);
router.put("/:chatId", [verifyToken], updateChatById);
router.put("/updateRoom/:chatId", [verifyToken], updateRoomGroup);
router.delete("/delete/:chatId", [verifyToken], deleteGroupChat);
router.get("/:chatId", [verifyToken], getChatById);

router.put(
  "/:chatId/update",
  [verifyToken],
  upload.single("images"),
  updateGroupChat
);
router.get("/", [verifyToken], getChatAll);

module.exports = router;
