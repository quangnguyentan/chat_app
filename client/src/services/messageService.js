import axiosConfig from "../axios";
export const apiSendMessages = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "POST",
        url: "/messages/",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
