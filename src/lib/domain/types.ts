export type TimeInterval = "day" | "month";

export interface DateRange {
  endDate?: string;
  startDate?: string;
}

export interface CatalogItem {
  id: string;
  label: string;
  meta: string;
}

export interface OrderSearchFilters extends DateRange {
  customer?: string;
  page: number;
  pageSize: number;
  product?: string;
}

export interface OrderSearchRow {
  customerName: string;
  itemCount: number;
  orderDate: string;
  orderNumber: number;
  primaryProduct: string;
  revenue: number;
  status: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SummaryStats {
  activeCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  totalUnitsSold: number;
}

export interface RevenuePoint {
  orders: number;
  period: string;
  revenue: number;
  units: number;
}

export interface TopCustomerPoint {
  customerName: string;
  customerNumber: number;
  orders: number;
  revenue: number;
}

export interface BestSellingProductPoint {
  productCode: string;
  productLine: string;
  productName: string;
  revenue: number;
  unitsSold: number;
}

export interface DashboardData {
  bestSellingProducts: BestSellingProductPoint[];
  filters: {
    endDate?: string;
    interval: TimeInterval;
    limit: number;
    startDate?: string;
  };
  revenueOverTime: RevenuePoint[];
  summary: SummaryStats;
  topCustomers: TopCustomerPoint[];
}
