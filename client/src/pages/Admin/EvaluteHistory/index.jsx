import danhgia1 from "@/assets/danhgia1.jpg";
import danhgia2 from "@/assets/danhgia2.jpg";
import danhgia3 from "@/assets/danhgia3.jpg";
import danhgia4 from "@/assets/danhgia4.jpeg";
import danhgia5 from "@/assets/danhgia5.jpg";
import danhgia6 from "@/assets/danhgia6.png";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
const EvaluteHistoryAdmin = () => {
  const [active, setActive] = useState(0);
  const [key, setKey] = useState(1);
  const navigate = useNavigate();

  const { id } = useParams();

  return (
    <div className="w-full h-screen  ">
      <div className="sticky w-full top-0">
        <div className="w-full h-[50px] bg-profileColor">
          <span className=" text-xl text-white absolute top-2 left-[40%]">
            Lịch sử đánh giá
          </span>
        </div>
      </div>
      <div className="w-full flex bg-gray-100">
        <div className="w-full grid grid-cols-2 gap-2 px-4 pb-20 pt-4 ">
          <Link
            to={`/historydetails/${key}`}
            onClick={() => {
              setKey(1);
            }}
          >
            <div className="w-[100%] bg-white cursor-pointer  rounded-2xl h-[140px] flex flex-col items-center ">
              <img
                className="w-full h-[70%] object-contain rounded-2xl px-4 py-2  "
                src={danhgia1}
                alt="evalute"
              />
              <span className="">Đánh giá 1 </span>
            </div>
          </Link>
          <Link
            to={`/historydetails/${key + 1}`}
            onClick={() => {
              setKey(2);
            }}
          >
            <div className="w-[100%] bg-white cursor-pointer  rounded-2xl h-[140px] flex flex-col items-center">
              <img
                className="w-full h-[70%] object-contain rounded-2xl px-4 py-2  "
                src={danhgia2}
                alt="evalute"
              />
              <span className="">Đánh giá 2 </span>
            </div>
          </Link>
          <Link
            to={`/historydetails/${key + 2}`}
            onClick={() => {
              setKey(3);
            }}
          >
            <div className="w-[100%] bg-white cursor-pointer  rounded-2xl h-[140px] flex flex-col items-center ">
              <img
                className="w-full h-[70%] object-contain rounded-2xl px-4 py-2  "
                src={danhgia3}
                alt="evalute"
              />
              <span className="">Đánh giá 3 </span>
            </div>
          </Link>
          <Link
            to={`/historydetails/${key + 3}`}
            onClick={() => {
              setKey(4);
            }}
          >
            <div className="w-[100%] bg-white cursor-pointer  rounded-2xl h-[140px] flex flex-col items-center ">
              <img
                className="w-full h-[70%] object-contain rounded-2xl px-4 py-2  "
                src={danhgia4}
                alt="evalute"
              />
              <span className="">Đánh giá 4 </span>
            </div>
          </Link>
          <Link
            to={`/historydetails/${key + 4}`}
            onClick={() => {
              setKey(5);
            }}
          >
            <div className="w-[100%] bg-white cursor-pointer  rounded-2xl h-[140px]  flex flex-col items-center">
              <img
                className="w-full h-[70%] object-contain rounded-2xl px-4 py-2  "
                src={danhgia5}
                alt="evalute"
              />
              <span className="">Đánh giá 5 </span>
            </div>
          </Link>
          <Link
            to={`/historydetails/${key + 5}`}
            onClick={() => {
              setKey(6);
            }}
          >
            <div className="w-[100%] bg-white cursor-pointer  rounded-2xl h-[140px]  flex flex-col items-center">
              <img
                className="w-full h-[70%] object-contain rounded-2xl px-4 py-2  "
                src={danhgia6}
                alt="evalute"
              />
              <span className="">Đánh giá 6 </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluteHistoryAdmin;
