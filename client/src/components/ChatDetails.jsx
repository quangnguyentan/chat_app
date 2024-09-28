import { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import {
  AddPhotoAlternate,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import MessageBox from "./MessageBox";
import { Box, Modal } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  apiCreateChat,
  apiGetChatById,
  apiUpdateChatGroup,
} from "@/services/chatService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiGetAllUser, apiGetSearchContact } from "@/services/userService";
import toast from "react-hot-toast";
import { pusherClient } from "@/lib/pusher";
import { apiSendMessages } from "@/services/messageService";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ChatDetails = ({ chatId }) => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const handleClose = () => setOpen(false);
  const handleCloseSetting = () => setOpenSetting(false);
  const params = useParams();

  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [membersId, setMembersId] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [images, setImages] = useState("");
  const isGroup = selectedContacts.length >= 1;
  const router = useNavigate();
  const handleSelect = (contact) => {
    setMembersId((prev) => [...prev, contact?._id]);
    if (selectedContacts.includes(contact)) {
      setSelectedContacts((prevSelectedContacts) =>
        prevSelectedContacts.filter((item) => item !== contact)
      );
    } else {
      // select users then create a group to chat
      setSelectedContacts((prevSelectedContacts) => [
        ...prevSelectedContacts,
        contact,
      ]);
    }
  };
  const createGroupChat = async () => {
    setLoading(true);
    const res = await apiCreateChat({
      members: selectedContacts.map((contact) => contact._id),
      isGroup,
      chatIdGroup: chat?._id,
    });
    if (res?.success) {
      setSelectedContacts([]);
      setLoading(false);
    }
  };
  const outGroupChat = async () => {
    setLoading(true);
    const res = await apiUpdateChatGroup({
      currentUserId: currentUser?._id,
      chatIdGroup: chatId,
      outGroup: true,
    });
    console.log(res);
    if (res?.success) {
      router(`/`);
      setLoading(false);
    }
  };
  const deleteGroupChat = async () => {
    setLoading(true);
    const res = await apiUpdateChatGroup({
      currentUserId: currentUser?._id,
      chatIdGroup: chatId,
      deleteGroup: true,
    });
    if (res?.success) {
      setLoading(false);
    }
  };
  const joinGroupChat = async () => {
    setLoading(true);
    const res = await apiUpdateChatGroup({
      currentUserId: currentUser?._id,
      chatIdGroup: chatId,
      joinGroup: true,
    });
    if (res?.success) {
      setLoading(false);
      router(`/`);
    }
  };
  const getContacts = async () => {
    try {
      const res =
        search !== ""
          ? await apiGetSearchContact(search)
          : await apiGetAllUser();
      console.log(res);
      if (res?.success) {
        setContacts(
          res?.searchedChat?.filter((contact) => contact._id !== chat?.members)
        );
      }
      // setContacts(
      //   data?.members?.filter((member) => member._id !== currentUser._id)
      // );
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (currentUser) getContacts();
  }, [currentUser, search]);
  console.log(chatId);
  const [text, setText] = useState("");

  const getChatDetails = async (chatId) => {
    try {
      const res = await apiGetChatById(chatId);

      if (res?.success) {
        setChat(res?.searchedChat);
        setOtherMembers(
          res?.searchedChat?.members?.filter(
            (member) => member._id !== currentUser._id
          )
        );
        setMembersId(res?.searchedChat?.members?.map((member) => member._id));
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentUser && chatId) getChatDetails(chatId);
  }, [currentUser, chatId]);
  const handleChange = async (e) => {
    console.log(e.target?.files[0]);
    const file = e.target.files[0];
    setImages(file);
    await sendPhoto();
    // Call sendPhoto right after file selection
  };
  const sendText = async () => {
    try {
      const res = await apiSendMessages({
        chatId,
        currentUserId: currentUser._id,
        text,
      });

      if (res?.success) {
        setText("");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && text.length > 0) {
      sendText();
    }
  };
  const sendPhoto = async () => {
    if (!images) return;
    try {
      const data = new FormData();
      data.append("file", images);
      data.append("upload_preset", "i96i6rvi");
      data.append("cloud_name", "dlwx7hywr");
      console.log(images);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dlwx7hywr/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Gọi hàm apiSendMessages với dữ liệu nhận được
      await apiSendMessages({
        chatId,
        currentUserId: currentUser._id,
        photo: result?.url,
      });

      console.log(result);
    } catch (err) {
      console.error("Error uploading photo:", err);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const handleMessage = async (newMessage) => {
      setChat((prevChat) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        };
      });
    };

    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, [chatId]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages]);
  return loading ? (
    <Loader />
  ) : (
    <div className="chat-details">
      <div className="chat-header">
        {chat?.isGroup ? (
          <>
            <img
              src={chat?.groupPhoto || "/assets/group.png"}
              alt="group-photo"
              className="profilePhoto"
            />

            <div className="flex items-center justify-between w-full">
              <div className="text md:flex max-sm:flex max-sm:text-base-bold">
                <div>{chat?.name} </div>
                <div>&#160; &#183; &#160;</div>
                <div className="flex gap-2">
                  <div> {chat?.members?.length}</div>
                  <div> members</div>
                </div>
              </div>
              {chat?.members?.filter(
                (member) => member?._id === currentUser?._id
              ).length > 0 ? (
                <div className="flex items-center gap-4">
                  {chat?.members &&
                    chat?.members[0]?._id === currentUser?._id && (
                      <div
                        className="flex items-center gap-2"
                        onClick={() => setOpen(true)}
                      >
                        <PersonAddIcon />
                        <button className="max-sm:hidden">
                          Thêm thành viên
                        </button>
                      </div>
                    )}

                  <div
                    className="flex items-center gap-1"
                    onClick={() => setOpenSetting(true)}
                  >
                    <SettingsIcon />
                    <button className="max-sm:hidden">Cài đặt</button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </>
        ) : (
          <>
            <img
              src={otherMembers[0]?.profileImage || "/assets/person.jpg"}
              alt="profile photo"
              className="profilePhoto"
            />
            <div className="text">
              <p>{otherMembers[0]?.username}</p>
            </div>
          </>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {open && (
            <div className="w-full flex flex-col gap-4 h-[340px]">
              <input
                placeholder="Tìm kiếm người liên hệ"
                className="input-search w-full border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar">
                {selectedContacts?.map((selected, index) => (
                  <div
                    key={index}
                    className="contact"
                    // aria-disabled={selectedContacts.length === 0}
                    onClick={(e) => {
                      handleSelect(selected);
                    }}
                  >
                    {selectedContacts.find((item) => item === selected) ? (
                      <CheckCircle sx={{ color: "red" }} />
                    ) : (
                      <RadioButtonUnchecked />
                    )}
                    <img
                      src={selected?.profileImage || "/assets/person.jpg"}
                      alt="profile"
                      className="profilePhoto"
                    />
                    <p className="text-base-bold">{selected?.username}</p>
                  </div>
                ))}
                {search &&
                  contacts
                    ?.filter((contact) => !membersId?.includes(contact?._id))
                    .map((contact, index) => (
                      <>
                        {contact?.username === search && (
                          <div
                            key={index}
                            className="contact"
                            aria-disabled={selectedContacts.length === 0}
                            onClick={(e) => {
                              handleSelect(contact);
                              setSearch("");
                            }} // Use 'contact' instead of 'user'
                          >
                            {selectedContacts.find(
                              (item) => item === contact
                            ) ? (
                              <CheckCircle sx={{ color: "red" }} />
                            ) : (
                              <RadioButtonUnchecked />
                            )}
                            <img
                              src={contact.profileImage || "/assets/person.jpg"}
                              alt="profile"
                              className="profilePhoto"
                            />
                            <p className="text-base-bold">{contact.username}</p>
                          </div>
                        )}
                      </>
                    ))}
              </div>
              <div className="flex items-center w-full justify-end gap-4">
                <button
                  className="text-sm font-semibold"
                  onClick={() => {
                    setOpen(false);
                    setSearch("");
                    setSelectedContacts([]);
                  }}
                >
                  Hủy
                </button>
                <button
                  className="text-sm font-semibold"
                  disabled={selectedContacts.length === 0}
                  onClick={() => {
                    if (selectedContacts.length <= 0) {
                      toast.error("Cần chọn 1 người trở lên");
                    } else {
                      setOpen(false);
                      createGroupChat();
                    }
                  }}
                >
                  Thêm
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
      <Modal
        open={openSetting}
        onClose={handleCloseSetting}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 className="w-full text-center text-heading3-bold">Cài đặt</h3>
          <div className="flex flex-col justify-center gap-4 py-4">
            {chat?.members && chat?.members[0]?._id === currentUser?._id && (
              <Link
                to={`/${chatId}/group-info`}
                className="w-full rounded-lg  px-2 py-4 font-semibold bg-blue-500 text-white"
              >
                <div className="items-center flex gap-2 ">
                  <ModeEditIcon />
                  <button>Chỉnh sửa thông tin</button>
                </div>
              </Link>
            )}

            {chat?.members && chat?.members[0]?._id === currentUser?._id ? (
              <div
                className="w-full rounded-lg items-center flex gap-2 px-2 py-4 font-semibold bg-red-500 text-white"
                onClick={() => {
                  setOpenSetting(false);
                  router(`/`);
                  deleteGroupChat();
                }}
              >
                <DeleteForeverIcon />
                <button>Xóa nhóm</button>
              </div>
            ) : (
              <div
                className="w-full rounded-lg items-center flex gap-2 px-2 py-4 font-semibold bg-red-500 text-white"
                onClick={() => {
                  setOpenSetting(false);
                  router(`/`);
                  outGroupChat();
                }}
              >
                <ExitToAppIcon />
                <button>Rời nhóm</button>
              </div>
            )}
          </div>
        </Box>
      </Modal>
      <div className="chat-body">
        {chat?.messages?.map((message, index) => (
          <MessageBox key={index} message={message} currentUser={currentUser} />
        ))}
        <div ref={bottomRef} />
      </div>

      {chat?.members?.filter((member) => member?._id === currentUser?._id)
        .length > 0 ? (
        <div className="send-message">
          <div className="prepare-message">
            <label className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md p-3 cursor-pointer transition duration-200 ease-in-out">
              <span>Gửi ảnh</span>
              <input onChange={handleChange} type="file" className="hidden" />
            </label>
            <input
              type="text"
              placeholder="Write a message..."
              className="input-field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />
          </div>
          <div
            onClick={() => {
              if (text.length > 0) {
                sendText();
              }
            }}
          >
            <img src="/assets/send.jpg" alt="send" className="send-icon" />
          </div>
        </div>
      ) : (
        <div className="send-message ">
          <div
            className="prepare-message w-full bg-red-500 p-2 rounded-xl "
            onClick={joinGroupChat}
          >
            <button
              type="submit "
              className="w-full text-center text-white font-semibold"
            >
              Tham gia nhóm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDetails;
