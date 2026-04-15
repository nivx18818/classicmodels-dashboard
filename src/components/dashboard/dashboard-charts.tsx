"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
      <Card className="min-w-0 lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>
            Pivot-style aggregation grouped by date period.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-84 min-w-0">
            <LineChart
              className="h-full w-full"
              data={revenueOverTime}
              margin={{ left: 16, right: 16, top: 12 }}
              responsive
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
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>
            Ranked by total revenue in selected date range.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80 min-w-0">
            <BarChart
              className="h-full w-full"
              data={topCustomers}
              layout="vertical"
              margin={{ left: 0, right: 12, top: 12 }}
              responsive
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
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Best-Selling Products</CardTitle>
          <CardDescription>
            Top products by quantity sold and revenue contribution.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80 min-w-0">
            <BarChart
              className="h-full w-full"
              data={bestSellingProducts}
              margin={{ left: 0, right: 12, top: 12 }}
              responsive
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
