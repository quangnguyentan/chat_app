const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const verifyToken = asyncHandler(async (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1];
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err)
        res.status(200).json({
          err: 2,
          msg: "Token không hợp lệ",
        });

      req.currentUser = decode;
      next();
    });
  } else {
    res.status(200).json({
      err: 2,
      msg: "Bạn chưa đăng nhập",
    });
  }
});

const isAdmin = (req, res, next) => {
  const { role } = req.currentUser;
  if (role !== "admin")
    return res.status(401).json({
      success: false,
      mes: "Requested admin role",
    });
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
};
