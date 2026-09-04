# API Design

## What is API Design?

An **API (Application Programming Interface)** is how the frontend talks to the backend. It's a contract that specifies:
- What endpoints exist?
- What data do they accept (input)?
- What data do they return (output)?
- What HTTP methods do they use?
- What happens if something goes wrong?

For DevOps Galaxy, the API is how the React dashboard gets service and pipeline data.

---

## API Philosophy: REST

We're using **REST (Representational State Transfer)** for Phase 1.

### REST Basics

- **Resources** — Services, pipelines, dependencies are resources
- **HTTP Methods** — GET (read), POST (create), PUT (update), DELETE (delete)
- **URLs** — Resources are identified by paths: `/api/services/api-service`
- **JSON** — Data is formatted as JSON
- **Status Codes** — HTTP status codes indicate success/failure

### Example REST Principles

```
GET  /api/services               — Get all services (read-only)
GET  /api/services/:id           — Get one service
GET  /api/services/:id/pipeline  — Get pipeline details
GET  /api/dependencies           — Get dependency graph
POST /api/refresh                — Trigger immediate data refresh
```

In Phase 1, we're read-only (no POST/PUT/DELETE except refresh).

---

## API Endpoints

### 1. GET /api/services

**Purpose:** Get a list of all services with their current status.

**Request:**
```
GET /api/services
```

**Response (200 OK):**
```json
{
  "services": [
    {
      "id": "frontend-service",
      "name": "Frontend Service",
      "description": "React web application",
      "team": "Frontend Team",
      "repository": "https://github.com/Shai-Shargal/frontend-service",
      "documentation": "https://docs.example.com/frontend",
      "dataSource": "github",
      "status": "green",
      "lastUpdated": "2026-09-04T10:35:45Z",
      "lastCommit": {
        "hash": "abc123",
        "message": "Add dashboard page"
      }
    },
    {
      "id": "api-service",
      "name": "API Service",
      "description": "Backend REST API",
      "team": "Backend Team",
      "repository": "https://github.com/Shai-Shargal/api-service",
      "documentation": "https://docs.example.com/api",
      "dataSource": "github",
      "status": "green",
      "lastUpdated": "2026-09-04T10:35:45Z",
      "lastCommit": {
        "hash": "def456",
        "message": "Fix API response parsing"
      }
    },
    {
      "id": "payment-service",
      "name": "Payment Service",
      "description": "Payment processing",
      "team": "Payments Team",
      "repository": "https://github.com/Shai-Shargal/payment-service",
      "documentation": "https://docs.example.com/payments",
      "dataSource": "jenkins",
      "status": "red",
      "lastUpdated": "2026-09-04T10:30:15Z",
      "lastCommit": {
        "hash": "ghi789",
        "message": "Add Stripe integration"
      }
    }
  ],
  "count": 3,
  "timestamp": "2026-09-04T10:35:50Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `services` | Array | Array of service objects |
| `count` | Integer | Number of services |
| `timestamp` | ISO-8601 | When this data was generated |

**Each Service Contains:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique service identifier |
| `name` | String | Display name |
| `description` | String | What does it do? |
| `team` | String | Owning team |
| `repository` | String | Git repo URL |
| `documentation` | String | Docs URL |
| `dataSource` | String | Where data comes from (`"github"`, `"jenkins"`) |
| `status` | String | Current status (`"green"`, `"orange"`, `"red"`) |
| `lastUpdated` | ISO-8601 | When we last fetched status |
| `lastCommit` | Object | Latest commit info |

**Use Case:** Populate the main dashboard with all planets.

---

### 2. GET /api/services/:id

**Purpose:** Get detailed information about one specific service.

**Request:**
```
GET /api/services/api-service
```

**Response (200 OK):**
```json
{
  "service": {
    "id": "api-service",
    "name": "API Service",
    "description": "Backend REST API serving frontend and payment service",
    "team": "Backend Team",
    "repository": "https://github.com/Shai-Shargal/api-service",
    "documentation": "https://docs.example.com/api",
    "dataSource": "github",
    "dataSourceId": "Shai-Shargal/api-service",
    "dependsOn": ["database-service", "cache-service"],
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-09-04T15:30:00Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "error": "Service not found",
  "statusCode": 404,
  "serviceId": "unknown-service"
}
```

**Use Case:** Get service metadata when user clicks on a planet.

---

### 3. GET /api/services/:id/pipeline

**Purpose:** Get detailed pipeline status for one service.

**Request:**
```
GET /api/services/api-service/pipeline
```

**Response (200 OK):**
```json
{
  "pipeline": {
    "serviceId": "api-service",
    "status": "green",
    "stages": {
      "build": {
        "status": "passed",
        "startedAt": "2026-09-04T10:00:00Z",
        "completedAt": "2026-09-04T10:05:30Z",
        "duration": 330,
        "url": "https://github.com/Shai-Shargal/api-service/actions/runs/12345"
      },
      "test": {
        "status": "passed",
        "startedAt": "2026-09-04T10:05:30Z",
        "completedAt": "2026-09-04T10:15:45Z",
        "duration": 615,
        "url": "https://github.com/Shai-Shargal/api-service/actions/runs/12345"
      },
      "deploy": {
        "status": "passed",
        "startedAt": "2026-09-04T10:15:45Z",
        "completedAt": "2026-09-04T10:25:00Z",
        "duration": 555,
        "url": "https://github.com/Shai-Shargal/api-service/actions/runs/12345"
      }
    },
    "lastCommit": {
      "hash": "abc123def456",
      "message": "Fix API response parsing",
      "author": "Alice Chen",
      "authorEmail": "alice@example.com",
      "url": "https://github.com/Shai-Shargal/api-service/commit/abc123def456",
      "pushedAt": "2026-09-04T09:55:00Z"
    },
    "runNumber": 12345,
    "branch": "main",
    "triggeredBy": "Alice Chen",
    "triggeredAt": "2026-09-04T09:55:30Z",
    "completedAt": "2026-09-04T10:25:00Z",
    "totalDuration": 1500,
    "fetchedAt": "2026-09-04T10:35:45Z"
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"green"`, `"orange"`, `"red"` |
| `stages` | Object | `build`, `test`, `deploy` with status and timing |
| `lastCommit` | Object | Git commit info |
| `runNumber` | Integer | Pipeline run ID |
| `branch` | String | Git branch being built |
| `triggeredBy` | String | Who triggered this run? |
| `triggeredAt` | ISO-8601 | When did the pipeline start? |
| `completedAt` | ISO-8601 | When did it finish? (null if running) |
| `totalDuration` | Integer | Total duration in seconds |
| `fetchedAt` | ISO-8601 | When did we last fetch this data? |

**Response (404 Not Found):**
```json
{
  "error": "No pipeline data available",
  "statusCode": 404,
  "serviceId": "api-service",
  "reason": "Service may not have CI/CD configured"
}
```

**Use Case:** Show detailed pipeline info in the service detail panel when user clicks a planet.

---

### 4. GET /api/dependencies

**Purpose:** Get the dependency graph (which services depend on which).

**Request:**
```
GET /api/dependencies
```

**Response (200 OK):**
```json
{
  "dependencies": [
    {
      "from": "frontend-service",
      "to": "api-service",
      "type": "required",
      "critical": true,
      "description": "Frontend calls API endpoints"
    },
    {
      "from": "api-service",
      "to": "database-service",
      "type": "required",
      "critical": true,
      "description": "API requires database for data storage"
    },
    {
      "from": "api-service",
      "to": "cache-service",
      "type": "optional",
      "critical": false,
      "description": "Cache improves performance but API works without it"
    },
    {
      "from": "payment-service",
      "to": "api-service",
      "type": "required",
      "critical": true,
      "description": "Payment service uses API for transactions"
    }
  ],
  "count": 4,
  "timestamp": "2026-09-04T10:35:50Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `dependencies` | Array | Array of dependency objects |
| `count` | Integer | Number of dependencies |
| `timestamp` | ISO-8601 | When this was generated |

**Each Dependency Contains:**

| Field | Type | Description |
|-------|------|-------------|
| `from` | String | Service that depends on something |
| `to` | String | Service being depended on |
| `type` | String | `"required"`, `"optional"`, `"optional-fallback"` |
| `critical` | Boolean | Can service function without this? |
| `description` | String | Why this dependency exists |

**Use Case:** Draw connections between planets in the galaxy visualization.

---

### 5. POST /api/refresh

**Purpose:** Trigger an immediate refresh of all pipeline data.

**Request:**
```
POST /api/refresh
Content-Type: application/json

{}
```

**Response (202 Accepted):**
```json
{
  "message": "Refresh started",
  "statusCode": 202,
  "refreshStartedAt": "2026-09-04T10:40:00Z",
  "expectedCompletionAt": "2026-09-04T10:40:05Z"
}
```

**Response (503 Service Unavailable):**
```json
{
  "error": "Refresh already in progress",
  "statusCode": 503,
  "message": "Please wait for current refresh to complete"
}
```

**Use Case:** Let users manually refresh the dashboard if they want fresh data immediately (instead of waiting for next auto-refresh).

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| `200` | Success | GET /api/services worked |
| `202` | Accepted (async) | POST /api/refresh started |
| `400` | Bad Request | Invalid query parameters |
| `404` | Not Found | GET /api/services/unknown-id |
| `500` | Server Error | Unexpected error |
| `503` | Service Unavailable | External API is down, we have no cached data |

### Error Response Format

All errors follow this format:

```json
{
  "error": "Human-readable error message",
  "statusCode": 404,
  "details": {
    "reason": "Additional context"
  },
  "timestamp": "2026-09-04T10:35:50Z"
}
```

### Example: GitHub API Down

```
GET /api/services
Response: 503

{
  "error": "Unable to fetch pipeline data",
  "statusCode": 503,
  "details": {
    "reason": "GitHub API temporarily unavailable",
    "affectedServices": ["frontend-service", "api-service"],
    "cachedDataAge": 300
  },
  "timestamp": "2026-09-04T10:35:50Z"
}
```

**Message:** "Some data may be stale (cached 5 minutes ago)"

---

## Query Parameters

### GET /api/services (optional filters)

```
GET /api/services?status=red
GET /api/services?team=Backend%20Team
GET /api/services?dataSource=github
```

**Supported Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `status` | String | Filter by status | `?status=red` |
| `team` | String | Filter by team | `?team=Backend Team` |
| `dataSource` | String | Filter by CI/CD platform | `?dataSource=github` |

**Response (same format, but filtered):**
```json
{
  "services": [
    // only red services
  ],
  "count": 1,
  "filter": { "status": "red" },
  "timestamp": "2026-09-04T10:35:50Z"
}
```

---

## Rate Limiting (Future)

In Phase 2+, we'll add rate limiting to prevent abuse:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 2026-09-04T11:00:00Z
```

For now (Phase 1), no rate limiting.

---

## Response Caching Strategy

### What Gets Cached?

- **GET /api/services** — Cached for 30 seconds (auto-refresh interval)
- **GET /api/services/:id** — Cached for 30 seconds
- **GET /api/services/:id/pipeline** — Cached for 30 seconds
- **GET /api/dependencies** — Cached for 5 minutes (rarely changes)

### Cache Headers

Responses include cache headers:

```
GET /api/services

HTTP/1.1 200 OK
Cache-Control: max-age=30
X-Cache: HIT (from memory)
X-Fetched-At: 2026-09-04T10:35:45Z
```

**Cache-Control Options:**
- `max-age=30` — Cache for 30 seconds
- `no-cache` — Client must validate freshness
- `no-store` — Don't cache

---

## API Documentation Format

Each endpoint is documented with:

```
GET /api/services

Purpose: Get list of all services with current status

Request:
  Query Parameters: (optional) status, team, dataSource

Response:
  Status: 200 OK
  Body: { services: [...], count: N, timestamp: "..." }

Use Case: Populate the main dashboard
```

---

## Testing the API

### With curl

```bash
# Get all services
curl http://localhost:3000/api/services

# Get one service
curl http://localhost:3000/api/services/api-service

# Get pipeline details
curl http://localhost:3000/api/services/api-service/pipeline

# Get dependencies
curl http://localhost:3000/api/dependencies

# Trigger refresh
curl -X POST http://localhost:3000/api/refresh
```

### With JavaScript (fetch)

```javascript
// Get all services
const services = await fetch('/api/services').then(r => r.json());

// Get pipeline
const pipeline = await fetch('/api/services/api-service/pipeline')
  .then(r => r.json());
```

---

## Evolution: Phase 2+

### Phase 2: WebSocket for Real-Time Updates

Instead of polling every 30 seconds:

```javascript
// Frontend
const socket = new WebSocket('ws://localhost:3000/ws');
socket.on('pipelineUpdate', (data) => {
  // Service status changed
  updateDashboard(data);
});
```

```javascript
// Backend
wss.broadcast({
  type: 'pipelineUpdate',
  serviceId: 'api-service',
  newStatus: 'green'
});
```

### Phase 3: GraphQL

An alternative to REST that's more flexible:

```graphql
query GetDashboard {
  services {
    id
    name
    status
    pipeline {
      stages {
        build { status duration }
        test { status duration }
      }
    }
    dependencies {
      to { id name }
      type
    }
  }
}
```

---

## Summary: API Endpoints

| Method | Endpoint | Purpose | Returns |
|--------|----------|---------|---------|
| `GET` | `/api/services` | List all services | All services with status |
| `GET` | `/api/services/:id` | Get one service | Service metadata |
| `GET` | `/api/services/:id/pipeline` | Get pipeline details | Full pipeline status |
| `GET` | `/api/dependencies` | Get dependency graph | All dependencies |
| `POST` | `/api/refresh` | Trigger immediate refresh | Refresh started confirmation |

---

**Last Updated:** 2026-09-04

