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
      const findUser = await User?.findById(members[0]);
      const findHasUser = await User?.findById(currentUserId);
      // const filter = await Chat.find();
      // filter?.filter?.((chat) => findUser?.chats?.includes(chat?._id));
      const userRes = [findUser, findHasUser];
      const userIds = userRes.map((user) => user?._id.toString());
      const filterChat = findHasUser?.chats
        ? await Promise.all(
            findHasUser.chats.map(async (chatId) => {
              const findChat = await Chat.findById(chatId.toString());
              if (findChat) {
                const filteredMembers = findChat.members?.filter((member) => {
                  return userIds.includes(member.toString());
                });
                return { chat: findChat, members: filteredMembers }; // Return chat and filtered members
              }
              return null; // Return null if no chat found
            })
          )
        : [];

      console.log("filterChat", filterChat[0]?.chat?.members);
      // console.log(findHasUser);
      // const filterUser = filter?.find((chat) => {
      //   console.log(chat);
      //   return chat?.members?.map((member) => {
      //     return member?.toString() === findHasUser?._id.toString();
      //   });
      // });
      // findHasUser?.chats?.filter((rs) => filterUser?.chats?.includes(rs?._id));
      // findHasUser?.chats?.filter((user) => {
      //   console.log("check", user?.toString());
      //   return user?.toString() === findUser?._id.toString();
      // });
      // const filter = await Chat.find();
      // filter?.map((chat) => chat?.members?.filter((member) => member?.toString() === ))
      // const findUser = await User?.findById(currentUserId);
      // if (findUser) {
      //   const filter = await Chat.find();
      //   const findUsers = filter?.map((el) => {
      //     return el?.members?.filter((el) => {
      //       return el.toString() !== currentUserId;
      //     });
      //   });
      //   const findChat = findUser?.chats?.filter((chat) => {
      //     console.log("chat", findUsers);
      //     return chat?.toString() === findUsers?._id;
      //   });
      //   console.log(findChat);
      //   if (findChat?._id) {
      //     chat = findChat;
      //   }
      //   // else {
      //   //   chat = await new Chat(
      //   //     isGroup ? query : { members: [currentUserId, ...members] }
      //   //   );
      //   //   chat?.save();
      //   //   const updateAllMembers = chat?.members?.map(async (memberId) => {
      //   //     await User.findByIdAndUpdate(
      //   //       memberId,
      //   //       {
      //   //         $addToSet: { chats: chat._id },
      //   //       },
      //   //       { new: true }
      //   //     );
      //   //   });
      //   //   Promise.all(updateAllMembers);
      //   //   chat.members.map(async (member) => {
      //   //     await pusherServer.trigger(member._id.toString(), "new-chat", chat);
      //   //   });
      //   // }
      // }
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

const getChatAll = async (req, res) => {
  try {
    console.log("abc");

    const searchedChat = await Chat.find();

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
    // if (!name || !groupPhoto) throw new Error("Loi");
    const updatedGroupChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        name,
        groupPhoto:
          req?.file?.filename &&
          `http://localhost:8080/images/${req?.file?.filename}`,
      },
      { new: true }
    );
    return res.status(200).json({
      success: updatedGroupChat ? true : false,
      updatedGroupChat,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteGroupChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const updatedGroupChat = await Chat.findByIdAndDelete(chatId);

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
  getChatAll,
};
