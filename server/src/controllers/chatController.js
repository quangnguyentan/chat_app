const { default: Chat } = require("../models/Chat");
const { default: User } = require("../models/User");
const { default: Message } = require("../models/Message");

const { pusherServer } = require("../utils/lib/pusher");
const createChat = async (req, res) => {
  try {
    const {
      currentUserId,
      members,
      isGroup,
      name,
      groupPhoto,
      chatIdGroup,
      outGroup,
    } = req.body;
    console.log("abc");

    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 1 } };
    let chat = await Chat.findOne(query);

    if (!chat && outGroup) {
      const findUser = await Chat.findById(chatIdGroup);
      // if (findUser) {
      //   const updatedChat = await Chat.findByIdAndUpdate(
      //     chatIdGroup,
      //     { members: updatedMembers },
      //     { new: true }
      //   );
      //   console.log(updatedChat);
      // }
    }
    if (!chat && !currentUserId) {
      console.log("abc");
      const findUser = await Chat.findById(chatIdGroup);
      if (findUser) {
        const updatedChat = await Chat.findByIdAndUpdate(
          chatIdGroup,
          {
            members: [...findUser?.members, ...members],
          },
          { new: true }
        );
      }
    }
    if (!chat && currentUserId) {
      // findUser?.chats?.map(async (chat) => {
      //   // console.log(chat);
      //   const findChat = await Chat.findById(chat?._id);
      //   // console.log(findChat);
      //   // console.log(chat);
      //   // console.log(findChat?._id);
      //   if (chat?.toString() === findChat._id?.toString()) {
      //     console.log(chat);
      //   }
      //   // if (members?.includes(findChat?._id.toString())) {
      //   //   console.log(chat);
      //   // }
      // });

      chat = await new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );
      chat?.save();

      const updateAllMembers = chat?.members?.map(async (memberId) => {
        await User.findByIdAndUpdate(
          memberId,
          {
            $addToSet: { chats: chat._id },
          },
          { new: true }
        );
      });
      Promise.all(updateAllMembers);
      chat.members.map(async (member) => {
        await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      });
    }

    return res.status(200).json({
      success: chat ? true : false,
      chat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateRoomGroup = async (req, res) => {
  try {
    const { currentUserId, chatIdGroup, outGroup, joinGroup, deleteGroup } =
      req.body;
    console.log(deleteGroup);
    let findUser;
    if (outGroup) {
      findUser = await Chat.findById(chatIdGroup);
      if (findUser) {
        const updatedMembers = findUser?.members?.filter(
          (memberId) => memberId?.toString() !== currentUserId?.toString()
        );
        const updateUser = await Chat.findByIdAndUpdate(
          chatIdGroup,
          { members: updatedMembers },
          { new: true }
        );

        if (updateUser && updateUser?.members?.length === 0) {
          await Chat.findByIdAndDelete(chatIdGroup);
        }
      }
    }
    if (joinGroup) {
      findUser = await Chat.findById(chatIdGroup);
      console.log(findUser);
      if (findUser) {
        await Chat.findByIdAndUpdate(
          chatIdGroup,
          {
            members: [...findUser?.members, currentUserId],
          },
          { new: true }
        );
      }
    }
    if (deleteGroup) {
      const deleteAll = await Chat.findByIdAndDelete(chatIdGroup);
    }

    return res.status(200).json({
      success: chat ? true : false,
      findUser,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getChatById = async (req, res) => {
  try {
    console.log("abc");

    const { chatId } = req.params;
    const searchedChat = await Chat.findById(chatId)
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
const updateChatById = async (req, res) => {
  try {
    console.log("abc");

    const { chatId } = req.params;

    const { id } = req.currentUser;

    await Message.updateMany(
      { chat: chatId },
      { $addToSet: { seenBy: id } },
      { new: true }
    )
      .populate({
        path: "sender seenBy",
        model: User,
      })
      .exec();

    return res.status(200).json({
      message: "Seen all messages by current user",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateGroupChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { name, groupPhoto } = req.body;
    console.log("abc");

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    );

    return res.status(200).json({
      success: updatedGroupChat ? true : false,
      updatedGroupChat,
    });
  } catch (err) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteGroupChat = async (req, res) => {
  try {
    console.log("abc");

    const { chatId } = req.params;

    const { name, groupPhoto } = req.body;

    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      { name, groupPhoto },
      { new: true }
    );

    return res.status(200).json({
      success: updatedGroupChat ? true : false,
      updatedGroupChat,
    });
  } catch (err) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  updateChatById,
  updateGroupChat,
  getChatById,
  createChat,
  updateRoomGroup,
  deleteGroupChat,
};
