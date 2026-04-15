export function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (isDecimalLike(value)) {
    return value.toNumber();
  }

  return 0;
}

function isDecimalLike(value: unknown): value is { toNumber: () => number } {
  return (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof value.toNumber === "function"
  );
}

export function toOrderDateWhere(
  startDate?: string,
  endDate?: string,
): {
  gte?: Date;
  lte?: Date;
} {
  const where: { gte?: Date; lte?: Date } = {};

  if (startDate) {
    where.gte = new Date(`${startDate}T00:00:00.000Z`);
  }

  if (endDate) {
    where.lte = new Date(`${endDate}T23:59:59.999Z`);
  }

  return where;
}
