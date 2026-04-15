import Link from "next/link";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { statsQuerySchema } from "@/lib/domain/validators";
import { getDashboardData } from "@/lib/services/dashboard-service";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

interface DashboardPageProps {
  searchParams: Promise<SearchParams>;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  const parsed = statsQuerySchema.safeParse({
    endDate: firstValue(params.endDate),
    interval: firstValue(params.interval),
    limit: firstValue(params.limit),
    startDate: firstValue(params.startDate),
  });

  const filters = parsed.success ? parsed.data : statsQuerySchema.parse({});
  const dashboard = await getDashboardData(filters);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-background to-secondary/20 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <h1 className="bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              ClassicModels Sales Dashboard
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Analyze order performance with time-range filters, pivot-style
              aggregations, and chart visualizations for revenue, top customers,
              and best-selling products.
            </p>
          </div>

          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            href="/search"
          >
            Open Search Workspace
          </Link>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Filters</CardTitle>
          <CardDescription>
            Set a date range and grouping interval to recompute all aggregated
            statistics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
            method="get"
          >
            <div className="space-y-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="startDate"
              >
                Start Date
              </label>
              <Input
                defaultValue={filters.startDate}
                id="startDate"
                name="startDate"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="endDate"
              >
                End Date
              </label>
              <Input
                defaultValue={filters.endDate}
                id="endDate"
                name="endDate"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="interval"
              >
                Group By
              </label>
              <select
                className="flex h-9 w-full rounded-lg border bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={filters.interval}
                id="interval"
                name="interval"
              >
                <option value="month">Month</option>
                <option value="day">Day</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="limit"
              >
                Top Rows
              </label>
              <Input
                defaultValue={String(filters.limit)}
                id="limit"
                max="30"
                min="1"
                name="limit"
                type="number"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                className={cn(buttonVariants({ variant: "default" }), "w-full")}
                type="submit"
              >
                Apply
              </button>
              <Link
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                href="/"
              >
                Reset
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <DashboardSummary stats={dashboard.summary} />

      <DashboardCharts
        bestSellingProducts={dashboard.bestSellingProducts}
        revenueOverTime={dashboard.revenueOverTime}
        topCustomers={dashboard.topCustomers}
      />
    </main>
  );
}
