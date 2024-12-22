"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
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
import { Download, Check, X } from "lucide-react";
import * as xlsx from "xlsx";

// Mock data - replace with actual data fetching in a real application
const summaryData = {
  totalExpenses: 1234567,
  pendingApprovals: 12,
  largestCategory: "Inventory",
  budgetUtilization: 78,
};

const monthlyExpensesData = [
  { month: "Jan", expenses: 400000 },
  { month: "Feb", expenses: 300000 },
  { month: "Mar", expenses: 500000 },
  { month: "Apr", expenses: 450000 },
  { month: "May", expenses: 600000 },
  { month: "Jun", expenses: 550000 },
];

const categoryData = [
  { name: "Inventory", value: 500000 },
  { name: "Salaries", value: 300000 },
  { name: "Rent", value: 100000 },
  { name: "Utilities", value: 50000 },
  { name: "Marketing", value: 30000 },
];

const expensesData = [
  {
    id: 1,
    category: "Inventory",
    vendor: "PharmaCorp",
    date: "2023-06-01",
    amount: 100000,
    status: "Approved",
  },
  {
    id: 2,
    category: "Salaries",
    vendor: "Internal",
    date: "2023-06-02",
    amount: 150000,
    status: "Approved",
  },
  {
    id: 3,
    category: "Rent",
    vendor: "City Properties",
    date: "2023-06-03",
    amount: 50000,
    status: "Pending",
  },
  {
    id: 4,
    category: "Utilities",
    vendor: "PowerCo",
    date: "2023-06-04",
    amount: 25000,
    status: "Approved",
  },
  {
    id: 5,
    category: "Marketing",
    vendor: "AdAgency",
    date: "2023-06-05",
    amount: 30000,
    status: "Pending",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ExpenseDashboard() {
  const [filteredData, setFilteredData] = useState(expensesData);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filtered = expensesData.filter(
      (item) =>
        item.category.toLowerCase().includes(value) ||
        item.vendor.toLowerCase().includes(value),
    );
    setFilteredData(filtered);
  };

  const handleSort = (column: keyof (typeof expensesData)[number]) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    const sorted = [...filteredData].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredData(sorted);
  };

  const handleExport = (format: string) => {
    //use xlsx to export data and download
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(filteredData);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Expenses");
    xlsx.writeFile(workbook, `expenses.${format}`);

    //download file
    const link = document.createElement("a");
    link.href = `expenses.${format}`;
    link.download = `expenses.${format}`;
    link.click();

    //clean up
    URL.revokeObjectURL(link.href);
    link.remove();
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        Pharmacy Expense Management Dashboard
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="space-y-6 lg:w-1/4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ₹{summaryData.totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Amount",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:w-3/4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryData.pendingApprovals}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Largest Expense Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryData.largestCategory}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Budget Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryData.budgetUtilization}%
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  expenses: {
                    label: "Expenses",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyExpensesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="var(--color-expenses)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex-1">
              <Input
                placeholder="Filter by category or vendor"
                onChange={handleFilter}
                className="w-full"
              />
            </div>
            <Select
              onValueChange={(value) =>
                handleSort(value as keyof (typeof expensesData)[0])
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.vendor}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          item.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.status === "Pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
