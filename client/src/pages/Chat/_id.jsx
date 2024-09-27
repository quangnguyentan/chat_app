import ChatDetails from "@/components/ChatDetails";
import ChatList from "@/components/ChatList";
import Contacts from "@/components/Contacts";
import { apiGetChatById } from "@/services/chatService";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// Hàm lấy đường dẫn tĩnh cho các chat

const ChatPage = () => {
  const { chatId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const seenMessages = async () => {
    try {
      await apiGetChatById({
        currentUserId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) seenMessages();
  }, [currentUser, chatId]);

  return (
    <div className="main-container">
      <div className="w-1/3 max-lg:hidden">
        {/* <ChatList currentChatId={chatId} /> */}
        <Contacts />
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetails chatId={chatId} />
      </div>
    </div>
  );
};

export default ChatPage;
