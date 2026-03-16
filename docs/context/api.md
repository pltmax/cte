# Project 1 API — API Context

> Auto-generated on 2026-03-16 18:08
> Do not edit manually. Regenerate with: `npm run context:api`

## Summary
- **Version:** 0.1.0
- **Routes:** 5
- **Schemas:** 6

## Routes

### Admin

| Method | Path | Auth | Summary |
|--------|------|------|---------|
| `POST` | `/api/v1/admin/users/{user_id}/premium` | 🌐 | Grant premium role to a user |
| `POST` | `/api/v1/admin/users/{user_id}/credits` | 🌐 | Add credits to a user's account |

### Default

| Method | Path | Auth | Summary |
|--------|------|------|---------|
| `GET` | `/` | 🌐 | Root |
| `GET` | `/health` | 🌐 | Health |

### Stripe

| Method | Path | Auth | Summary |
|--------|------|------|---------|
| `POST` | `/api/v1/stripe/checkout` | 🌐 | Create Checkout Session |

## Pydantic Schemas

### `AddCreditsRequest`

| Field | Type | Required |
|-------|------|----------|
| `amount` | `integer` | ✅ |

### `CheckoutRequest`

| Field | Type | Required |
|-------|------|----------|
| `type` | `string` | ✅ |

### `CheckoutResponse`

| Field | Type | Required |
|-------|------|----------|
| `url` | `string` | ✅ |

### `HTTPValidationError`

| Field | Type | Required |
|-------|------|----------|
| `detail` | `array` | — |

### `MessageResponse`

| Field | Type | Required |
|-------|------|----------|
| `message` | `string` | ✅ |

### `ValidationError`

| Field | Type | Required |
|-------|------|----------|
| `loc` | `array` | ✅ |
| `msg` | `string` | ✅ |
| `type` | `string` | ✅ |
| `input` | `object` | — |
| `ctx` | `object` | — |

