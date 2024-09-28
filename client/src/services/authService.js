import axiosConfig from "../axios";
export const apiRegister = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "POST",
        url: "/auth/register",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiLoginSuccess = (data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "POST",
        url: "/auth/login",
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apichangePassword = (userId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: "/auth/changePassword/" + userId,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
