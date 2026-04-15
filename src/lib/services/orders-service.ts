import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type {
  OrderSearchFilters,
  OrderSearchRow,
  PagedResult,
} from "@/lib/domain/types";
import { toNumber, toOrderDateWhere } from "@/lib/services/service-utils";

export async function searchOrders(
  filters: OrderSearchFilters,
): Promise<PagedResult<OrderSearchRow>> {
  const customerTerm = filters.customer?.trim();
  const productTerm = filters.product?.trim();

  const where: Prisma.OrderWhereInput = {
    orderDate:
      filters.startDate || filters.endDate
        ? toOrderDateWhere(filters.startDate, filters.endDate)
        : undefined,
  };

  if (customerTerm) {
    where.customer = {
      customerName: {
        contains: customerTerm,
      },
    };
  }

  if (productTerm) {
    where.orderDetails = {
      some: {
        product: {
          OR: [
            {
              productCode: {
                contains: productTerm,
              },
            },
            {
              productName: {
                contains: productTerm,
              },
            },
          ],
        },
      },
    };
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      include: {
        customer: {
          select: {
            customerName: true,
          },
        },
        orderDetails: {
          include: {
            product: {
              select: {
                productName: true,
              },
            },
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      where,
    }),
  ]);

  const items: OrderSearchRow[] = orders.map((order) => {
    const revenue = order.orderDetails.reduce(
      (accumulator, detail) =>
        accumulator + detail.quantityOrdered * toNumber(detail.priceEach),
      0,
    );

    const itemCount = order.orderDetails.reduce(
      (accumulator, detail) => accumulator + detail.quantityOrdered,
      0,
    );

    const primaryProduct = order.orderDetails[0]?.product.productName ?? "N/A";

    return {
      customerName: order.customer.customerName,
      itemCount,
      orderDate: order.orderDate.toISOString().slice(0, 10),
      orderNumber: order.orderNumber,
      primaryProduct,
      revenue,
      status: order.status,
    };
  });

  const totalPages = total === 0 ? 1 : Math.ceil(total / filters.pageSize);

  return {
    items,
    page: filters.page,
    pageSize: filters.pageSize,
    total,
    totalPages,
  };
}
