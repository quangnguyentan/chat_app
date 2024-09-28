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

router.post("/create", [verifyToken], createChat);
router.put("/:chatId", [verifyToken], updateChatById);
router.put("/updateRoom/:chatId", [verifyToken], updateRoomGroup);
router.delete("/delete/:chatId", [verifyToken], deleteGroupChat);
router.get("/:chatId", [verifyToken], getChatById);
router.put("/:chatId/update", [verifyToken], updateGroupChat);
router.get("/", [verifyToken], getChatAll);

module.exports = router;
