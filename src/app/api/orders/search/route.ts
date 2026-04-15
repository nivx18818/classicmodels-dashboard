import type { NextRequest } from "next/server";
import { orderSearchQuerySchema } from "@/lib/domain/validators";
import { searchOrders } from "@/lib/services/orders-service";
import { ok, parseQuery, serverError } from "@/lib/api/route-utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const query = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = parseQuery(orderSearchQuerySchema, query);

    if (parsed.error || !parsed.data) {
      return parsed.error as Response;
    }

    const data = await searchOrders(parsed.data);

    return ok(data);
  } catch (error: unknown) {
    return serverError(error);
  }
}
