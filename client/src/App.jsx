import { Route, Routes, useNavigate } from "react-router-dom";
import path from "./lib/path";
import "./index.css";

import NotFound from "./pages/404";
import Public from "./pages/public";

import { useDispatch, useSelector } from "react-redux";
import { getCurrent } from "./stores/actions/userAction";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Chats from "./pages/Chat";
import ChatPage from "./pages/Chat/_id";
import Profile from "./pages/Profile";
import GroupInfo from "./pages/ChatGroup";
import Home from "./pages/Dashboard";

function App() {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn && token) {
      setLoading(true);
      setTimeout(() => {
        dispatch(getCurrent());
        setLoading(false);
      }, 1000);
      if (
        location.pathname === "/" &&
        currentUser &&
        currentUser?.role === "admin"
      ) {
        navigate("/dashboard");
      }
      if (
        location.pathname === "/" &&
        currentUser &&
        currentUser?.role === "user"
      ) {
        navigate("/chats");
      }
      if (
        location.pathname === "/" &&
        currentUser &&
        currentUser?.role === "employee"
      ) {
        navigate("/chats");
      }
    } else {
      navigate("/sign-in");
    }
  }, [isLoggedIn, token]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Routes>
            {currentUser && currentUser?.role === "admin" ? (
              <Route element={<Public />} path={path.PUBLIC}>
                <Route element={<Home />} path={path.DASHBOARD} />
              </Route>
            ) : (
              <Route element={<Public />} path={path.PUBLIC}>
                <Route element={<Chats />} path={path.CHAT} />
                <Route element={<ChatPage />} path={path.CHAT_DETAILS} />
                <Route element={<Profile />} path={path.PROFILE} />
                <Route element={<GroupInfo />} path={path.GROUP_CHAT} />
              </Route>
            )}
            <Route element={<Login />} path={path.LOGIN} />
            <Route element={<Register />} path={path.RESIGER} />
            <Route element={<NotFound />} path="*" />
          </Routes>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              // Define default options
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },

              // Default options for specific types
              success: {
                duration: 5000,
                theme: {
                  primary: "green",
                  secondary: "black",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
