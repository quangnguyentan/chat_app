import { GroupOutlined, PersonOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CldUploadButton from "@/components/CldUploadButton";
import { apiGetChatById, apiUpdateChatById } from "@/services/chatService";
const GroupInfo = () => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [images, setImages] = useState("");

  const { chatId } = useParams();

  const getChatDetails = async () => {
    try {
      const res = await apiGetChatById(chatId);
      console.log(res);
      setChat(res?.searchedChat);
      setLoading(false);
      reset({
        name: res?.searchedChat?.name,
        groupPhoto: res?.searchedChat?.groupPhoto,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = async (e) => {
    setImages(e.target.files[0]);
    // Call sendPhoto right after file selection
  };
  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const router = useNavigate();

  const updateGroupChat = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("images", images);
      formData.append("name", data?.name);
      const res = await apiUpdateChatById(chatId, formData);
      console.log(res);
      if (res.success) {
        setImages("");
        reset();
        router(`/${chatId}`);
        toast.success("Sửa nhóm thành công");
        setLoading(false);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      {chat?.members?.filter((member) => member?._id === currentUser?._id)
        ?.length > 0 ? (
        <div className="profile-page">
          <h1 className="text-heading3-bold">Chỉnh sửa thông tin nhóm</h1>

          <form
            className="edit-profile"
            onSubmit={handleSubmit(updateGroupChat)}
          >
            <div className="input">
              <input
                {...register("name", {
                  required: "Tên nhóm là bắt buộc",
                })}
                type="text"
                placeholder="Tên nhóm"
                className="input-field"
              />
              <GroupOutlined sx={{ color: "#737373" }} />
            </div>
            {error?.name && (
              <p className="text-red-500">{error.name.message}</p>
            )}

            <div className="flex items-center justify-between">
              <img
                src={watch("groupPhoto") || "/assets/group.png"}
                alt="profile"
                className="w-40 h-40 rounded-full"
              />
              <label className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md p-3 cursor-pointer transition duration-200 ease-in-out">
                <span>
                  {images?.name?.length > 0
                    ? `Đã chọn ảnh ${images?.name}`
                    : "Chọn ảnh"}
                </span>

                <input
                  type="file"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              {chat?.members?.map((member, index) => (
                <p className="selected-contact" key={index}>
                  {member.username}
                </p>
              ))}
            </div>

            <button className="btn" type="submit">
              Save Changes
            </button>
          </form>
        </div>
      ) : (
        router.push("/chats")
      )}
    </>
  );
};

export default GroupInfo;
