import { apiGetLotteryById } from "@/services/evaluateService";
import actionType from "./actionType";

export const getLottery = (roomId, userId) => async (dispatch) => {
  try {
    let response = await apiGetLotteryById(roomId, userId);
    if (response?.success) {
      dispatch({
        type: actionType.GET_LOTTERY,
        currentData: response?.evaluates,
      });
    } else {
      dispatch({
        type: actionType.GET_LOTTERY,
        currentData: null,
      });
    }
  } catch (error) {
    dispatch({
      type: actionType.GET_LOTTERY,
      currentData: null,
      msg: error,
    });
  }
};
