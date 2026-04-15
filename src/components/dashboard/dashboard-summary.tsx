import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SummaryStats } from "@/lib/domain/types";
import { formatCurrency, formatNumber } from "@/lib/formatters";

interface DashboardSummaryProps {
  stats: SummaryStats;
}

export function DashboardSummary({ stats }: DashboardSummaryProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl">
            {formatCurrency(stats.totalRevenue)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Orders</CardDescription>
          <CardTitle className="text-2xl">
            {formatNumber(stats.totalOrders)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Customers</CardDescription>
          <CardTitle className="text-2xl">
            {formatNumber(stats.activeCustomers)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Units Sold</CardDescription>
          <CardTitle className="text-2xl">
            {formatNumber(stats.totalUnitsSold)}
          </CardTitle>
        </CardHeader>
      </Card>
    </section>
  );
}
