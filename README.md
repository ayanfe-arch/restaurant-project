# Restaurant Project

A REST API for managing restaurants, menu items, customer orders, users, and deliveries.

## Features

- User registration and login with JWT authentication
- Password reset flow
- Role-based access control for customers, restaurant owners, riders, and administrators
- Restaurant creation and management
- Menu item creation and management
- Order creation, retrieval, and cancellation
- Delivery assignment and delivery-status updates
- Input validation and error handling
- Automated API tests

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Joi
- Supertest

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file in the project root and add:

```env
PORT=3000
DATABASE_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_NAME=admin_name
ADMIN_EMAIL=admin_email@example.com
ADMIN_PASSWORD=admin_password
```

## Run the Project

```bash
npm start
```

The API will run on:

```text
http://localhost:3000
```

## Create the First Admin

```bash
npm run seed:admin
```

## Run Tests

Set `TEST_DATABASE_URL` to a separate MongoDB database for testing, then run:

```bash
npm test
```

## API Routes

| Route | Purpose |
| --- | --- |
| `/auth` | Registration, login, logout, and password reset |
| `/restaurants` | Restaurant management |
| `/foods` | Menu-item management |
| `/orders` | Order creation and management |
| `/users` | User and profile management |
| `/deliveries` | Delivery assignment and status updates |

Most protected routes require an authorization header:

```text
Authorization: Bearer <token>
```

## User Roles

- `customer`
- `owner`
- `rider`
- `admin`


