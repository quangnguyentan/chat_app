const { createAndUpdateMessage } = require("../controllers/messageController");
const { verifyToken, isAdmin } = require("../middlewares/verifyToken");
const router = require("express").Router();
const multer = require("multer");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, "./public/images");
//   },
//   filename: function (req, file, cb) {
//     console.log(file.originalname);
//     return cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });
// const upload = multer({ storage });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/",
  [verifyToken],
  upload.single("images"),
  createAndUpdateMessage
);

module.exports = router;
