const { default: User } = require("../models/User");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json({
      success: user ? true : false,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) throw new Error("Chưa điền email");
    if (!password) throw new Error("Chưa điền mật khẩu");

    const response = await User.findOne({ username });
    const isCorrectPassword =
      response && bcrypt.compareSync(password, response.password);

    const accessToken =
      isCorrectPassword &&
      jwt.sign(
        { id: response?._id, role: response?.role },
        process.env.SECRET_KEY,
        { expiresIn: "2d" }
      );

    return res.status(200).json({
      success: accessToken
        ? 0
        : isCorrectPassword
        ? `Đăng nhập thành công! Chào mừng bạn quay trở lại ${response?.username}`
        : "Tên đăng nhập hoặc mật khẩu không đúng! Vui lòng kiểm tra lại.",
      accessToken: accessToken || null,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const register = async (req, res) => {
  try {
    let hashCode = randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    const { username, password, code, role } = req.body;
    if (!username || !password)
      throw new Error("Bạn chưa điền tên đăng nhập hoặc mật khẩu", {
        status: 400,
      });

    const existingUserName = await User.findOne({ username });

    if (existingUserName) {
      throw new Error("Tên đăng nhập đã tồn tại", {
        status: 400,
      });
    }

    const newUser = await User.create({
      username,
      fullName: username,
      password: hashPassword(password),
      code: role && hashCode,
      role: role ? "employee" : "user",
      codeAddFriends: code && code,
    });

    newUser.save();
    return res.status(200).json({
      success: newUser ? true : false,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, rePassword } = req.body;
    if (!password) throw new Error("Bạn chưa nhập mật khẩu cũ");
    if (!newPassword) throw new Error("Bạn chưa nhập mật khẩu mới");
    if (!rePassword) throw new Error("Bạn chưa nhập lại mật khẩu mới");
    let user = await User.findById(id);
    const isCorrectPassword =
      user && bcrypt.compareSync(password, user.password);

    if (isCorrectPassword) {
      if (newPassword !== oldPassword)
        throw new Error("Mật khẩu mới không trùng khớp");
      await User.findByIdAndUpdate(
        user?._id,
        {
          password: hashPassword(newPassword),
        },
        { new: true }
      );
    } else {
      throw new Error("Mật khẩu cũ không đúng");
    }

    return res.status(200).json({
      success: user ? true : false,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getAllUsers,
  register,
  login,
  changePassword,
};
