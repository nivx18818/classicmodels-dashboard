import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OrderSearchRow } from "@/lib/domain/types";
import { formatCurrency, formatNumber } from "@/lib/formatters";

interface OrdersResultsTableProps {
  items: OrderSearchRow[];
}

export function OrdersResultsTable({ items }: OrdersResultsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        No orders found with the selected filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Primary Product</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.orderNumber}>
              <TableCell className="font-medium">{item.orderNumber}</TableCell>
              <TableCell>{item.orderDate}</TableCell>
              <TableCell>{item.customerName}</TableCell>
              <TableCell>{item.primaryProduct}</TableCell>
              <TableCell className="text-right">
                {formatNumber(item.itemCount)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.revenue)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={item.status === "Shipped" ? "default" : "secondary"}
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
