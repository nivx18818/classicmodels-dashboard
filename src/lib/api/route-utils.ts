import { z } from "zod";

export function badRequest(details: unknown): Response {
  return Response.json(
    {
      error: {
        details,
        message: "Invalid query parameters.",
      },
    },
    { status: 400 },
  );
}

export function ok<T>(data: T): Response {
  return Response.json({ data });
}

export function parseQuery<T>(
  schema: z.ZodType<T>,
  query: Record<string, string>,
): {
  data?: T;
  error?: Response;
} {
  const parsed = schema.safeParse(query);

  if (!parsed.success) {
    return {
      error: badRequest(parsed.error.flatten()),
    };
  }

  return {
    data: parsed.data,
  };
}

export function serverError(error: unknown): Response {
  console.error(error);

  return Response.json(
    {
      error: {
        message: "Unexpected server error.",
      },
    },
    {
      status: 500,
    },
  );
}
