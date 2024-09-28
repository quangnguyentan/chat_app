import { Customer } from "@/components/Dashboard/Customer";
import { Dashboard } from "@/components/Dashboard/Dashboard";
import { Group } from "@/components/Dashboard/Group";
import { User } from "@/components/Dashboard/User";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useEffect, useState } from "react";

export default function Home() {
  const [getIndex, setGetIndex] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const index = localStorage.getItem("index");
      setGetIndex(index);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
      <Sidebar />
      {getIndex === "1" && <Dashboard />}
      {getIndex === "2" && <Customer />}
      {getIndex === "3" && <User />}
      {getIndex === "4" && <Group />}
    </main>
  );
}
