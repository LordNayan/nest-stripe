# Nest Stripe API

This is a NestJS-based subscription and payments API with Stripe integration, JWT authentication, RBAC, and Swagger documentation.

## Features
- User signup & login (JWT auth)
- Stripe payments & subscriptions
- Role-based access control (RBAC)
- Global error handling & validation
- API documentation via Swagger (`/api`)

## Prerequisite: MongoDB Setup
You need a running MongoDB instance. You can either:

- **Install MongoDB Community Edition**: [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
- **Or use Docker Compose**:
  ```bash
  docker compose up -d
  ```

## Getting Started
1. Install dependencies:
	```bash
	npm install
	```
2. Set environment variables (e.g. `JWT_SECRET`, `MONGODB_URI`).
    ```bash
    cp .env.example .env
    ```
3. Run the app:
	```bash
	npm run start:dev
	```
4. Access API docs at [http://localhost:3000/api](http://localhost:3000/api)

## Testing
Run all tests:
```bash
npm run test
npm run test:e2e
```

## Postman Collection

A Postman collection for testing all endpoints is available at the project root: [`Nest Stripe.postman_collection.json`](./postman-collection.json).