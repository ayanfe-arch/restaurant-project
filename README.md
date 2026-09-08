
# Restaurant API

This is a Node.js Express REST API for a restaurant ordering and delivery application. The backend supports authentication, restaurant management, food operations, order processing, and delivery tracking.

## Overview

The application is built with a layered architecture:

- `src/routes/` contains the API endpoints
- `src/controllers/` handles request and response logic
- `src/services/` contains business logic
- `src/models/` defines the MongoDB schema models
- `src/middleware/` handles auth, validation, and error handling
- `src/validators/` validates incoming request data
- `test/` contains the project tests

## Features

- User registration and login
- JWT-based authentication
- Restaurant CRUD operations
- Food item management
- Order creation and retrieval
- Order cancellation
- Delivery assignment and updates
- Input validation with Joi
- Environment-based configuration using dotenv

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Joi
- dotenv
- Supertest

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB running locally or a MongoDB connection string

## Installation

1. Clone the repository
2. Navigate into the project folder
3. Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the project root with the following variables:

```env
PORT=3000
DATABASE_URL=mongodb://localhost:27017/restaurant-api
JWT_SECRET=your_secret_key
```

Replace the sample values with your own local configuration.

## Running the Application

Start the API server:

```bash
npm start
```

The server will run on the specified port, or default to `3000` if no port is provided.

## Running Tests

```bash
npm test
```

## Seed Admin User

To create the initial admin account:

```bash
npm run seed:admin
```

## Project Structure

```bash
.
├── app.js
├── server.js
├── package.json
├── .env
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── utils/
├── test/
├── scripts/
└── README.md
```

## API Routes

### Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password/:token`
- `POST /auth/logout`

### Restaurants

- `GET /restaurants`
- `GET /restaurants/:id`
- `POST /restaurants`
- `PATCH /restaurants/:id`
- `DELETE /restaurants/:id`

### Foods

- `GET /foods`
- `GET /foods/:id`
- `POST /foods`
- `PATCH /foods/:id`
- `DELETE /foods/:id`

### Orders

- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `PATCH /orders/:id/cancel`

### Deliveries

- `POST /deliveries/assign/:orderId`
- `PATCH /deliveries/:deliveryId/pickup`
- `PATCH /deliveries/:deliveryId/delivered`

## Authentication

Protected routes require a valid JWT token in the request header:

```http
Authorization: Bearer <token>
```

## Error Handling

The application responds with errors for:

- missing required fields
- invalid input
- unauthorized access
- invalid token
- resource not found
- database connection issues

## Notes

This project is a backend API for a restaurant ordering system and can be extended with additional features such as:

- payment integration
- email notifications
- image uploads
- analytics dashboards
- real-time order tracking

## License

This project is licensed under the ISC License.

## Author

Ayanfeoluwa Ajibola
```

