import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type {
  BestSellingProductPoint,
  DateRange,
  RevenuePoint,
  SummaryStats,
  TimeInterval,
  TopCustomerPoint,
} from "@/lib/domain/types";
import { toNumber } from "@/lib/services/service-utils";

interface SummaryRow {
  activeCustomers: unknown;
  totalOrders: unknown;
  totalRevenue: unknown;
  totalUnitsSold: unknown;
}

interface RevenueRow {
  orders: unknown;
  period: string;
  revenue: unknown;
  units: unknown;
}

interface TopCustomerRow {
  customerName: string;
  customerNumber: number;
  orders: unknown;
  revenue: unknown;
}

interface BestSellingProductRow {
  productCode: string;
  productLine: string;
  productName: string;
  revenue: unknown;
  unitsSold: unknown;
}

function buildOrderDateSqlFilter(
  startDate?: string,
  endDate?: string,
): Prisma.Sql {
  const clauses: Prisma.Sql[] = [];

  if (startDate) {
    clauses.push(Prisma.sql`o.orderDate >= ${startDate}`);
  }

  if (endDate) {
    clauses.push(Prisma.sql`o.orderDate <= ${endDate}`);
  }

  if (clauses.length === 0) {
    return Prisma.sql`1 = 1`;
  }

  return Prisma.sql`${Prisma.join(clauses, " AND ")}`;
}

export async function getSummaryStats({
  endDate,
  startDate,
}: DateRange): Promise<SummaryStats> {
  const whereClause = buildOrderDateSqlFilter(startDate, endDate);

  const rows = await prisma.$queryRaw<SummaryRow[]>(Prisma.sql`
    SELECT
      COUNT(DISTINCT o.customerNumber) AS activeCustomers,
      COUNT(DISTINCT o.orderNumber) AS totalOrders,
      COALESCE(SUM(od.quantityOrdered * od.priceEach), 0) AS totalRevenue,
      COALESCE(SUM(od.quantityOrdered), 0) AS totalUnitsSold
    FROM orders o
    INNER JOIN orderdetails od ON od.orderNumber = o.orderNumber
    WHERE ${whereClause}
  `);

  const summary = rows[0];

  return {
    activeCustomers: toNumber(summary?.activeCustomers),
    totalOrders: toNumber(summary?.totalOrders),
    totalRevenue: toNumber(summary?.totalRevenue),
    totalUnitsSold: toNumber(summary?.totalUnitsSold),
  };
}

export async function getRevenueOverTime(
  { endDate, startDate }: DateRange,
  interval: TimeInterval,
): Promise<RevenuePoint[]> {
  const whereClause = buildOrderDateSqlFilter(startDate, endDate);
  const periodExpression =
    interval === "day"
      ? Prisma.sql`DATE_FORMAT(o.orderDate, '%Y-%m-%d')`
      : Prisma.sql`DATE_FORMAT(o.orderDate, '%Y-%m')`;

  const rows = await prisma.$queryRaw<RevenueRow[]>(Prisma.sql`
    SELECT
      ${periodExpression} AS period,
      COUNT(DISTINCT o.orderNumber) AS orders,
      COALESCE(SUM(od.quantityOrdered * od.priceEach), 0) AS revenue,
      COALESCE(SUM(od.quantityOrdered), 0) AS units
    FROM orders o
    INNER JOIN orderdetails od ON od.orderNumber = o.orderNumber
    WHERE ${whereClause}
    GROUP BY period
    ORDER BY period ASC
  `);

  return rows.map((row) => ({
    orders: toNumber(row.orders),
    period: row.period,
    revenue: toNumber(row.revenue),
    units: toNumber(row.units),
  }));
}

export async function getTopCustomers(
  { endDate, startDate }: DateRange,
  limit: number,
): Promise<TopCustomerPoint[]> {
  const whereClause = buildOrderDateSqlFilter(startDate, endDate);

  const rows = await prisma.$queryRaw<TopCustomerRow[]>(Prisma.sql`
    SELECT
      c.customerNumber AS customerNumber,
      c.customerName AS customerName,
      COUNT(DISTINCT o.orderNumber) AS orders,
      COALESCE(SUM(od.quantityOrdered * od.priceEach), 0) AS revenue
    FROM customers c
    INNER JOIN orders o ON o.customerNumber = c.customerNumber
    INNER JOIN orderdetails od ON od.orderNumber = o.orderNumber
    WHERE ${whereClause}
    GROUP BY c.customerNumber, c.customerName
    ORDER BY revenue DESC
    LIMIT ${limit}
  `);

  return rows.map((row) => ({
    customerName: row.customerName,
    customerNumber: row.customerNumber,
    orders: toNumber(row.orders),
    revenue: toNumber(row.revenue),
  }));
}

export async function getBestSellingProducts(
  { endDate, startDate }: DateRange,
  limit: number,
): Promise<BestSellingProductPoint[]> {
  const whereClause = buildOrderDateSqlFilter(startDate, endDate);

  const rows = await prisma.$queryRaw<BestSellingProductRow[]>(Prisma.sql`
    SELECT
      p.productCode AS productCode,
      p.productLine AS productLine,
      p.productName AS productName,
      COALESCE(SUM(od.quantityOrdered * od.priceEach), 0) AS revenue,
      COALESCE(SUM(od.quantityOrdered), 0) AS unitsSold
    FROM products p
    INNER JOIN orderdetails od ON od.productCode = p.productCode
    INNER JOIN orders o ON o.orderNumber = od.orderNumber
    WHERE ${whereClause}
    GROUP BY p.productCode, p.productLine, p.productName
    ORDER BY unitsSold DESC, revenue DESC
    LIMIT ${limit}
  `);

  return rows.map((row) => ({
    productCode: row.productCode,
    productLine: row.productLine,
    productName: row.productName,
    revenue: toNumber(row.revenue),
    unitsSold: toNumber(row.unitsSold),
  }));
}
