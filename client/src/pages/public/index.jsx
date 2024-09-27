import BottomBar from "@/components/BottomBar";
import TopBar from "@/components/TopBar";
import { Outlet } from "react-router-dom";

const Public = () => {
  return (
    <div>
      <TopBar />
      <Outlet />
      <BottomBar />
    </div>
  );
};

export default Public;
