import axiosConfig from "../axios";

export const apiGetAllUser = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/users",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetUserById = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/users/" + userId,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiGetSearchContact = (search) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: `/users/searchContact/${search}`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetSearchChats = (userId, search) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: `/users/${userId}/searchChat/${search}`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiGetCurrent = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "GET",
        url: "/users/get-current",
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });

export const apiUpdatedUser = (userId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: `/users/${userId}/update/`,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiDeleteUser = (userId) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "DELETE",
        url: `/users/delete/${userId}`,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
export const apiUpdatedUserByInfo = (userId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await axiosConfig({
        method: "PUT",
        url: `/users/${userId}/updateByinfo/`,
        data,
      });
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
