const { default: Chat } = require("../models/Chat");
const { default: User } = require("../models/User");
const { default: Message } = require("../models/Message");
const { pusherServer } = require("../utils/lib/pusher");
const createAndUpdateMessage = async (req, res) => {
  try {
    const { chatId, currentUserId, text, photo } = req.body;

    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
      .populate({
        path: "messages",
        model: Message,
        populate: { path: "sender seenBy", model: "User" },
      })
      .populate({
        path: "members",
        model: "User",
      })
      .exec();

    /* Trigger a Pusher event for a specific chat about the new message */
    await pusherServer.trigger(chatId, "new-message", newMessage);

    /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];
    updatedChat.members.forEach(async (member) => {
      try {
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (error) {
        console.error(`Failed to trigger update-chat event`);
      }
    });
    return res.status(200).json({
      success: newMessage ? true : false,
      newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createAndUpdateMessage,
};
