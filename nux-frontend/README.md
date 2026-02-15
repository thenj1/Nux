# NUX - Inventory Management System

Web application for managing products, raw materials, and production planning. Built as a companion frontend for the NUX NestJS API.

## Overview

NUX is a simple inventory control system designed for managing the relationship between finished products and their raw material components. The application provides:

- Product management (CRUD operations)
- Raw material tracking with stock levels
- Product-material association (bill of materials)
- Production suggestion based on available stock, prioritized by product value

## Tech Stack

**Frontend**
- React 19 with TypeScript
- Vite (build tool)
- React Router (client-side routing)
- Axios (HTTP client)
- Vanilla CSS

**Backend** (separate repository)
- NestJS
- PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18+
- The NUX NestJS backend running on `http://localhost:3000`

### Installation

```bash
cd nux-frontend
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Output will be generated in the `dist/` directory.

## Project Structure

```
src/
  components/
    Layout.tsx        - Main layout with sidebar navigation
    Modal.tsx         - Reusable modal dialog
    Feedback.tsx      - Toast notification for success/error messages
    Loading.tsx       - Loading spinner
  pages/
    Products.tsx      - Products listing, search, create, edit, delete
    RawMaterials.tsx  - Raw materials listing with stock level indicators
    Production.tsx    - Production suggestion calculator
  services/
    api.ts            - API client with typed functions for all endpoints
  App.tsx             - Route definitions
  App.css             - Global styles
  main.tsx            - Application entry point
```

## API Endpoints

The frontend consumes the following backend endpoints:

| Resource | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| Products | GET | `/products` | List all products (paginated) |
| Products | GET | `/products/find/name` | Search products by name |
| Products | POST | `/products/create` | Create a new product |
| Products | PUT | `/products/update/:id` | Update a product |
| Products | DELETE | `/products/delete/:id` | Delete a product |
| Raw Materials | GET | `/raw-materials` | List all raw materials (paginated) |
| Raw Materials | GET | `/raw-materials/find/name` | Search raw materials by name |
| Raw Materials | POST | `/raw-materials/create` | Create a new raw material |
| Raw Materials | PUT | `/raw-materials/update/:id` | Update a raw material |
| Raw Materials | DELETE | `/raw-materials/delete/:id` | Delete a raw material |
| Product Materials | GET | `/product-materials/product/:id` | Get materials for a product |
| Product Materials | POST | `/product-materials/create` | Associate material to product |
| Product Materials | DELETE | `/product-materials/delete/:id` | Remove association |
| Production | GET | `/production/suggestion` | Calculate production suggestion |

## Features

### Products Page
- Full CRUD operations for products (name, code, price)
- Search by product name
- Pagination
- Expandable section to manage raw material associations per product

### Raw Materials Page
- Full CRUD operations for raw materials (name, code, stock)
- Search by material name
- Stock level indicators (low stock warning when stock is 10 or below)
- Pagination

### Production Suggestion
- Calculates which products can be manufactured based on current stock
- Prioritizes products with higher unit value
- Displays estimated total production value

## Responsive Design

The application is responsive and adapts to different screen sizes:
- Desktop: sidebar navigation with table-based data display
- Mobile/Tablet: collapsible menu with card-based layout

## License

This project is for educational purposes.
