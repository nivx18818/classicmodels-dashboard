import prisma from "@/lib/prisma";
import type { CatalogItem } from "@/lib/domain/types";

export async function listCustomers(
  search: string,
  limit: number,
): Promise<CatalogItem[]> {
  const term = search.trim();

  const customers = await prisma.customer.findMany({
    orderBy: {
      customerName: "asc",
    },
    select: {
      city: true,
      country: true,
      customerName: true,
      customerNumber: true,
    },
    take: limit,
    where: term
      ? {
          customerName: {
            contains: term,
          },
        }
      : undefined,
  });

  return customers.map((customer) => ({
    id: String(customer.customerNumber),
    label: customer.customerName,
    meta: `${customer.city}, ${customer.country}`,
  }));
}
