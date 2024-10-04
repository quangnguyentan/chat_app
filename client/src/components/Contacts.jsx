import { useEffect, useState } from "react";
import Loader from "./Loader";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import toast from "react-hot-toast";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { X } from "lucide-react";
import { apiCreateChat, apiGetChatById } from "@/services/chatService";
import {
  apiGetAllUser,
  apiGetSearchChats,
  apiGetSearchContact,
  apiGetUserById,
} from "@/services/userService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrent } from "@/stores/actions/userAction";
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

const Contacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      dispatch(getCurrent());
      setLoading(false);
    }, 1000);
  }, []);
  const getContacts = async () => {
    try {
      const res =
        search !== ""
          ? await apiGetSearchContact(search)
          : await apiGetAllUser();
      if (res?.success)
        setContacts(
          res?.searchedChat?.filter(
            (contact) => contact._id !== currentUser._id
          )
        );
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  const getChats = async () => {
    try {
      const res =
        search !== ""
          ? await apiGetSearchChats(currentUser?._id, search)
          : await apiGetUserById(currentUser?._id);
      if (res?.success) {
        setChats(res?.searchedChat);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentUser) getContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentUser, search]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentUser) {
        getChats();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentUser, search]);

  /* SELECT CONTACT */
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [addGroup, setAddGroup] = useState(false);
  const isGroup = selectedContacts.length >= 1;
  const handleSelect = (contact) => {
    //select a user to chat
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

  const [name, setName] = useState("");

  const router = useNavigate();

  const handleContactClick = async (contact) => {
    // Cập nhật danh sách các liên hệ đã chọn
    const updatedContacts = selectedContacts.includes(contact)
      ? selectedContacts.filter((item) => item !== contact)
      : [...selectedContacts, contact];

    setSelectedContacts(updatedContacts);

    if (updatedContacts.length === 0) {
      console.log("No contacts selected.");
      return;
    }
    try {
      setLoading(true);
      const res = await apiCreateChat({
        currentUserId: currentUser?._id,
        members: updatedContacts?.map((contact) => contact?._id),
        isGroup: false,
        name,
      });
      console.log(res);
      if (res?.success) {
        router(`/${res?.chat?._id}`);
        setLoading(false);
      } else {
        console.error("Failed to create chat:", res);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const createGroupChat = async () => {
    const res = await apiCreateChat({
      currentUserId: currentUser?._id,
      members: selectedContacts?.map((contact) => contact._id),
      isGroup: isGroup,
      name,
    });
    if (res?.success) {
      setAddGroup(false);
      setOpen(false);
      setName("");
      setSelectedContacts([]);
      router(`/${res?.chat?._id}`);
    }
  };
  const array = [];
  chats?.map((el) =>
    el?.members?.map(
      (chat) =>
        !el?.isGroup && chat?._id !== currentUser._id && array.push(chat)
    )
  );
  console.log(selectedContacts);
  return loading ? (
    <Loader />
  ) : (
    <div className="create-chat-container">
      <div className="">
        <div className="">
          <div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {open && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <p className="text-body-bold text-center">
                        Tên nhóm chat
                      </p>
                      <input
                        placeholder="Nhập tên nhóm..."
                        className="input-group-name border-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center w-full justify-end gap-4">
                      <button
                        className="text-sm font-semibold"
                        onClick={() => setOpen(false)}
                      >
                        Hủy
                      </button>
                      <button
                        className="text-sm font-semibold"
                        onClick={() => {
                          if (name.length > 0) {
                            setAddGroup(true);
                          } else {
                            toast.error("Bạn chưa nhập tên nhóm chat");
                          }
                        }}
                      >
                        Tiếp tục
                      </button>
                    </div>
                  </div>
                )}
              </Box>
            </Modal>
            <Modal
              open={addGroup}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {addGroup && (
                  <div className="w-full flex flex-col gap-4 h-[340px]">
                    <input
                      autoFocus
                      autoComplete="off"
                      placeholder="Tìm kiếm người liên hệ"
                      className="input-search w-full border"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="flex flex-col flex-1 gap-5 overflow-y-scroll custom-scrollbar">
                      {selectedContacts?.map((selected, index) => (
                        <>
                          {array?.map((arr) => (
                            <>
                              {arr?._id !== selected?._id && (
                                <div
                                  key={index}
                                  className="contact"
                                  // aria-disabled={selectedContacts.length === 0}
                                  onClick={(e) => handleSelect(selected)}
                                >
                                  {selectedContacts.find(
                                    (item) => item === selected
                                  ) ? (
                                    <CheckCircle sx={{ color: "red" }} />
                                  ) : (
                                    <RadioButtonUnchecked />
                                  )}
                                  <img
                                    src={
                                      selected?.profileImage ||
                                      "/assets/person.jpg"
                                    }
                                    alt="profile"
                                    className="profilePhoto"
                                  />
                                  <p className="text-base-bold">
                                    {selected?.username}
                                  </p>
                                </div>
                              )}
                            </>
                          ))}
                        </>
                      ))}
                      {search &&
                        contacts.map((user, index) => (
                          <>
                            {user?.username === search && (
                              <div
                                key={index}
                                className="contact"
                                aria-disabled={selectedContacts.length === 0}
                                onClick={(e) => {
                                  handleSelect(user);
                                  setSearch("");
                                }}
                              >
                                {selectedContacts?.length > 0 ? (
                                  <div>
                                    {selectedContacts?.find(
                                      (select) => select?._id == user?._id
                                    ) ? (
                                      ""
                                    ) : (
                                      <div className="contact">
                                        {selectedContacts.find(
                                          (item) => item === user
                                        ) ? (
                                          <CheckCircle sx={{ color: "red" }} />
                                        ) : (
                                          <RadioButtonUnchecked />
                                        )}
                                        <img
                                          src={
                                            user?.profileImage ||
                                            "/assets/person.jpg"
                                          }
                                          alt="profile"
                                          className="profilePhoto"
                                        />
                                        <p className="text-base-bold">
                                          {user?.username}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex gap-2 items-center">
                                    {selectedContacts.find(
                                      (item) => item === user
                                    ) ? (
                                      <CheckCircle sx={{ color: "red" }} />
                                    ) : (
                                      <RadioButtonUnchecked />
                                    )}
                                    <img
                                      src={
                                        user?.profileImage ||
                                        "/assets/person.jpg"
                                      }
                                      alt="profile"
                                      className="profilePhoto"
                                    />
                                    <p className="text-base-bold">
                                      {user?.username}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        ))}
                      {/* {chats?.length > 0 &&
                        chats?.map((chat, index) => (
                          <>
                            {!chat?.isGroup && (
                              <div
                                className="flex items-center px-4 hover:bg-gray-100"
                                key={index}
                                aria-disabled={selectedContacts.length === 0}
                                onClick={(e) => {
                                  handleSelect(chat);
                                  setSearch("");
                                }}
                              >
                                {selectedContacts.find(
                                  (item) => item === chat
                                ) ? (
                                  <CheckCircle sx={{ color: "red" }} />
                                ) : (
                                  <RadioButtonUnchecked />
                                )}
                                <ChatBox
                                  chat={chat}
                                  index={index}
                                  currentUser={currentUser}
                                  hidden
                                />
                              </div>
                            )}
                          </>
                        ))} */}
                      {chats?.members?.map((user) => (
                        <div
                          className="flex gap-2 items-center"
                          key={user?._id}
                        >
                          {selectedContacts.find((item) => item === user) ? (
                            <CheckCircle sx={{ color: "red" }} />
                          ) : (
                            <RadioButtonUnchecked />
                          )}
                          <img
                            src={user?.profileImage || "/assets/person.jpg"}
                            alt="profile"
                            className="profilePhoto"
                          />
                          <p className="text-base-bold">{user?.username}</p>
                        </div>
                      ))}
                      {array?.map((user, index) => (
                        <>
                          {selectedContacts.length > 0 ? (
                            selectedContacts?.find(
                              (sel) => sel?._id !== user?._id
                            ) ? (
                              <div
                                key={index}
                                className="contact"
                                // aria-disabled={selectedContacts.length === 0}
                                onClick={(e) => handleSelect(user)}
                              >
                                <div className="flex gap-2 items-center">
                                  {selectedContacts?.find(
                                    (item) => item === user
                                  ) ? (
                                    <CheckCircle sx={{ color: "red" }} />
                                  ) : (
                                    <RadioButtonUnchecked />
                                  )}
                                  <img
                                    src={
                                      user?.profileImage || "/assets/person.jpg"
                                    }
                                    alt="profile"
                                    className="profilePhoto"
                                  />
                                  <p className="text-base-bold">
                                    {user?.username}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={index}
                                className="contact"
                                // aria-disabled={selectedContacts.length === 0}
                                onClick={(e) => handleSelect(user)}
                              >
                                <div className="flex gap-2 items-center">
                                  {selectedContacts.find(
                                    (item) => item === user
                                  ) ? (
                                    <CheckCircle sx={{ color: "red" }} />
                                  ) : (
                                    <RadioButtonUnchecked />
                                  )}

                                  <img
                                    src={
                                      user?.profileImage || "/assets/person.jpg"
                                    }
                                    alt="profile"
                                    className="profilePhoto"
                                  />
                                  <p className="text-base-bold">
                                    {user?.username}
                                  </p>
                                </div>
                              </div>
                            )
                          ) : (
                            <div
                              key={index}
                              className="contact"
                              // aria-disabled={selectedContacts.length === 0}
                              onClick={(e) => handleSelect(user)}
                            >
                              <div className="flex gap-2 items-center">
                                {selectedContacts.find(
                                  (item) => item === user
                                ) ? (
                                  <CheckCircle sx={{ color: "red" }} />
                                ) : (
                                  <RadioButtonUnchecked />
                                )}
                                <img
                                  src={
                                    user?.profileImage || "/assets/person.jpg"
                                  }
                                  alt="profile"
                                  className="profilePhoto"
                                />
                                <p className="text-base-bold">
                                  {user?.username}
                                </p>
                              </div>
                            </div>
                          )}
                          {/* <div
                            key={index}
                            className="contact"
                            // aria-disabled={selectedContacts.length === 0}
                            onClick={(e) => handleSelect(user)}
                          >
                            <div className="flex gap-2 items-center">
                              {selectedContacts.find(
                                (item) => item === user
                              ) ? (
                                <CheckCircle sx={{ color: "red" }} />
                              ) : (
                                <RadioButtonUnchecked />
                              )}
                              <img
                                src={user?.profileImage || "/assets/person.jpg"}
                                alt="profile"
                                className="profilePhoto"
                              />
                              <p className="text-base-bold">{user?.username}</p>
                            </div>
                          </div> */}
                        </>
                      ))}
                    </div>
                    <div className="flex items-center w-full justify-end gap-4">
                      <button
                        className="text-sm font-semibold"
                        onClick={() => {
                          setSearch("");
                          setAddGroup(false);
                          setName("");
                          setSelectedContacts([]);
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        className="text-sm font-semibold"
                        disabled={selectedContacts.length === 0}
                        onClick={() => {
                          if (selectedContacts.length < 1) {
                            toast.error("Cần chọn ít nhất 1 người");
                          } else {
                            setSearch("");
                            createGroupChat();
                          }
                        }}
                      >
                        Tạo
                      </button>
                    </div>
                  </div>
                )}
              </Box>
            </Modal>
          </div>
        </div>
        {addGroup ? (
          ""
        ) : (
          <div className="contact-list">
            <div className="flex items-center justify-end">
              {/* <p className="text-body-bold w-1/2">Người liên hệ</p> */}
              <div className="sm:w-1/2 md:hidden px-2">
                <button
                  className="flex gap-2 w-full items-center "
                  onClick={handleOpen}
                >
                  <GroupIcon />
                  <p className="font-semibold text-heading2-bold">Tạo nhóm</p>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1/4 max-sm:flex-none max-sm:hidden ">
                <div
                  className="flex gap-2 w-full items-center bg-gray-200 xl:py-2 lg:py-0 justify-center rounded-lg cursor-pointer"
                  onClick={handleOpen}
                >
                  <GroupIcon />
                  <p className="text-small-medium font-semibold">Tạo nhóm</p>
                </div>
              </div>
              <div className="lg:w-3/4 max-sm:w-full max-sm:px-2">
                <input
                  placeholder="Tìm người liên hệ..."
                  className="input-search w-full border"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col  flex-1 gap-5 overflow-y-scroll custom-scrollbar relative">
              {search.length > 0 ? (
                ""
              ) : (
                <div>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography sx={{ fontWeight: 700 }}>
                        Danh sách bạn bè
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {contacts ? (
                          contacts?.map((user, index) => (
                            <div
                              key={index}
                              className={`contact`}
                              aria-disabled={selectedContacts?.length === 0}
                              onClick={(e) => handleContactClick(user)}
                            >
                              {currentUser?.role === "user" &&
                                user?.code === currentUser?.codeAddFriends && (
                                  <div className="flex gap-4 items-center">
                                    <img
                                      src={
                                        user?.profileImage ||
                                        "/assets/person.jpg"
                                      }
                                      alt="profile"
                                      className="profilePhoto"
                                    />
                                    <p className="text-base-bold">
                                      {user?.username}
                                    </p>
                                  </div>
                                )}
                              {currentUser?.role === "employee" &&
                                user?.codeAddFriends === currentUser?.code && (
                                  <div className="flex gap-4 items-center">
                                    <img
                                      src={
                                        user?.profileImage ||
                                        "/assets/person.jpg"
                                      }
                                      alt="profile"
                                      className="profilePhoto"
                                    />
                                    <p className="text-base-bold">
                                      {user?.username}
                                    </p>
                                  </div>
                                )}
                            </div>
                          ))
                        ) : (
                          <h3 className="font-semibold">
                            Chưa có bất kì bạn bè nào!
                          </h3>
                        )}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      <Typography sx={{ fontWeight: 700 }}>
                        Danh sách chat
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <ChatList />
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}

              <div
                className={`${
                  search
                    ? "absolute w-full p-2 top-0  rounded-md flex flex-col gap-4"
                    : ""
                }`}
              >
                {search &&
                  chats &&
                  chats.length > 0 &&
                  chats?.map((chat, index) => (
                    <div key={chat?._id}>
                      {chat?.name === search && (
                        <ChatBox
                          hidden
                          chat={chat}
                          index={index}
                          currentUser={currentUser}
                          currentChatId={chats?._id}
                        />
                      )}
                    </div>
                  ))}

                {search &&
                  contacts &&
                  contacts?.length > 0 &&
                  contacts?.map((user, index) => (
                    <div
                      key={index}
                      className={`contact ${
                        user?.username === search
                          ? "bg-blue-2 rounded-xl px-2 py-2"
                          : ""
                      }  `}
                      aria-disabled={selectedContacts.length === 0}
                      onClick={() => handleContactClick(user)}
                    >
                      {user?.username === search && (
                        <>
                          <img
                            src={user?.profileImage || "/assets/person.jpg"}
                            alt="profile"
                            className="profilePhoto"
                          />
                          <p className="text-base-bold">{user?.username}</p>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
