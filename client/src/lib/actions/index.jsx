import { apiGetAllUser } from "@/services/userService";

export const getTotalSales = async () => {
  const data = await apiGetAllUser();
  const totalOrders = data?.user?.length;
  const totalRevenue = data?.user?.reduce(
    (acc, user) => acc + user.withDraw,
    0
  );
  return { totalOrders, totalRevenue };
};

export const getTotalCustomers = async () => {
  const data = await apiGetAllUser();
  const totalCustomers = data?.user?.length;
  return totalCustomers;
};

export const getSalesPerMonth = async () => {
  const data = await apiGetAllUser();
  const salesPerMonth = data?.user?.reduce((acc, user) => {
    const monthIndex = new Date(user?.createdAt)?.getMonth(); // 0 for Janruary --> 11 for December
    acc[monthIndex] = (acc[monthIndex] || 0) + user?.withDraw;

    return acc;
  }, {});

  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
      new Date(0, i)
    );
    // if i === 5 => month = "Jun"
    return { name: month, sales: salesPerMonth[NaN] || 0 };
  });

  return graphData;
};
