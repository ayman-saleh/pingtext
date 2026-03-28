# PingText

**Simple SMS API for developers.** Send text messages in 3 lines of code.

## Quick Start

```bash
npm install pingtext
```

```typescript
import { PingText } from "pingtext";

const pt = new PingText("pt_your_api_key");

await pt.messages.send({
  to: "+15551234567",
  body: "Your order has shipped!",
});
```

## API Reference

Base URL: `https://api.pingtext.dev`

### Authentication

All requests require an API key passed as a Bearer token:

```
Authorization: Bearer pt_your_api_key
```

Get your API key at [pingtext.dev/dashboard](https://pingtext.dev/dashboard).

### Send a Message

```
POST /v1/messages
```

**Request body:**

| Field | Type   | Required | Description                          |
|-------|--------|----------|--------------------------------------|
| to    | string | yes      | Recipient phone number (E.164)       |
| body  | string | yes      | Message content (max 1600 chars)     |
| from  | string | no       | Sender number (defaults to pool)     |

**Response:**

```json
{
  "id": "msg_abc123",
  "status": "queued",
  "to": "+15551234567",
  "body": "Your order has shipped!",
  "createdAt": "2026-03-28T12:00:00Z"
}
```

### Get Message Status

```
GET /v1/messages/:id
```

**Response:**

```json
{
  "id": "msg_abc123",
  "status": "delivered",
  "to": "+15551234567",
  "body": "Your order has shipped!",
  "createdAt": "2026-03-28T12:00:00Z",
  "deliveredAt": "2026-03-28T12:00:02Z"
}
```

**Status values:** `queued`, `sent`, `delivered`, `failed`

### Error Handling

| Status | Meaning                        |
|--------|--------------------------------|
| 200    | Success                        |
| 400    | Bad request (invalid phone)    |
| 401    | Invalid API key                |
| 429    | Rate limited (60 req/min)      |
| 500    | Server error                   |

```json
{
  "error": {
    "code": "invalid_phone",
    "message": "Phone number must be in E.164 format"
  }
}
```

## Best Practices

1. Always use E.164 format for phone numbers: `+15551234567`
2. Handle rate limits with exponential backoff
3. Store the message ID to check delivery status later
4. Keep API keys in environment variables, never in code
5. Use the SDK instead of raw HTTP -- it handles retries and validation

## License

MIT
