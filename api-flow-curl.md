# API Flow Testing (cURL)

This document provides cURL commands to test the full flow of your NestJS Stripe mock integration, including authentication. All endpoints except the webhook require a JWT token.

---

## 1. User Signup

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword",
    "name": "Test User"
  }'
```

**Response:**
```json
{
  "token": "<JWT_TOKEN>",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

---

## 2. User Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

**Response:**
```json
{
  "token": "<JWT_TOKEN>",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

---

## 3. Create Checkout Session

```bash
curl -X POST http://localhost:3000/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "userId": "<USER_ID>",
    "planId": "basic",
    "line_items": [{"price": "price_123", "quantity": 1}],
    "mode": "payment",
    "success_url": "https://example.com/success",
    "cancel_url": "https://example.com/cancel",
    "metadata": { "userId": "<USER_ID>", "planId": "basic" }
  }'
```

---

## 4. Simulate Stripe Webhook (No Auth Required)

```bash
curl -X POST http://localhost:3000/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u",
        "metadata": {
          "userId": "<USER_ID>",
          "planId": "basic"
        }
      }
    }
  }'
```

---

## 5. Get User's Current Subscription

```bash
curl -X GET http://localhost:3000/subscription \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 6. Cancel User's Subscription

```bash
curl -X POST http://localhost:3000/subscription/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

**Notes:**
- Replace `<JWT_TOKEN>` with the token received from signup/login.
- Replace `<USER_ID>` with the user's ID from signup/login response.
- The webhook does not require authentication.
