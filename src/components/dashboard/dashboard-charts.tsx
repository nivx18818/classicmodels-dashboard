"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  BestSellingProductPoint,
  RevenuePoint,
  TopCustomerPoint,
} from "@/lib/domain/types";
import { formatCurrency, formatNumber } from "@/lib/formatters";

interface DashboardChartsProps {
  bestSellingProducts: BestSellingProductPoint[];
  revenueOverTime: RevenuePoint[];
  topCustomers: TopCustomerPoint[];
}

export function DashboardCharts({
  bestSellingProducts,
  revenueOverTime,
  topCustomers,
}: DashboardChartsProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>
            Pivot-style aggregation grouped by date period.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-84 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueOverTime}
              margin={{ left: 16, right: 16, top: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" minTickGap={20} />
              <YAxis tickFormatter={(value) => formatNumber(Number(value))} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Line
                dataKey="revenue"
                dot={false}
                stroke="var(--color-chart-2)"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>
            Ranked by total revenue in selected date range.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCustomers}
              layout="vertical"
              margin={{ left: 0, right: 12, top: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis hide type="number" />
              <YAxis
                dataKey="customerName"
                tick={{ fontSize: 11 }}
                type="category"
                width={130}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => String(label)}
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-chart-3)"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best-Selling Products</CardTitle>
          <CardDescription>
            Top products by quantity sold and revenue contribution.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bestSellingProducts}
              margin={{ left: 0, right: 12, top: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productCode" minTickGap={20} />
              <YAxis tickFormatter={(value) => formatNumber(Number(value))} />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Bar
                dataKey="unitsSold"
                fill="var(--color-chart-4)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}
