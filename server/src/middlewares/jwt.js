const jwt = require("jsonwebtoken");

function checkExpiredToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Token has expired or is invalid" });
    }

    req.user = decoded; // Lưu thông tin user vào req để sử dụng trong middleware hoặc route sau
    next(); // Tiếp tục xử lý yêu cầu
  });
}

module.exports = { checkExpiredToken };
