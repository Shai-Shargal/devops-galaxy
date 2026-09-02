# Architecture

## What is Architecture?

**Architecture** is where we make technology choices. It answers:
- What programming languages and frameworks do we use?
- What database (if any)?
- How do the layers communicate?
- How is the system deployed?
- What infrastructure do we need?

Architecture is the bridge between System Design (abstract layers) and Implementation (actual code).

---

## Technology Stack Decision

### Why These Choices?

For a **learning project**, we want:
1. **Simple to understand** — not over-engineered
2. **Modern but stable** — not bleeding-edge, but current
3. **Good documentation** — easy to find answers
4. **Suitable for DevOps work** — teaches relevant concepts
5. **Low operational overhead** — can run locally without complex setup

---

## Frontend: React + Vite

### Choice: React (JavaScript)

**Frontend Technology Stack:**
- **Framework:** React 18+
- **Build Tool:** Vite (fast, modern)
- **Styling:** CSS Modules or Tailwind CSS
- **State Management:** React Context API (simple, no extra library)
- **SVG Library:** D3.js or Recharts (for rendering the galaxy)

### Why React?

| Criterion | Why React |
|-----------|-----------|
| **Learning Value** | React is industry-standard. Learning it teaches modern UI patterns. |
| **SVG Support** | Excellent SVG support for rendering the galaxy visualization. |
| **Community** | Huge ecosystem. Easy to find libraries and examples. |
| **Simplicity** | Smaller learning curve than Vue or Angular for starting. |
| **Reactivity** | Built-in state management. Automatic re-renders when data changes. |

### Why Vite?

Modern build tool that's fast and has minimal config. Faster development cycle than Create React App.

### Why Not Next.js (Yet)?

Next.js is excellent but adds complexity:
- File-based routing
- Server-side rendering
- API routes

For this learning project, we want to understand the full stack separately. Once we understand a simple setup, Next.js becomes useful for production.

---

## Backend: Node.js + Express

### Choice: Node.js (JavaScript/TypeScript)

**Backend Technology Stack:**
- **Runtime:** Node.js 20+ (LTS)
- **Framework:** Express.js (lightweight, flexible)
- **Language:** TypeScript (optional, but recommended)
- **API Style:** REST
- **Async:** Native async/await

### Why Node.js?

| Criterion | Why Node.js |
|-----------|-----------|
| **Full-Stack JavaScript** | Same language frontend and backend. Easier learning. |
| **Lightweight** | Express is minimal, we see exactly what we're building. |
| **Perfect for DevOps APIs** | Great HTTP libraries (axios, node-fetch). Easy to call external APIs. |
| **Event-Driven** | Built for handling many concurrent API calls (important for polling CI/CD systems). |
| **Good for Learning** | Can start simple, scale when needed. |

### Why Express?

Minimal framework. Doesn't force structure on you. You learn the "why" behind patterns instead of just following conventions.

### Why TypeScript?

Optional but recommended:
- **Type Safety** — Catch errors before runtime
- **Self-Documenting** — Types serve as documentation
- **Better IDEs** — Better autocomplete and error checking

We can start with JavaScript and add TypeScript later.

---

## Storage: In-Memory + JSON Files (Phase 1)

### Phase 1: No Database

For the first prototype, we'll use:

**Service Registry:** JSON file
```json
{
  "services": [
    {
      "id": "frontend-service",
      "name": "Frontend Service",
      "description": "React web application",
      "dependsOn": ["api-service"],
      "dataSource": "github",
      "dataSourceId": "Shai-Shargal/frontend-service"
    },
    ...
  ]
}
```

**Pipeline Status:** In-memory object (refreshed every 30 seconds)
```javascript
const pipelineStatuses = {
  "frontend-service": {
    status: "green",
    lastBuild: { status: "passed", timestamp: "..." },
    ...
  }
}
```

### Why Not a Database Yet?

- **Simplicity** — One less thing to run locally
- **Learning Focus** — Understand the core logic first
- **Sufficient for MVP** — Small data sizes don't need a database
- **Easy to migrate** — Once we understand the data model, moving to a database is straightforward

### Future: PostgreSQL

Later (Step 13+), we'll add a real database for:
- Persistent storage
- Historical data
- Multi-user support
- Production deployments

---

## Communication Between Layers

### Frontend ↔ Backend: REST API

**Why REST?**
- Simple, well-understood
- Great for learning HTTP concepts
- Sufficient for our needs

**API Design:**

```
GET /api/services
  Response: List of all services with current statuses

GET /api/services/:id
  Response: Detailed information for one service

GET /api/services/:id/pipeline
  Response: Detailed pipeline information

POST /api/refresh
  Trigger immediate refresh of all pipeline data
```

### Backend ↔ External APIs: HTTP Clients

**Adapters make HTTP calls to:**
- GitHub Actions REST API
- Jenkins REST API
- GitLab API (future)

Each adapter uses a library like `axios` or `node-fetch` to make HTTP requests.

### Frontend ↔ Backend: WebSocket (Future)

For real-time updates without polling:
- Frontend opens WebSocket connection
- Backend sends updates immediately when data changes
- No more 30-second delays

For now, we'll use polling (simpler to understand).

---

## Data Flow: Technical Implementation

### Example: User Opens Dashboard

```
1. Browser loads devops-galaxy.com
   └─> Vite serves React app

2. React app loads and mounts
   └─> Calls: GET /api/services

3. Express backend receives request
   └─> Handler function processes it

4. Application Layer (Service Registry + Aggregator) runs
   └─> Returns list of services with statuses
       (either cached, or triggers refresh if data is stale)

5. Express sends JSON response to frontend
   └─> {"services": [...]}

6. React receives data and updates state
   └─> Component re-renders

7. Galaxy canvas renders planets and connections
   └─> User sees the dashboard
```

**Time:** ~500ms - 1 second

### Example: Auto-Refresh

```
1. Data Refresh Scheduler (running in Node.js)
   └─> Fires every 30 seconds

2. Calls all CI/CD adapters
   └─> GitHub Adapter: Fetch api-service status
   └─> GitHub Adapter: Fetch frontend-service status
   └─> Jenkins Adapter: Fetch payment-service status

3. Adapters make HTTP calls to external APIs
   └─> GET https://api.github.com/repos/.../actions/runs
   └─> GET https://jenkins.company.com/api/json
   └─> ...

4. Responses are normalized and cached in memory
   └─> pipelineStatuses object updated

5. (Future) WebSocket pushes update to frontend
   └─> Frontend re-renders changed planets
```

**Time:** ~1-2 seconds (depends on external API response times)

---

## Project Structure

```
devops-galaxy/
│
├── README.md
├── docs/
│   ├── 01-project-overview.md
│   ├── 02-requirements.md
│   ├── 03-system-design.md
│   ├── 04-architecture.md
│   └── ...
│
├── frontend/                          (React app)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Galaxy.jsx             (SVG canvas)
│   │   │   ├── ServiceDetail.jsx      (detail panel)
│   │   │   └── Dashboard.jsx          (main page)
│   │   ├── hooks/
│   │   │   └── usePipelineStatus.js   (fetch data)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                           (Node.js + Express)
│   ├── src/
│   │   ├── routes/
│   │   │   └── services.js            (GET /api/services)
│   │   ├── services/
│   │   │   ├── serviceRegistry.js     (service list & config)
│   │   │   ├── pipelineAggregator.js  (fetch & normalize)
│   │   │   ├── dataRefresh.js         (scheduler)
│   │   │   └── dependencyMapper.js    (relationships)
│   │   ├── adapters/
│   │   │   ├── githubAdapter.js       (GitHub Actions)
│   │   │   ├── jenkinsAdapter.js      (Jenkins)
│   │   │   └── adapterRegistry.js     (route to adapter)
│   │   ├── app.js                     (Express setup)
│   │   └── server.js                  (start server)
│   ├── data/
│   │   └── services.json              (service configuration)
│   ├── package.json
│   └── .env.example
│
└── docker/                            (For later phases)
    └── Dockerfile
```

---

## Running the System

### Phase 1: Local Development

**Requirements:**
- Node.js 20+
- npm or yarn

**Setup:**

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Configure services (edit backend/data/services.json)
# Add GitHub Actions API token to .env
```

**Run:**

```bash
# Terminal 1: Start backend server
cd backend
npm run dev          # Starts on localhost:3000

# Terminal 2: Start frontend dev server
cd frontend
npm run dev          # Starts on localhost:5173
```

**Access:**
- Dashboard: http://localhost:5173
- API: http://localhost:3000/api/services

### Phase 2+: Docker & Deployment

Later, we'll containerize with Docker and deploy to:
- Locally with Docker Compose
- Cloud (AWS, Vercel, Railway, etc.)
- Kubernetes (learning infrastructure)

---

## Configuration & Secrets

### Environment Variables

Backend needs:

```env
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
GITHUB_API_URL=https://api.github.com

# Jenkins
JENKINS_URL=https://jenkins.company.com
JENKINS_USERNAME=your-username
JENKINS_TOKEN=xxxxxxxxxxxxx

# App
NODE_ENV=development
PORT=3000
REFRESH_INTERVAL=30000  # milliseconds
```

### Service Configuration

`backend/data/services.json` defines which services to track:

```json
{
  "services": [
    {
      "id": "frontend-service",
      "name": "Frontend Service",
      "dataSource": "github",
      "dataSourceId": "Shai-Shargal/frontend-service"
    },
    {
      "id": "api-service",
      "name": "API Service",
      "dataSource": "github",
      "dataSourceId": "Shai-Shargal/api-service"
    },
    {
      "id": "payment-service",
      "name": "Payment Service",
      "dataSource": "jenkins",
      "dataSourceId": "payment-service-pipeline"
    }
  ]
}
```

---

## Key Architecture Decisions

### Decision 1: Full-Stack JavaScript

**Why?** Same language everywhere. Easier to learn and transition between frontend/backend.

**Trade-off:** JavaScript might not be the best for heavy compute. But for DevOps dashboards, it's perfect.

### Decision 2: REST API for Phase 1

**Why?** Simple, well-understood. Good for learning HTTP concepts.

**Future:** WebSocket for real-time updates (more sophisticated).

### Decision 3: No Database in Phase 1

**Why?** Reduce complexity. Focus on core logic.

**Trade-off:** Data doesn't persist between server restarts. But that's fine for a prototype.

**Future:** Add PostgreSQL when we need persistence and historical data.

### Decision 4: Express.js (Minimal Framework)

**Why?** You see exactly what's happening. No "magic" hiding the learning.

**Trade-off:** More boilerplate than Next.js or Fastify. But better for understanding.

**Future:** Could switch to Next.js or Fastify when scaling.

### Decision 5: In-Memory Caching

**Why?** No external dependencies (no Redis needed). Simple to understand.

**Trade-off:** Data lost on server restart. But fine for a prototype.

**Future:** Redis for distributed caching across multiple servers.

---

## Monitoring & Logging (Phase 2+)

We won't implement this yet, but the architecture supports it:

```javascript
// Later: Add structured logging
logger.info('Fetching status for api-service', {
  service: 'api-service',
  dataSource: 'github'
});

// Later: Add metrics
metrics.counter('api_calls_total', { adapter: 'github' });
metrics.histogram('api_call_duration', duration, { adapter: 'github' });
```

---

## Scalability Considerations

### Phase 1-5 (Learning Phase)
- Single Node.js process
- In-memory storage
- Works for 3-10 services

### Phase 6-10 (Production Prototype)
- Add horizontal scaling (multiple Node.js processes)
- Add PostgreSQL for persistence
- Add Redis for distributed caching

### Phase 11+ (Production)
- Docker containers
- Kubernetes orchestration
- CDN for static assets
- Background job system for long-running tasks

---

## Security Considerations

### Phase 1 (Learning)
- No authentication required (private dashboard)
- API tokens in .env files (not in code)
- No sensitive data exposed

### Phase 2+ (Production)
- Authentication (OAuth2 with GitHub)
- Authorization (who can see what dashboard?)
- API rate limiting
- HTTPS enforcement
- Secrets management (AWS Secrets Manager, etc.)

---

## Testing Strategy

### Unit Tests (Phase 2+)
```javascript
// Test adapters in isolation
test('GitHub adapter parses build status correctly', () => {
  const response = { ... };
  const parsed = githubAdapter.parseStatus(response);
  expect(parsed.status).toBe('green');
});
```

### Integration Tests (Phase 3+)
```javascript
// Test API endpoints
test('GET /api/services returns list of services', async () => {
  const response = await request(app).get('/api/services');
  expect(response.status).toBe(200);
  expect(response.body.services.length).toBeGreaterThan(0);
});
```

### E2E Tests (Phase 4+)
```javascript
// Test full user workflows
test('User can open dashboard and see services', async () => {
  await page.goto('http://localhost:5173');
  await expect(page).toContainText('Frontend Service');
});
```

---

## Summary: The Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite | Interactive dashboard |
| **Backend** | Node.js + Express | API and business logic |
| **Data** | JSON files + in-memory | Configuration and state |
| **Styling** | CSS Modules/Tailwind | Dashboard styling |
| **SVG** | D3.js or Recharts | Galaxy visualization |
| **HTTP** | Axios/node-fetch | Call external APIs |

---

## Next Steps

Once you review and approve this architecture:

1. **Data Model** — Define exact structure of services, pipelines, dependencies
2. **API Design** — Specify API endpoints and responses
3. **UI Design** — Wireframes and interaction patterns
4. **SVG Design** — How to draw the galaxy visualization
5. **Prototype** — Start coding

---

**Last Updated:** 2026-09-02

