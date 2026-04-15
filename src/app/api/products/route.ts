import type { NextRequest } from "next/server";
import { listProducts } from "@/lib/services/products-service";
import { catalogQuerySchema } from "@/lib/domain/validators";
import { ok, parseQuery, serverError } from "@/lib/api/route-utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const query = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = parseQuery(catalogQuerySchema, query);

    if (parsed.error || !parsed.data) {
      return parsed.error as Response;
    }

    const products = await listProducts(parsed.data.q, parsed.data.limit);

    return ok({
      count: products.length,
      products,
    });
  } catch (error: unknown) {
    return serverError(error);
  }
}
