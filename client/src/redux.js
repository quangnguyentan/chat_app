import rootReducer from "./stores/reducers/rootReducer";
import { persistStore } from "redux-persist";
import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
const reduxStore = () => {
  const store = createStore(rootReducer, applyMiddleware(thunk)); // còn có thêm tham số applyMiddleware thực hiện việc bất đồng bộ giữa react và redux ( trước khi dispatch action lên reducer thì phải gọi api(tốn thời gian nên phải sử dụng việc bất đồng bộ))
  const persistor = persistStore(store);
  return { store, persistor };
};
export default reduxStore;
