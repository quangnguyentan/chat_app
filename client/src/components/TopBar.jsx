import { logout } from "@/stores/actions/authAction";
import { getCurrent } from "@/stores/actions/userAction";
import { Logout } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TopBar = () => {
  const pathname = useLocation();
  const handleLogout = async () => {
    dispatch(logout());
  };
  const { currentUser: user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(getCurrent());
    }, 1000);
  }, []);
  return (
    <div className="topbar z-20">
      <Link to="/">
        <img src="/assets/logo.png" alt="logo" className="logo" />
      </Link>

      <div className="menu ">
        {/* <Link
          href="/chats"
          className={`${
            pathname === "/chats" ? "text-red-1" : ""
          } text-heading4-bold`}
        >
          Messenger
        </Link> */}
        {/* <Link
          href="/contacts"
          className={`${
            pathname === "/contacts" ? "text-red-1" : ""
          } text-heading4-bold`}
        >
          Contacts
        </Link> */}

        <div
          onClick={handleLogout}
          className="flex items-center gap-4 cursor-pointer "
        >
          <h3 className="font-semibold">Đăng xuất</h3>
          <Logout sx={{ color: "#737373" }} />
        </div>

        <Link to="/profile" className="flex items-center gap-4 ">
          <h3 className="font-semibold">Hồ sơ</h3>
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
