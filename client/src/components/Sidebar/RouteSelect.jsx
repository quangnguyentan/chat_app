import React, { useState } from "react";
import {
  FiDollarSign,
  FiHome,
  FiLink,
  FiPaperclip,
  FiUsers,
} from "react-icons/fi";

export const RouteSelect = () => {
  const [select, setSelect] = useState(1); // Đặt mặc định là 1

  const handleSelect = (option) => {
    if (option > select) {
      setSelect(option); // Cập nhật chọn mới nếu lớn hơn tùy chọn hiện tại
    } else {
      setSelect(option); // Cập nhật tùy chọn ngay cả khi nhỏ hơn (bỏ tùy chọn trước đó)
    }
  };

  return (
    <div className="space-y-1">
      <Route
        Icon={FiHome}
        selected={select === 1}
        title="Trang chủ"
        onClick={() => {
          handleSelect(1);
          localStorage.setItem("index", 1);
        }}
      />
      <Route
        Icon={FiUsers}
        selected={select === 2}
        title="Quản lí nhân viên"
        onClick={() => {
          handleSelect(2);
          localStorage.setItem("index", 2);
        }}
      />
      <Route
        Icon={FiPaperclip}
        selected={select === 3}
        title="Quản lí người dùng"
        onClick={() => {
          handleSelect(3);
          localStorage.setItem("index", 3);
        }}
      />
      <Route
        Icon={FiLink}
        selected={select === 4}
        title="Quản lí nhóm"
        onClick={() => {
          handleSelect(4);
          localStorage.setItem("index", 4);
        }}
      />
      {/* <Route
        Icon={FiDollarSign}
        selected={select === 5}
        title="Finance"
        onClick={() => {
          handleSelect(5);
          localStorage.setItem("index", 5);
        }}
      /> */}
    </div>
  );
};

const Route = ({ selected, Icon, title, onClick }) => {
  return (
    <button
      // className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
      //   selected
      //     ? "bg-white text-stone-950 shadow"
      //     : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
      // }`}
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] `}
      onClick={onClick} // Gọi hàm khi nút được nhấn
    >
      <Icon className={"text-violet-500"} />
      <span>{title}</span>
    </button>
  );
};
