const initialState = {
  currentTime: new Date().getTime(), // Thời gian hiện tại khi khởi tạo
  endTime: new Date("2024-12-31T23:59:59").getTime(), // Ví dụ: Thời gian kết thúc đếm ngược
};

const countdownReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_CURRENT_TIME":
      return {
        ...state,
        currentTime: action.payload,
      };
    case "UPDATE_END_TIME":
      return {
        ...state,
        endTime: action.payload,
      };
    default:
      return state;
  }
};

export default countdownReducer;
