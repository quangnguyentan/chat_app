const { createAndUpdateMessage } = require("../controllers/messageController");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const router = require("express").Router();
router.post("/", [verifyToken], createAndUpdateMessage);

module.exports = router;
