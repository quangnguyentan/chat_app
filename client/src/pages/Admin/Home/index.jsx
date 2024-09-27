import SalesChart from "@/components/SalesChart/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/index";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

const AdminDashBoard = () => {
  const [array1, setArray1] = useState(null);
  const [array2, setArray2] = useState(null);
  const [array3, setArray3] = useState(null);
  const [array4, setArray4] = useState(null);

  const func = async () => {
    let totalRevenue = await getTotalSales().then((data) =>
      setArray1(data.totalRevenue)
    );
    console.log(totalRevenue);
  };
  const func1 = async () => {
    let totalOrders = await getTotalSales().then((data) =>
      setArray2(data.totalOrders)
    );
    console.log(totalOrders);
  };
  const func2 = async () => {
    let totalCustomers = await getTotalCustomers();
    setArray3(totalCustomers);
  };
  const func3 = async () => {
    let data = await getSalesPerMonth();

    setArray4(data);
  };

  useEffect(() => {
    func() && func1() && func2() && func3();
  }, []);
  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Dashboard</p>
      <Separator className="bg-grey-1 my-5" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Revenue</CardTitle>
            <CircleDollarSign className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">$ {array1}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Customer</CardTitle>
            <UserRound className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{array3}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Sales Chart ($)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={array4} />
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminDashBoard;
