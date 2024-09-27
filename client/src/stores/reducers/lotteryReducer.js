import actionType from "../actions/actionType";

const initState = {
  userData: {},
};

const lotteryReducer = (state = initState, action) => {
  switch (action.type) {
    case actionType.GET_LOTTERY:
      return {
        ...state,
        currentData: action.currentData || {},
      };
    default:
      return state;
  }
};
export default lotteryReducer;
