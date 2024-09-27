const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: Chat } = require("../models/Chat");
const { default: Message } = require("../models/Message");
const { default: User } = require("../models/User");
require("dotenv").config();
const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));
const getCurrent = async (req, res) => {
  try {
    const { id } = req.currentUser;

    if (!id) {
      res.status(400).json({
        err: 1,
        msg: "missing input",
      });
    }
    const response = await User.findById(id);
    return res.status(200).json({
      success: response ? true : false,
      response,
    });
  } catch (error) {
    res.status(500).json({
      err: -1,
      msg: "Failed at auth controller" + error,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const searchedChat = await User.find();
    return res.status(200).json({
      success: searchedChat ? true : false,
      searchedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const searchedChat = await Chat.find({ members: userId })
      .sort({ lastMessageAt: -1 })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();

    return res.status(200).json({
      success: searchedChat ? true : false,
      searchedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getContact = async (req, res) => {
  try {
    const { query } = req.params;

    const searchedChat = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json({
      success: searchedChat ? true : false,
      searchedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const searchChatId = async (req, res) => {
  try {
    const { userId, query } = req.params;
    const searchedChat = await Chat.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();
    return res.status(200).json({
      success: searchedChat ? true : false,
      searchedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const { username, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        profileImage,
      },
      { new: true }
    );

    return res.status(200).json({
      success: updatedUser ? true : false,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const searchGroupById = async (req, res) => {
  try {
    // const currentUserId = params.userId
    // const query = params.query

    const { userId } = req.params;
    const { query } = req.params;
    const searchedChat = await Chat.find({
      members: userId,
      name: { $regex: query, $options: "i" },
    })
      .populate({
        path: "members",
        model: User,
      })
      .populate({
        path: "messages",
        model: Message,
        populate: {
          path: "sender seenBy",
          model: User,
        },
      })
      .exec();
    return res.status(200).json({
      success: searchedChat ? true : false,
      searchedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getCurrent,
  getContact,
  searchGroupById,
  updateUserById,
  getUserById,
  searchChatId,
};
