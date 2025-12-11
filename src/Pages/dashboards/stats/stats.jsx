import React from "react";
import { useQuery } from "@tanstack/react-query";
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
  Legend
} from "recharts";
import { Users, BookOpen, ShoppingCart, Activity } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


const COLORS = {
  primary: "#3b82f6",   
  secondary: "#10b981", 
  accent: "#f59e0b",   
  muted: "#ef4444",    
  slate: "#64748b"      
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent];

const Stats = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("stats");
      return res.data;
    },
  });
  console.log(stats);

  if (isLoading) return <StatsSkeleton />;

  const userRoleData = [
    { name: "Admins", value: stats.admins || 0 },
    { name: "Librarians", value: stats.librarians || 0 },
    { name: "Users", value: stats.users || 0 },
  ];

  const orderData = [
    { name: "Pending", value: stats.pendingOrders, fill: COLORS.accent },
    { name: "Completed", value: stats.completedOrders, fill: COLORS.secondary },
    { name: "Cancelled", value: stats.cancelledOrders, fill: COLORS.muted },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Users"
          value={stats.users + stats.admins + stats.librarians}
          icon={Users}
          description="Active accounts" />
        <KpiCard
          title="Library Inventory"
          value={stats.books}
          icon={BookOpen}
          description="Books available" />
        <KpiCard
          title="Total Orders"
          value={stats.pendingOrders + stats.completedOrders + stats.cancelledOrders}
          icon={ShoppingCart}
          description="All time transactions" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col border-none shadow-sm bg-card">
          <CardHeader className="pb-0">
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of platform roles</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none">
                  {userRoleData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#000' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="flex flex-col border-none shadow-sm bg-card">
          <CardHeader className="pb-0">
            <CardTitle>Order Performance</CardTitle>
            <CardDescription>Status of current transactions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar
                  dataKey="value"
                  barSize={32}
                  radius={[0, 4, 4, 0]}
                  background={{ fill: '#f1f5f9' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, description }) => (
  <Card className="border-none shadow-sm bg-card">
    <CardContent className="p-6 flex items-center justify-between space-y-0">
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="p-3 bg-primary/10 rounded-full text-primary">
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  </Card>
);

const StatsSkeleton = () => (
  <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-[350px] rounded-xl" />
      <Skeleton className="h-[350px] rounded-xl" />
    </div>
  </div>
);

export default Stats;