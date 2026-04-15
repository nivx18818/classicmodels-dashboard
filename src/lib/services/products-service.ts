import prisma from "@/lib/prisma";
import type { CatalogItem } from "@/lib/domain/types";

export async function listProducts(
  search: string,
  limit: number,
): Promise<CatalogItem[]> {
  const term = search.trim();

  const products = await prisma.product.findMany({
    orderBy: {
      productName: "asc",
    },
    select: {
      productCode: true,
      productLine: true,
      productName: true,
    },
    take: limit,
    where: term
      ? {
          OR: [
            {
              productCode: {
                contains: term,
              },
            },
            {
              productName: {
                contains: term,
              },
            },
          ],
        }
      : undefined,
  });

  return products.map((product) => ({
    id: product.productCode,
    label: product.productName,
    meta: product.productLine,
  }));
}
