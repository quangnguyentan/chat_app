import LeftSideBar from "@/components/LeftSideBar";
import { Outlet } from "react-router-dom";

const Public = () => {
  return (
    <div className="flex">
      <div className="w-1/3 overflow-y-auto h-screen scroll-smooth ">
        <LeftSideBar />
      </div>
      <div className="w-2/3 overflow-y-auto h-screen scroll-smooth ">
        <Outlet />
      </div>
    </div>
  );
};

export default Public;
