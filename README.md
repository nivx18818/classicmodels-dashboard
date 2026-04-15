# ClassicModels Dashboard

Fullstack analytics web application built with Next.js App Router + Prisma for the ClassicModels database.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn-style UI components
- Prisma ORM (MySQL datasource)
- Recharts for data visualization

## Features

- RESTful APIs for customers, products, order search, and analytics
- Search by customer, product, and time range
- Pivot-like statistics using SQL aggregation (`GROUP BY`, `SUM`, `COUNT`)
- Dashboard visualizations:
  - Revenue over time
  - Top customers
  - Best-selling products
- Clean architecture with separation between:
  - API routes (`src/app/api`)
  - Service layer (`src/lib/services`)
  - UI pages/components (`src/app`, `src/components`)

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Update `DATABASE_URL` to point to your MySQL ClassicModels database.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run the app:

   ```bash
   npm run dev
   ```

## Project Structure

```text
src/
	app/
		api/
			customers/route.ts
			products/route.ts
			orders/search/route.ts
			stats/
				dashboard/route.ts
				revenue-over-time/route.ts
				top-customers/route.ts
				best-selling-products/route.ts
		search/page.tsx
		page.tsx

	components/
		dashboard/
		search/
		ui/

	lib/
		api/
		domain/
		services/
		prisma.ts
```

## API Endpoints

### Catalog

- `GET /api/customers?q=atelier&limit=10`
- `GET /api/products?q=harley&limit=10`

### Search

- `GET /api/orders/search?customer=atelier&product=harley&startDate=2003-01-01&endDate=2003-12-31&page=1&pageSize=20`

### Statistics

- `GET /api/stats/dashboard?startDate=2003-01-01&endDate=2005-12-31&interval=month&limit=10`
- `GET /api/stats/revenue-over-time?startDate=2003-01-01&endDate=2005-12-31&interval=month`
- `GET /api/stats/top-customers?startDate=2003-01-01&endDate=2005-12-31&limit=10`
- `GET /api/stats/best-selling-products?startDate=2003-01-01&endDate=2005-12-31&limit=10`

## Example Aggregation Queries

Revenue over time:

```sql
SELECT
	DATE_FORMAT(o.orderDate, '%Y-%m') AS period,
	SUM(od.quantityOrdered * od.priceEach) AS revenue,
	COUNT(DISTINCT o.orderNumber) AS orders
FROM orders o
INNER JOIN orderdetails od ON od.orderNumber = o.orderNumber
GROUP BY period
ORDER BY period;
```

Top customers by revenue:

```sql
SELECT
	c.customerNumber,
	c.customerName,
	SUM(od.quantityOrdered * od.priceEach) AS revenue
FROM customers c
INNER JOIN orders o ON o.customerNumber = c.customerNumber
INNER JOIN orderdetails od ON od.orderNumber = o.orderNumber
GROUP BY c.customerNumber, c.customerName
ORDER BY revenue DESC
LIMIT 10;
```

Best-selling products:

```sql
SELECT
	p.productCode,
	p.productName,
	SUM(od.quantityOrdered) AS unitsSold,
	SUM(od.quantityOrdered * od.priceEach) AS revenue
FROM products p
INNER JOIN orderdetails od ON od.productCode = p.productCode
GROUP BY p.productCode, p.productName
ORDER BY unitsSold DESC, revenue DESC
LIMIT 10;
```
