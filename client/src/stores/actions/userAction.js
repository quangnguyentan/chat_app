import { apiGetCurrent } from "../../services/userService";
import actionType from "./actionType";

export const getCurrent = () => async (dispatch) => {
  try {
    let response = await apiGetCurrent();
    if (response?.success) {
      dispatch({
        type: actionType.GET_CURRENT,
        currentUser: response?.response,
      });
    } else {
      dispatch({
        type: actionType.GET_CURRENT,
        currentUser: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.GET_CURRENT,
      currentUser: null,
      msg: error,
    });
  }
};
