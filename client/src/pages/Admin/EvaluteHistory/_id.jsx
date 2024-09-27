import { apiGetRoomById } from "@/services/evaluateService";
import { useNavigate, useParams } from "react-router-dom";
import empty from "@/assets/empty-image-default.png";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import moment from "moment";
const HistoryDetailsAdmin = () => {
  const [evalute, setEvalute] = useState(null);
  const [active, setActive] = useState(0);
  const [key, setKey] = useState(1);

  const { roomId } = useParams();
  const navigate = useNavigate();
  const getHistoryLottery = async (roomId) => {
    const data = await apiGetRoomById(roomId);
    if (data?.success) {
      setEvalute(data?.evaluates);
    }
  };
  useEffect(() => {
    getHistoryLottery(roomId);
  }, [roomId]);
  console.log(evalute?.users);
  return (
    <div className="h-screen">
      <div className="relative w-full mx-auto">
        <div className="sticky w-full top-0">
          <div className="w-full h-[50px] bg-profileColor">
            <span className=" text-lg text-white absolute top-2 left-[40%]">
              Lịch sử đánh giá phòng {roomId}
            </span>
          </div>
        </div>
        <div className="">
          {evalute?.users?.length > 0 ? (
            <div className="bg-gray-200 h-fit   ">
              <div className="w-full px-4 flex flex-col gap-4 py-4 ">
                {evalute &&
                  evalute?.users?.reverse()?.map((el) => (
                    <div
                      key={el?._id}
                      className="w-full h-fit border-b-2 bg-white flex flex-col gap-1 px-2 py-2 rounded-xl "
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-semibold text-gray-500">
                          Khoảng thời gian
                        </span>
                        <span className="text-lg font-bold">
                          {moment(el?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-semibold text-gray-500">
                          Số tiền
                        </span>
                        <span className="text-lg font-bold">{el?.money}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-semibold text-gray-500">
                          Đánh giá
                        </span>
                        <div className="text-lg font-bold flex items-center gap-4">
                          {el?.result?.map((rs, index) => (
                            <span key={index}>{rs}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-semibold text-gray-500">
                          Kỳ
                        </span>
                        <div className="text-lg font-bold flex items-center gap-4">
                          {el?.periodNumber}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-semibold text-gray-500">
                          Kết quả
                        </span>
                        <div className="text-lg font-bold flex items-center gap-4">
                          {evalute?.result[el?.periodNumber - 1]
                            .sort()
                            ?.map((rs, index) => (
                              <span key={index}>{rs.toUpperCase()}</span>
                            ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-lg font-semibold text-gray-500">
                          Nội dung
                        </span>
                        <div className="text-lg font-bold flex items-center gap-4">
                          {/* {JSON.stringify(
                            evalute?.result[el?.periodNumber - 1].sort()
                          ) === JSON.stringify(el?.result)
                            ? "Thắng "
                            : "Thua"} */}
                          {evalute?.result[el?.periodNumber - 1]
                            .sort()
                            .every(
                              (value, index) => value === el?.result[index]
                            )
                            ? "Thắng"
                            : evalute?.result[el?.periodNumber - 1]
                                .sort()
                                .some(
                                  (value, index) => value === el?.result[index]
                                )
                            ? "Huề"
                            : evalute?.result[el?.periodNumber - 1]
                                .sort()
                                .every(
                                  (value, index) => value !== el?.result[index]
                                ) && "Thua"}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-screen flex flex-col items-center justify-start">
              <img src={empty} />
              <span className="text-xl font-semibold text-gray-500">
                Chưa có giao dịch nào !
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailsAdmin;
