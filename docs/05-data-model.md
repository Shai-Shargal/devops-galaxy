# Data Model

## What is a Data Model?

A **data model** defines the structure and relationships of information in your system. It answers:
- What information do we store?
- How is it organized?
- What fields does each object have?
- How do objects relate to each other?

The data model is the foundation for both the API and the database. It's the "contract" that every part of the system agrees on.

---

## Core Concepts

DevOps Galaxy manages three main types of objects:

1. **Services** — The applications we're tracking
2. **Pipeline Runs** — Individual CI/CD pipeline executions
3. **Dependencies** — Relationships between services

Let's define each one.

---

## 1. Service

A **Service** is an application we're tracking. Example: api-service, frontend-service, payment-service.

### Service Metadata

This is static information (doesn't change often).

```json
{
  "id": "api-service",
  "name": "API Service",
  "description": "Backend REST API",
  "team": "Backend Team",
  "repository": "https://github.com/Shai-Shargal/api-service",
  "documentation": "https://docs.example.com/api-service",
  "dataSource": "github",
  "dataSourceId": "Shai-Shargal/api-service",
  "dependsOn": ["database", "cache"],
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-09-02T15:30:00Z"
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique identifier | `"api-service"` |
| `name` | String | Display name | `"API Service"` |
| `description` | String | What does this service do? | `"Backend REST API"` |
| `team` | String | Which team owns it? | `"Backend Team"` |
| `repository` | String | Git repository URL | `"https://github.com/..."` |
| `documentation` | String | Link to docs | `"https://docs.example.com/..."` |
| `dataSource` | String | CI/CD platform | `"github"` or `"jenkins"` |
| `dataSourceId` | String | ID in that platform | `"Shai-Shargal/api-service"` (for GitHub) |
| `dependsOn` | Array | Service dependencies | `["database", "cache"]` |
| `createdAt` | ISO-8601 timestamp | When was it added to DevOps Galaxy? | `"2026-01-15T10:00:00Z"` |
| `updatedAt` | ISO-8601 timestamp | Last update | `"2026-09-02T15:30:00Z"` |

### Why These Fields?

- **id, name, description** — Basic identification
- **team, documentation** — Help users understand the service
- **repository** — Link to the source code
- **dataSource, dataSourceId** — Tell us where to fetch pipeline data
- **dependsOn** — Critical for showing the dependency graph
- **timestamps** — Track when metadata changes

---

## 2. Pipeline Status

A **Pipeline Status** is the current state of a service's CI/CD pipeline.

### Status Object

This is dynamic information (changes frequently).

```json
{
  "serviceId": "api-service",
  "status": "green",
  "stages": {
    "build": {
      "status": "passed",
      "startedAt": "2026-09-02T10:00:00Z",
      "completedAt": "2026-09-02T10:05:30Z",
      "duration": 330,
      "url": "https://github.com/Shai-Shargal/api-service/actions/runs/12345"
    },
    "test": {
      "status": "passed",
      "startedAt": "2026-09-02T10:05:30Z",
      "completedAt": "2026-09-02T10:15:45Z",
      "duration": 615,
      "url": "https://github.com/Shai-Shargal/api-service/actions/runs/12345"
    },
    "deploy": {
      "status": "passed",
      "startedAt": "2026-09-02T10:15:45Z",
      "completedAt": "2026-09-02T10:25:00Z",
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
    "pushedAt": "2026-09-02T09:55:00Z"
  },
  "runNumber": 12345,
  "branch": "main",
  "triggeredBy": "Alice Chen",
  "triggeredAt": "2026-09-02T09:55:30Z",
  "completedAt": "2026-09-02T10:25:00Z",
  "totalDuration": 1500,
  "fetchedAt": "2026-09-02T10:35:45Z"
}
```

### Field Descriptions

#### Top Level

| Field | Type | Description |
|-------|------|-------------|
| `serviceId` | String | Which service? |
| `status` | String | Overall: `"green"`, `"orange"`, `"red"` |
| `stages` | Object | Details of each pipeline stage |
| `lastCommit` | Object | Git commit that triggered this run |
| `runNumber` | Integer | Pipeline run ID |
| `branch` | String | Git branch |
| `triggeredBy` | String | Who triggered it? |
| `triggeredAt` | ISO-8601 | When did the run start? |
| `completedAt` | ISO-8601 | When did it finish? (null if still running) |
| `totalDuration` | Integer | Seconds from start to finish |
| `fetchedAt` | ISO-8601 | When did we last fetch this data? |

#### Stages (build, test, deploy)

Each stage has:

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"passed"`, `"failed"`, `"running"`, `"skipped"` |
| `startedAt` | ISO-8601 | When did this stage start? |
| `completedAt` | ISO-8601 | When did it finish? (null if still running) |
| `duration` | Integer | Seconds from start to finish |
| `url` | String | Link to view logs for this stage |

#### Last Commit

| Field | Type | Description |
|-------|------|-------------|
| `hash` | String | Git commit hash |
| `message` | String | Commit message |
| `author` | String | Person who committed |
| `authorEmail` | String | Author's email |
| `url` | String | Link to commit on GitHub |
| `pushedAt` | ISO-8601 | When was it pushed? |

### Status Values Explained

**`status` field** can be:
- **`"green"`** — All stages passed, ready to use
- **`"orange"`** — Pipeline currently running, check back soon
- **`"red"`** — At least one stage failed, needs attention

**Stage status** can be:
- **`"passed"`** — Stage succeeded
- **`"failed"`** — Stage failed (deploy didn't happen if earlier stages fail)
- **`"running"`** — Stage is currently executing
- **`"skipped"`** — Stage was skipped (e.g., tests skipped for docs-only commits)

### Why These Fields?

- **serviceId** — Link status to a service
- **status** — Visual indicator (green/orange/red)
- **stages** — Detailed breakdown of what happened
- **lastCommit** — Why did this run? What changed?
- **triggeredBy, triggeredAt** — Audit trail
- **fetchedAt** — Know how fresh the data is
- **urls** — Let users dive deeper into logs

---

## 3. Dependency

A **Dependency** represents a relationship between services.

### Dependency Object

```json
{
  "from": "frontend-service",
  "to": "api-service",
  "type": "required",
  "critical": true,
  "description": "Frontend calls API endpoints"
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `from` | String | Service that depends on something | `"frontend-service"` |
| `to` | String | Service being depended on | `"api-service"` |
| `type` | String | Type of dependency: `"required"`, `"optional"`, `"optional-fallback"` | `"required"` |
| `critical` | Boolean | Is this service unable to function without it? | `true` |
| `description` | String | Why does this dependency exist? | `"Frontend calls API endpoints"` |

### Dependency Types

- **`"required"`** — Service cannot function without this (e.g., frontend needs API)
- **`"optional"`** — Service works without it, but with reduced functionality
- **`"optional-fallback"`** — If this fails, use a fallback

### Example Dependency Graph

```
frontend-service
    ├─requires─> api-service
    └─requires─> auth-service

api-service
    ├─requires─> database
    ├─requires─> cache-service
    └─optional─> monitoring-service

payment-service
    ├─requires─> api-service
    └─requires─> payment-gateway (external)
```

---

## Example: Complete Data for One Service

Let's put it all together for `api-service`.

### Service Metadata

```json
{
  "id": "api-service",
  "name": "API Service",
  "description": "Backend REST API serving frontend and payment service",
  "team": "Backend Team",
  "repository": "https://github.com/Shai-Shargal/api-service",
  "documentation": "https://docs.example.com/api-service",
  "dataSource": "github",
  "dataSourceId": "Shai-Shargal/api-service",
  "dependsOn": ["database-service", "cache-service"],
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-09-02T15:30:00Z"
}
```

### Pipeline Status (Current)

```json
{
  "serviceId": "api-service",
  "status": "green",
  "stages": {
    "build": {
      "status": "passed",
      "startedAt": "2026-09-02T10:00:00Z",
      "completedAt": "2026-09-02T10:05:30Z",
      "duration": 330,
      "url": "https://github.com/Shai-Shargal/api-service/actions/runs/12345"
    },
    "test": {
      "status": "passed",
      "startedAt": "2026-09-02T10:05:30Z",
      "completedAt": "2026-09-02T10:15:45Z",
      "duration": 615,
      "url": "https://github.com/Shai-Shargal/api-service/actions/runs/12345"
    },
    "deploy": {
      "status": "passed",
      "startedAt": "2026-09-02T10:15:45Z",
      "completedAt": "2026-09-02T10:25:00Z",
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
    "pushedAt": "2026-09-02T09:55:00Z"
  },
  "runNumber": 12345,
  "branch": "main",
  "triggeredBy": "Alice Chen",
  "triggeredAt": "2026-09-02T09:55:30Z",
  "completedAt": "2026-09-02T10:25:00Z",
  "totalDuration": 1500,
  "fetchedAt": "2026-09-02T10:35:45Z"
}
```

### Dependencies

```json
[
  {
    "from": "frontend-service",
    "to": "api-service",
    "type": "required",
    "critical": true,
    "description": "Frontend calls API endpoints"
  },
  {
    "from": "payment-service",
    "to": "api-service",
    "type": "required",
    "critical": true,
    "description": "Payment service uses API for transactions"
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
  }
]
```

---

## Storage: Where Does This Data Live?

### Phase 1: Where Data is Stored

**Service Metadata:**
- File: `backend/data/services.json`
- Format: Static JSON file (edited by hand)
- Loaded when server starts
- Reloaded with server restart

**Pipeline Status:**
- Storage: JavaScript object in memory
- Loaded from: External CI/CD APIs (GitHub, Jenkins, etc.)
- Updated: Every 30 seconds by the refresh scheduler
- Lost on: Server restart (acceptable for prototype)

### Example: services.json

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
      "dataSourceId": "Shai-Shargal/frontend-service",
      "dependsOn": ["api-service"],
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-09-02T15:30:00Z"
    },
    {
      "id": "api-service",
      "name": "API Service",
      "description": "Backend REST API",
      "team": "Backend Team",
      "repository": "https://github.com/Shai-Shargal/api-service",
      "documentation": "https://docs.example.com/api",
      "dataSource": "github",
      "dataSourceId": "Shai-Shargal/api-service",
      "dependsOn": ["database-service", "cache-service"],
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-09-02T15:30:00Z"
    },
    {
      "id": "payment-service",
      "name": "Payment Service",
      "description": "Payment processing",
      "team": "Payments Team",
      "repository": "https://github.com/Shai-Shargal/payment-service",
      "documentation": "https://docs.example.com/payments",
      "dataSource": "jenkins",
      "dataSourceId": "payment-service-pipeline",
      "dependsOn": ["api-service"],
      "createdAt": "2026-02-20T10:00:00Z",
      "updatedAt": "2026-09-02T15:30:00Z"
    }
  ]
}
```

### In-Memory Pipeline Status

JavaScript object (built at runtime):

```javascript
const pipelineStatuses = {
  "frontend-service": {
    // ... pipeline status object ...
  },
  "api-service": {
    // ... pipeline status object ...
  },
  "payment-service": {
    // ... pipeline status object ...
  }
};
```

---

## Relationships Between Objects

### Service → Pipeline Status

```
Service (frontend-service)
    ↓
    └─ latest Pipeline Status
            ├─ Build status
            ├─ Test status
            ├─ Deploy status
            └─ Last commit
```

One service has one **current** pipeline status (the latest run).

Historically, one service has **many** pipeline statuses (but we don't store this yet).

### Service → Service (Dependencies)

```
frontend-service
    ↓ depends on
    └─ api-service (required)

api-service
    ├─ depends on
    │   ├─ database-service (required)
    │   └─ cache-service (optional)
    └─ depended on by
        ├─ frontend-service
        └─ payment-service
```

Dependencies create a **directed graph** of services.

### Impact Analysis

When a service status changes, we can trace dependencies:

```
If api-service is RED:
  └─ frontend-service is affected (depends on api-service)
  └─ payment-service is affected (depends on api-service)

If cache-service is RED:
  └─ api-service is not affected (optional dependency)
```

---

## Validation Rules

These rules ensure data integrity:

### Service Validation
- `id` must be unique
- `id` must be a valid identifier (alphanumeric, hyphens, no spaces)
- `dataSource` must be `"github"`, `"jenkins"`, or `"gitlab"` (as available)
- If `dataSource` is `"github"`, `dataSourceId` must be `"owner/repo"` format

### Pipeline Status Validation
- `serviceId` must reference an existing service
- `status` must be `"green"`, `"orange"`, or `"red"`
- Each stage `status` must be `"passed"`, `"failed"`, `"running"`, or `"skipped"`
- `completedAt` cannot be before `startedAt`
- If stage failed, overall status must be `"red"`

### Dependency Validation
- Both `from` and `to` must reference existing services
- Cannot create circular dependencies (A→B, B→C, C→A)
- `type` must be `"required"`, `"optional"`, or `"optional-fallback"`

---

## Evolution: Phase 2+

### Phase 2: Add Database

When we add PostgreSQL, we'll store:
- All service metadata (persists across restarts)
- All pipeline runs (complete history)
- Deployment records
- Service health metrics

### Phase 3: Add Historical Data

```json
{
  "serviceId": "api-service",
  "pipelineRuns": [
    { "runNumber": 12345, "status": "green", ... },
    { "runNumber": 12344, "status": "red", ... },
    { "runNumber": 12343, "status": "green", ... }
  ],
  "metrics": {
    "averageBuildTime": 330,
    "averageTestTime": 615,
    "averageDeployTime": 555,
    "failureRate": 0.05,
    "mtbf": 864000,
    "mttr": 3600
  }
}
```

Where:
- **mtbf** = Mean Time Between Failures
- **mttr** = Mean Time To Recovery

### Phase 4: Add Alerts & Events

```json
{
  "serviceId": "api-service",
  "events": [
    {
      "type": "status_changed",
      "from": "green",
      "to": "red",
      "timestamp": "2026-09-02T10:25:00Z",
      "cause": "Build failed"
    }
  ]
}
```

---

## Summary

| Object | Purpose | Storage (Phase 1) | Updated |
|--------|---------|-------------------|---------|
| **Service** | Metadata about a service | `services.json` file | On server start |
| **Pipeline Status** | Current CI/CD state | JavaScript object (in-memory) | Every 30 seconds |
| **Dependency** | Relationships between services | Derived from `dependsOn` field | On server start |

---

## Next Steps

Once you approve this data model:

1. **API Design** — Define endpoints that return this data
2. **UI Design** — How does the dashboard display this data?
3. **SVG Design** — How do we draw the galaxy?
4. **Prototype** — Start coding!

---

**Last Updated:** 2026-09-04

