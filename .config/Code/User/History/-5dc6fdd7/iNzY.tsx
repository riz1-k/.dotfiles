"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Download,
  Plus,
  CalendarIcon,
  PieChartIcon,
  LineChartIcon,
  Clock,
  BarChart2,
} from "lucide-react";

// Mock data - replace with actual data fetching in a real application
const salesData = [
  { month: "Jan", revenue: 50000, profit: 15000 },
  { month: "Feb", revenue: 55000, profit: 17000 },
  { month: "Mar", revenue: 60000, profit: 20000 },
  { month: "Apr", revenue: 58000, profit: 19000 },
  { month: "May", revenue: 65000, profit: 22000 },
  { month: "Jun", revenue: 70000, profit: 25000 },
];

const inventoryData = [
  { category: "Antibiotics", stock: 5000, value: 100000 },
  { category: "Pain Relief", stock: 8000, value: 80000 },
  { category: "Vitamins", stock: 10000, value: 50000 },
  { category: "Skincare", stock: 3000, value: 60000 },
  { category: "Diabetes", stock: 2000, value: 70000 },
];

const topSellingProducts = [
  { name: "Paracetamol", sales: 5000, revenue: 25000 },
  { name: "Amoxicillin", sales: 3000, revenue: 45000 },
  { name: "Vitamin C", sales: 4000, revenue: 20000 },
  { name: "Ibuprofen", sales: 3500, revenue: 17500 },
  { name: "Omeprazole", sales: 2000, revenue: 30000 },
];

const customerSegmentation = [
  { segment: "Regular", value: 50 },
  { segment: "Occasional", value: 30 },
  { segment: "New", value: 15 },
  { segment: "VIP", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function MISReports() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  });

  const renderChart = (chartType: string) => {
    switch (chartType) {
      case "bar":
        return (
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
              profit: {
                label: "Profit",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" />
                <Bar dataKey="profit" fill="var(--color-profit)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
      case "line":
        return (
          <ChartContainer
            config={{
              stock: {
                label: "Stock",
                color: "hsl(var(--chart-3))",
              },
              value: {
                label: "Value",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryData}>
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="stock"
                  stroke="var(--color-stock)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
      case "pie":
        return (
          <ChartContainer
            config={{
              value: {
                label: "Value",
                color: "hsl(var(--chart-5))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegmentation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {customerSegmentation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">MIS Reports</h1>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Schedule Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Report</DialogTitle>
                <DialogDescription>
                  Set up automated report delivery.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="report" className="text-right">
                    Report
                  </Label>
                  <Select defaultValue="sales">
                    <SelectTrigger id="report" className="col-span-3">
                      <SelectValue placeholder="Select report" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="inventory">
                        Inventory Report
                      </SelectItem>
                      <SelectItem value="customers">Customer Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">
                    Frequency
                  </Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="frequency" className="col-span-3">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    className="col-span-3"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <Button type="submit">Schedule Report</Button>
            </DialogContent>
          </Dialog>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹358,000</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Profit
                </CardTitle>
                <LineChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹118,000</div>
                <p className="text-xs text-muted-foreground">
                  +15.5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,345</div>
                <p className="text-xs text-muted-foreground">
                  +8.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Profit</CardTitle>
              </CardHeader>
              <CardContent>{renderChart("bar")}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
              </CardHeader>
              <CardContent>{renderChart("line")}</CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingProducts.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>₹{product.revenue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
              </CardHeader>
              <CardContent>{renderChart("pie")}</CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pre-built Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Button
                  onClick={() => setSelectedReport("sales")}
                  variant={selectedReport === "sales" ? "default" : "outline"}
                >
                  Sales Report
                </Button>
                <Button
                  onClick={() => setSelectedReport("inventory")}
                  variant={
                    selectedReport === "inventory" ? "default" : "outline"
                  }
                >
                  Inventory Report
                </Button>
                <Button
                  onClick={() => setSelectedReport("customers")}
                  variant={
                    selectedReport === "customers" ? "default" : "outline"
                  }
                >
                  Customer Report
                </Button>
                <Button
                  onClick={() => setSelectedReport("suppliers")}
                  variant={
                    selectedReport === "suppliers" ? "default" : "outline"
                  }
                >
                  Supplier Report
                </Button>
                <Button
                  onClick={() => setSelectedReport("finance")}
                  variant={selectedReport === "finance" ? "default" : "outline"}
                >
                  Financial Report
                </Button>
                <Button
                  onClick={() => setSelectedReport("employees")}
                  variant={
                    selectedReport === "employees" ? "default" : "outline"
                  }
                >
                  Employee Performance
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {selectedReport.charAt(0).toUpperCase() +
                  selectedReport.slice(1)}{" "}
                Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[280px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {dateRange.from.toDateString()} -{" "}
                            {dateRange.to.toDateString()}
                          </>
                        ) : (
                          dateRange.from.toDateString()
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <Select defaultValue="daily">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select grouping" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {renderChart("bar")}
              <ScrollArea className="mt-4 h-[300px] w-full rounded-md border p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Orders</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((item) => (
                      <TableRow key={item.month}>
                        <TableCell>{item.month}</TableCell>
                        <TableCell>₹{item.revenue}</TableCell>
                        <TableCell>₹{item.profit}</TableCell>
                        <TableCell>{Math.floor(item.revenue / 100)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input id="report-name" placeholder="Enter report name" />
                </div>
                <div>
                  <Label>Select Data Points</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sales" />
                      <label htmlFor="sales">Sales</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="revenue" />
                      <label htmlFor="revenue">Revenue</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="profit" />
                      <label htmlFor="profit">Profit</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="inventory" />
                      <label htmlFor="inventory">Inventory</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="customers" />
                      <label htmlFor="customers">Customers</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="orders" />
                      <label htmlFor="orders">Orders</label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Grouping</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Chart Type</Label>
                  <Select defaultValue="bar">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="pie">Pie Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Filters</Label>
                  <div className="mt-2 flex items-center space-x-2">
                    <Select defaultValue="category">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="store">Store</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="equals">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater">Greater than</SelectItem>
                        <SelectItem value="less">Less than</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Value" className="w-[200px]" />
                    <Button variant="outline" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full">Generate Custom Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
