import { useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import Loader from "./Loader";
import { pusherClient } from "@/lib/pusher";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrent } from "@/stores/actions/userAction";
import { apiGetSearchChats, apiGetUserById } from "@/services/userService";

const ChatList = ({ currentChatId }) => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     dispatch(getCurrent());
  //     setLoading(false);
  //   }, 1000);
  // }, []);
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
    if (currentUser) {
      getChats();
    }
  }, [currentUser, search]);

  useEffect(() => {
    if (currentUser) {
      pusherClient?.subscribe(currentUser._id);

      const handleChatUpdate = (updatedChat) => {
        setChats((allChats) =>
          allChats.map((chat) => {
            if (chat._id === updatedChat.id) {
              return { ...chat, messages: updatedChat.messages };
            } else {
              return chat;
            }
          })
        );
      };

      const handleNewChat = (newChat) => {
        setChats((allChats) => [...allChats, newChat]);
      };

      pusherClient.bind("update-chat", handleChatUpdate);
      pusherClient.bind("new-chat", handleNewChat);

      return () => {
        pusherClient.unsubscribe(currentUser._id);
        pusherClient.unbind("update-chat", handleChatUpdate);
        pusherClient.unbind("new-chat", handleNewChat);
      };
    }
  }, [currentUser]);
  return loading ? (
    <Loader />
  ) : (
    <div className="chat-list">
      {/* <input
        placeholder="Tìm nhóm..."
        className="input-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /> */}

      <div className="chats">
        {chats?.length > 0 ? (
          chats?.map((chat, index) => (
            <ChatBox
              key={chat?._id}
              chat={chat}
              index={index}
              currentUser={currentUser}
              currentChatId={currentChatId}
            />
          ))
        ) : (
          <div className="w-full text-center">
            <h3 className="font-semibold">Bạn chưa chat với bất cứ ai! </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
