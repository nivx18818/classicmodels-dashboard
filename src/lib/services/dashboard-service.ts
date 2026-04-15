import type { DashboardData, TimeInterval } from "@/lib/domain/types";
import {
  getBestSellingProducts,
  getRevenueOverTime,
  getSummaryStats,
  getTopCustomers,
} from "@/lib/services/analytics-service";

interface DashboardQuery {
  endDate?: string;
  interval: TimeInterval;
  limit: number;
  startDate?: string;
}

export async function getDashboardData(
  query: DashboardQuery,
): Promise<DashboardData> {
  const [summary, revenueOverTime, topCustomers, bestSellingProducts] =
    await Promise.all([
      getSummaryStats(query),
      getRevenueOverTime(query, query.interval),
      getTopCustomers(query, query.limit),
      getBestSellingProducts(query, query.limit),
    ]);

  return {
    bestSellingProducts,
    filters: {
      endDate: query.endDate,
      interval: query.interval,
      limit: query.limit,
      startDate: query.startDate,
    },
    revenueOverTime,
    summary,
    topCustomers,
  };
}
