import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Stats = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("stats");
      return res.data;
    },
  });

  if (isLoading) return <div className="p-8 flex items-center justify-center text-center"><Spinner /></div>;

  // --- PIE CHART DATA (User Roles) ---
  const userRoleData = [
    { name: "Admins", value: stats.admins },
    { name: "Librarians", value: stats.librarians },
    { name: "Users", value: stats.users },
  ];

  // --- BAR CHART DATA (Books & Orders) ---
  const bookData = [
    {
      name: "Overview",
      books: stats.books,
      pending: stats.pendingOrders,
      cancelled: stats.cancelledOrders,
      completed: stats.completedOrders,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4"> Admin Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label>
                  {userRoleData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Books & Orders</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="books" name="Books" />
                <Bar dataKey="pending" name="Pending Orders" />
                <Bar dataKey="cancelled" name="Cancelled Orders" />
                <Bar dataKey="completed" name="Completed Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
