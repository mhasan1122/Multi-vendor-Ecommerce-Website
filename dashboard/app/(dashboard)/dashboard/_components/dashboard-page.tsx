"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Modal } from "@/components/modal";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import OrdersPage from "../../orders/_components/order-page";

// Sample data for the statistics

interface AnalyticsResponse {
  totalIncome: number;
  totalOrders: number;
  totalCustomers: number;
  salesByLocation: {
    region: string;
    totalAmount: number;
    percentage: string;
  }[];
  topProducts: {
    count: number;
    productId: string;
    name: string;
  }[];
  /* eslint-disable @typescript-eslint/no-explicit-any */
  cancelledProducts: any[];
}

interface ApiProps {
  status: boolean;
  message: string;
  data: AnalyticsResponse;
}

interface ChartProps {
  data: {
    name: string;
    revenue: number;
    sales: number;
  }[];
}

// Sample data for the revenue chart

export default function DashboardPage() {
  // const router = useRouter();
  const { toast } = useToast();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const getStats = async (): Promise<ApiProps> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/analytics/dashboard`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    return response.json();
  };

  const { data: statData } = useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });

  const getChartStats = async (): Promise<ChartProps> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/analytics/dashboard-analysis`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }

    return response.json();
  };

  const { data: revenueData } = useQuery({
    queryKey: ["revenueData"],
    queryFn: getChartStats,
  });

  // Function to confirm delete
  const confirmDelete = () => {
    // In a real app, you would make an API call here
    toast({
      title: "Order deleted",
      description: `Order #${selectedOrderId} has been deleted.`,
    });
    setDeleteConfirmOpen(false);
  };

  // Columns for the orders table

  const { user } = useAuth();
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome Back{" "}
            <span className="uppercase">{user?.name || "user"}</span>{" "}
          </h1>
          <p className="text-muted-foreground">
            Lorem ipsum dolor si amet welcome back johny
          </p>
        </div>

        <div className="grid gap-4 text-center md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="">
              <CardTitle className="flex items-center justify-center gap-2 text-sm font-medium">
                <span className="text-base">Total Income</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statData?.data?.totalIncome}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="">
              <CardTitle className="flex items-center justify-center gap-2 text-sm font-medium">
                <span className="text-base">Total Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statData?.data?.totalOrders}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="">
              <CardTitle className="flex items-center justify-center gap-2 text-sm font-medium">
                <span className="text-base">Total Customers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statData?.data?.totalCustomers}
              </div>
              {/* <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">{stat.increase}</span> •{" "}
                  {stat.increaseValue}
                </p> */}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistic</CardTitle>
              <p className="text-sm text-muted-foreground">Revenue and Sales</p>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData?.data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md">
                            <p className="font-medium">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-blue-500">{`Revenue: $${payload[0].value}`}</p>
                            <p className="text-red-500">{`Sales: ${payload[1].value}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between gap-6">
          <div className="grid gap-4">
            <Card className="w-[350px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sales by Location</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sales performance by location
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[300px] space-y-4 overflow-auto">
                  {statData?.data?.salesByLocation &&
                  statData.data.salesByLocation.length > 0 ? (
                    statData.data.salesByLocation.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            <Image
                              src="/images/flag.png"
                              alt="image"
                              width={50}
                              height={50}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.region}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.percentage}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          ${item.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      No location data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="w-[350px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Top Product</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Top product in a period of time
                  </p>
                </div>
                {/* <Button size="sm" variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button> */}
              </CardHeader>
              <CardContent>
                <div className="max-h-[300px] space-y-4 overflow-auto">
                  {statData?.data?.topProducts &&
                  statData.data.topProducts.length > 0 ? (
                    statData.data.topProducts.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src="/images/p-cate-1.png"
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                          <div>
                            <p className="font-medium">
                              {item.name} <br />{" "}
                              <span className="text-xs text-gray-500">
                                {item.count} sold
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                          #{item.productId.substring(0, 8)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-muted-foreground">
                      No product data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-full w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* <DataTable columns={columns} data={recentOrdersData} /> */}

                <OrdersPage />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title="Confirm Deletion"
        description={`Are you sure you want to delete order #${selectedOrderId}?`}
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </>
  );
}
