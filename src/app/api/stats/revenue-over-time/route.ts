import type { NextRequest } from "next/server";
import { statsQuerySchema } from "@/lib/domain/validators";
import { getRevenueOverTime } from "@/lib/services/analytics-service";
import { ok, parseQuery, serverError } from "@/lib/api/route-utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const query = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = parseQuery(statsQuerySchema, query);

    if (parsed.error || !parsed.data) {
      return parsed.error as Response;
    }

    const data = await getRevenueOverTime(parsed.data, parsed.data.interval);

    return ok(data);
  } catch (error: unknown) {
    return serverError(error);
  }
}
