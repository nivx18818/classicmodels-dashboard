import Link from "next/link";
import { OrdersResultsTable } from "@/components/search/orders-results-table";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { orderSearchQuerySchema } from "@/lib/domain/validators";
import { formatNumber } from "@/lib/formatters";
import { listCustomers } from "@/lib/services/customers-service";
import { searchOrders } from "@/lib/services/orders-service";
import { listProducts } from "@/lib/services/products-service";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

interface SearchPageProps {
  searchParams: Promise<SearchParams>;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function pageHref(filters: {
  customer: string;
  endDate?: string;
  pageSize: number;
  product: string;
  startDate?: string;
}): (page: number) => string {
  return (page) => {
    const query = new URLSearchParams();

    if (filters.customer) {
      query.set("customer", filters.customer);
    }

    if (filters.product) {
      query.set("product", filters.product);
    }

    if (filters.startDate) {
      query.set("startDate", filters.startDate);
    }

    if (filters.endDate) {
      query.set("endDate", filters.endDate);
    }

    query.set("pageSize", String(filters.pageSize));
    query.set("page", String(page));

    return `/search?${query.toString()}`;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const parsed = orderSearchQuerySchema.safeParse({
    customer: firstValue(params.customer),
    endDate: firstValue(params.endDate),
    page: firstValue(params.page),
    pageSize: firstValue(params.pageSize),
    product: firstValue(params.product),
    startDate: firstValue(params.startDate),
  });

  const filters = parsed.success
    ? parsed.data
    : orderSearchQuerySchema.parse({});

  const [orders, matchingCustomers, matchingProducts] = await Promise.all([
    searchOrders(filters),
    filters.customer ? listCustomers(filters.customer, 6) : Promise.resolve([]),
    filters.product ? listProducts(filters.product, 6) : Promise.resolve([]),
  ]);

  const makeHref = pageHref(filters);
  const hasPrevious = filters.page > 1;
  const hasNext = filters.page < orders.totalPages;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-sky-100 via-emerald-50 to-amber-100 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Order Search
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Search by customer name, product name or code, and order date range.
          </p>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Update one or more fields and apply to refresh the result set.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/search"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-6"
            method="get"
          >
            <div className="space-y-2 lg:col-span-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="customer"
              >
                Customer
              </label>
              <Input
                defaultValue={filters.customer}
                id="customer"
                name="customer"
                placeholder="Atelier graphique"
              />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="product"
              >
                Product
              </label>
              <Input
                defaultValue={filters.product}
                id="product"
                name="product"
                placeholder="1969 Harley"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="startDate"
              >
                Start Date
              </label>
              <Input
                defaultValue={filters.startDate}
                id="startDate"
                name="startDate"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="endDate"
              >
                End Date
              </label>
              <Input
                defaultValue={filters.endDate}
                id="endDate"
                name="endDate"
                type="date"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                htmlFor="pageSize"
              >
                Page Size
              </label>
              <Input
                defaultValue={String(filters.pageSize)}
                id="pageSize"
                max="100"
                min="1"
                name="pageSize"
                type="number"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                className={cn(
                  buttonVariants({ size: "default", variant: "default" }),
                  "w-full",
                )}
                type="submit"
              >
                Apply
              </button>
              <Link
                className={cn(
                  buttonVariants({ size: "default", variant: "outline" }),
                  "w-full",
                )}
                href="/search"
              >
                Reset
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {(matchingCustomers.length > 0 || matchingProducts.length > 0) && (
        <section className="grid gap-4 md:grid-cols-2">
          {matchingCustomers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Matching Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {matchingCustomers.map((customer) => (
                    <li key={customer.id}>
                      <span className="font-medium text-foreground">
                        {customer.label}
                      </span>
                      {" - "}
                      {customer.meta}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {matchingProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Matching Products</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {matchingProducts.map((product) => (
                    <li key={product.id}>
                      <span className="font-medium text-foreground">
                        {product.label}
                      </span>
                      {" - "}
                      {product.meta}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            Showing page {orders.page} of {orders.totalPages} (
            {formatNumber(orders.total)} records)
          </p>
          <div className="flex items-center gap-2">
            {hasPrevious ? (
              <Link
                className={buttonVariants({ size: "sm", variant: "outline" })}
                href={makeHref(filters.page - 1)}
              >
                Previous
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "pointer-events-none opacity-50",
                )}
              >
                Previous
              </span>
            )}

            {hasNext ? (
              <Link
                className={buttonVariants({ size: "sm", variant: "outline" })}
                href={makeHref(filters.page + 1)}
              >
                Next
              </Link>
            ) : (
              <span
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "pointer-events-none opacity-50",
                )}
              >
                Next
              </span>
            )}
          </div>
        </div>

        <OrdersResultsTable items={orders.items} />
      </section>
    </main>
  );
}
