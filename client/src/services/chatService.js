import axiosConfig from "../axios";

export const apiGetChats = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/chats/",
      });
      resolve(response);
    } catch (error) {
      console.log("Failed to get product", error);
    }
  });
export const apiCreateChat = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "POST",
        url: "/chats/create",
        data,
      });
      resolve(response);
    } catch (error) {
      console.log("Failed to get product", error);
    }
  });
export const apiGetChatById = (chatId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/chats/" + chatId,
      });
      resolve(response);
    } catch (error) {
      console.log("Failed to delete product", error);
    }
  });
export const apiUpdateChat = (chatId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: "/chats/" + chatId,
        data,
      });
      resolve(response);
    } catch (error) {
      console.log("Failed to get product", error);
    }
  });
export const apiUpdateChatGroup = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: "/chats/updateRoom/:chatId",
        data,
      });
      resolve(response);
    } catch (error) {
      console.log("Failed to get product", error);
    }
  });

export const apiChangeGroupChat = (chatId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: `/chat/${chatId}/change`,
      });
      resolve(response);
    } catch (error) {
      console.log("Failed to get product", error);
    }
  });
// export const apiCreateCollection = (data) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await axiosConfig({
//         method: "POST",
//         url: "/collections/create",
//         data,
//       });
//       resolve(response);
//     } catch (error) {
//       console.log("Failed to get product", error);
//     }
//   });
// export const apiUpdateCollection = (id, userId, data) =>
//   new Promise(async (resolve, reject) => {
//     try {
//       const response = await axiosConfig({
//         method: "PUT",
//         url: `/collections/update/${id}/${userId}`,
//         data,
//       });
//       resolve(response);
//     } catch (error) {
//       console.log("Failed to get product", error);
//     }
//   });
