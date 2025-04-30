"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// Sample data for the statistics
const statisticsData = [
  {
    title: "Income",
    value: "$75,000",
    increase: "10%",
    increaseValue: "$150 today",
    icon: "💰",
  },
  {
    title: "Orders",
    value: "31,500",
    increase: "10%",
    increaseValue: "$150 today",
    icon: "📦",
  },
  {
    title: "Profit",
    value: "$51,250",
    increase: "10%",
    increaseValue: "$150 today",
    icon: "💵",
  },
  {
    title: "Customer",
    value: "11,300",
    increase: "10%",
    increaseValue: "$150 today",
    icon: "👥",
  },
];

// Sample data for the revenue chart
const revenueData = [
  { name: "Jan", revenue: 400, sales: 240 },
  { name: "Feb", revenue: 300, sales: 138 },
  { name: "Mar", revenue: 200, sales: 980 },
  { name: "Apr", revenue: 278, sales: 390 },
  { name: "May", revenue: 189, sales: 480 },
  { name: "Jun", revenue: 239, sales: 380 },
  { name: "Jul", revenue: 349, sales: 430 },
  { name: "Aug", revenue: 400, sales: 300 },
  { name: "Sep", revenue: 500, sales: 400 },
  { name: "Oct", revenue: 349, sales: 200 },
  { name: "Nov", revenue: 550, sales: 500 },
  { name: "Dec", revenue: 400, sales: 340 },
];

// Sample data for expenses chart
const expensesData = [
  { name: "Jan", revenue: 400, sales: 240 },
  { name: "Feb", revenue: 300, sales: 138 },
  { name: "Mar", revenue: 200, sales: 980 },
  { name: "Apr", revenue: 278, sales: 390 },
  { name: "May", revenue: 189, sales: 480 },
  { name: "Jun", revenue: 239, sales: 380 },
  { name: "Jul", revenue: 349, sales: 430 },
  { name: "Aug", revenue: 400, sales: 300 },
  { name: "Sep", revenue: 500, sales: 400 },
  { name: "Oct", revenue: 349, sales: 200 },
  { name: "Nov", revenue: 550, sales: 500 },
  { name: "Dec", revenue: 400, sales: 340 },
];

// Sample data for sales by location
const salesByLocationData = [
  { country: "Turkey", flag: "🇹🇷", sales: "350 Sales", amount: "$24,700" },
  { country: "Germany", flag: "🇩🇪", sales: "520 Sales", amount: "$24,189" },
  {
    country: "Arab Emirates",
    flag: "🇦🇪",
    sales: "455 Sales",
    amount: "$15,700",
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    sales: "310 Sales",
    amount: "$17,678",
  },
  { country: "France", flag: "🇫🇷", sales: "435 Sales", amount: "$7,456" },
  { country: "Spain", flag: "🇪🇸", sales: "190 Sales", amount: "$5,500" },
  { country: "Indonesia", flag: "🇮🇩", sales: "10 Sales", amount: "$2,500" },
  { country: "United States", flag: "🇺🇸", sales: "48 Sales", amount: "$2,000" },
];

// Sample data for top products
const topProductsData = [
  {
    image: "/placeholder.svg?height=50&width=50",
    name: "T-Shirt",
    amount: "$17,678",
  },
  {
    image: "/placeholder.svg?height=50&width=50",
    name: "Black Stripes T-Shirt",
    amount: "$15,500",
  },
  {
    image: "/placeholder.svg?height=50&width=50",
    name: "Black Stripes T-Shirt",
    amount: "$10,500",
  },
  {
    image: "/placeholder.svg?height=50&width=50",
    name: "Black Stripes T-Shirt",
    amount: "$8,456",
  },
  {
    image: "/placeholder.svg?height=50&width=50",
    name: "Black Stripes T-Shirt",
    amount: "$7,189",
  },
  {
    image: "/placeholder.svg?height=50&width=50",
    name: "Black Stripes T-Shirt",
    amount: "$5,700",
  },
  {
    image: "/placeholder.svg?height=50&width=50",
    name: "Black Stripes T-Shirt",
    amount: "$4,000",
  },
];

// Sample data for pie chart
const pieChartData = [
  { name: "Stripes T-Shirt", value: 30 },
  { name: "Stripes T-Shirt", value: 25 },
  { name: "Stripes T-Shirt", value: 20 },
  { name: "Stripes T-Shirt", value: 15 },
  { name: "Stripes T-Shirt", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer</h1>
        <div className="relative mt-2 w-64">
          <Input
            type="search"
            placeholder="Search category..."
            className="w-full pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statisticsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="text-2xl">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.increase}</span> •{" "}
                {stat.increaseValue}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Statistic</CardTitle>
            <p className="text-sm text-muted-foreground">Revenue and Sales</p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
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

        <Card>
          <CardHeader>
            <CardTitle>Statistic</CardTitle>
            <p className="text-sm text-muted-foreground">Income and Expenses</p>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expensesData}
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
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="sales" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <Card>
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
              {salesByLocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1200px-Flag_of_Turkey.svg.png"
                        alt="Linda Blair"
                        className="h-full w-full rounded-full object-cover"
                      />
                      <AvatarFallback>LB</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.country}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sales}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">{item.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Product</CardTitle>
              <p className="text-sm text-muted-foreground">
                Top product in a period of time
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] space-y-4 overflow-auto">
              {topProductsData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/p-cate-1.png"
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <p className="font-medium">{item.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Cancel Product</CardTitle>
              <p className="text-sm text-muted-foreground">
                Top canceled products in a period of time
              </p>
            </div>
            <Button size="sm" variant="outline">
              Nov 24
            </Button>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">30%</div>
                  <div className="text-sm text-muted-foreground">
                    Top Cancel
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {COLORS.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="text-sm">Stripes T-Shirt</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add the Input component that was missing
function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
