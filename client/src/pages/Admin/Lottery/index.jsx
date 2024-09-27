import { columns } from "@/components/lottery/LotteryColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { apiGetAllLottery } from "@/services/evaluateService";
import { Plus } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Lottery = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [lotteries, setLotteries] = useState([]);
  const getLottery = async () => {
    try {
      setIsLoading(true);
      const data = await apiGetAllLottery();
      console.log(data);
      setLotteries(data.lotteries);
      setIsLoading(false);
    } catch (error) {
      console.log("[Collections_GET]", error);
    }
  };
  useEffect(() => {
    getLottery();
  }, []);
  return isLoading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold items-center text-center">Cược</p>
        <Button
          className="bg-red-500 text-white"
          onClick={() => navigate("/lottery/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm cược
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={lotteries} searchKey="room" />
    </div>
  );
};

export default Lottery;
