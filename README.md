# Nux

Nux is a full-stack manufacturing management system designed to handle products, raw materials, inventory control, and production workflows. The application provides a REST API built with NestJS and a modern web interface built with React.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [License](#license)

---

## Architecture

Nux follows a monorepo structure with two independent applications:

```
nux/
├── nux-nestjs/      # REST API (Backend)
└── nux-frontend/    # Web Interface (Frontend)
```

The backend exposes a RESTful API consumed by the frontend via HTTP requests. Authentication is handled through JWT tokens, and data persistence is managed with PostgreSQL through Prisma ORM.

---

## Tech Stack

### Backend

| Technology    | Purpose                        |
|---------------|--------------------------------|
| NestJS        | Application framework          |
| TypeScript    | Language                       |
| Prisma        | ORM and database migrations    |
| PostgreSQL    | Relational database            |
| Passport      | Authentication middleware      |
| JWT           | Token-based authentication     |
| bcrypt        | Password hashing               |
| class-validator | Request validation           |
| Jest          | Unit and e2e testing           |

### Frontend

| Technology      | Purpose                      |
|-----------------|------------------------------|
| React 19        | UI library                   |
| TypeScript      | Language                     |
| Vite            | Build tool and dev server    |
| React Router    | Client-side routing          |
| Axios           | HTTP client                  |

---

## Project Structure

### Backend (`nux-nestjs/`)

```
nux-nestjs/
├── prisma/
│   ├── migrations/          # Database migration files
│   └── schema.prisma        # Database schema definition
├── src/
│   ├── global/              # Global filters and interceptors
│   ├── prisma-config/       # Prisma client configuration
│   ├── users/               # User registration and authentication
│   ├── products/            # Product management (CRUD)
│   ├── raw-materials/       # Raw material inventory (CRUD)
│   ├── product-materials/   # Product-material relationships
│   ├── production/          # Production workflow logic
│   ├── app.module.ts        # Root application module
│   └── main.ts              # Application entry point
└── test/                    # End-to-end tests
```

Each module follows the NestJS convention: `controller`, `service`, `repository`, `module`, and `dto` layers.

### Frontend (`nux-frontend/`)

```
nux-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Application shell and navigation
│   │   ├── Modal.tsx        # Modal dialog component
│   │   ├── Loading.tsx      # Loading indicator
│   │   └── Feedback.tsx     # User feedback notifications
│   ├── pages/
│   │   ├── Products.tsx     # Product management page
│   │   ├── RawMaterials.tsx # Raw materials management page
│   │   └── Production.tsx   # Production workflow page
│   ├── services/
│   │   └── api.ts           # Axios API client configuration
│   ├── App.tsx              # Root component with routing
│   └── main.tsx             # Application entry point
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

---

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

```bash
cd nux-nestjs
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (see [Environment Variables](#environment-variables)).

4. Generate the Prisma client:

```bash
npx prisma generate
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd nux-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the `nux-nestjs/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="your-jwt-secret-key"
```

| Variable       | Description                              |
|----------------|------------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string             |
| `JWT_SECRET`   | Secret key used to sign JWT tokens       |

---

## API Endpoints

### Authentication

| Method | Endpoint          | Description              | Auth |
|--------|-------------------|--------------------------|------|
| POST   | `/users/register` | Register a new user      | No   |
| POST   | `/users/login`    | Authenticate and get JWT | No   |

### Products

| Method | Endpoint        | Description             | Auth |
|--------|-----------------|-------------------------|------|
| GET    | `/products`     | List all products       | Yes  |
| GET    | `/products/:id` | Get a product by ID     | Yes  |
| POST   | `/products`     | Create a new product    | Yes  |
| PATCH  | `/products/:id` | Update a product        | Yes  |
| DELETE | `/products/:id` | Delete a product        | Yes  |

### Raw Materials

| Method | Endpoint             | Description                 | Auth |
|--------|----------------------|-----------------------------|------|
| GET    | `/raw-materials`     | List all raw materials      | Yes  |
| GET    | `/raw-materials/:id` | Get a raw material by ID    | Yes  |
| POST   | `/raw-materials`     | Create a new raw material   | Yes  |
| PATCH  | `/raw-materials/:id` | Update a raw material       | Yes  |
| DELETE | `/raw-materials/:id` | Delete a raw material       | Yes  |

### Product Materials

| Method | Endpoint                | Description                              | Auth |
|--------|-------------------------|------------------------------------------|------|
| POST   | `/product-materials`    | Link a raw material to a product         | Yes  |
| DELETE | `/product-materials/:id`| Remove a product-material relationship   | Yes  |

### Production

| Method | Endpoint             | Description                              | Auth |
|--------|----------------------|------------------------------------------|------|
| POST   | `/production`        | Execute a production run (deducts stock) | Yes  |

All authenticated endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## Database Schema

```
User
├── id         (Int, PK, auto-increment)
├── name       (String)
├── email      (String, unique)
└── password   (String, hashed)

Product
├── id         (Int, PK, auto-increment)
├── name       (String)
├── cod        (String, unique)
├── price      (Float)
└── materials  (ProductMaterial[])

RawMaterial
├── id         (Int, PK, auto-increment)
├── name       (String)
├── cod        (String, unique)
├── stock      (Int)
└── products   (ProductMaterial[])

ProductMaterial
├── id              (Int, PK, auto-increment)
├── quantity        (Int)
├── productId       (Int, FK -> Product)
├── rawMaterialId   (Int, FK -> RawMaterial)
└── (productId, rawMaterialId) UNIQUE
```

---

## Available Scripts

### Backend (`nux-nestjs/`)

| Command              | Description                          |
|----------------------|--------------------------------------|
| `npm run start:dev`  | Start in development mode (watch)    |
| `npm run start:prod` | Start in production mode             |
| `npm run build`      | Compile the project                  |
| `npm run test`       | Run unit tests                       |
| `npm run test:e2e`   | Run end-to-end tests                 |
| `npm run lint`       | Run ESLint                           |
| `npm run format`     | Format code with Prettier            |

### Frontend (`nux-frontend/`)

| Command            | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start Vite dev server                |
| `npm run build`    | Build for production                 |
| `npm run preview`  | Preview production build             |
| `npm run lint`     | Run ESLint                           |

---

## License

This project is unlicensed and intended for educational purposes.
