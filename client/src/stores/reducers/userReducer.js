import actionType from "../actions/actionType";

const initState = {
  userData: {},
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case actionType.GET_CURRENT:
      return {
        ...state,
        currentUser: action.currentUser || {},
      };
    default:
      return state;
  }
};
export default userReducer;
