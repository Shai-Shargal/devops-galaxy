# System Design

## What is System Design?

**System Design** is about organizing your solution into logical components and understanding how they work together.

It answers:
- What are the major parts of the system?
- How does information flow between them?
- What is each component responsible for?
- Where does data come from and where does it go?

System Design is NOT about specific technologies yet (that's Architecture). It's about the "what" and "why", not the "how".

---

## High-Level Overview

DevOps Galaxy has three main layers:

```
┌─────────────────────────────────────────────────────────┐
│          PRESENTATION LAYER                             │
│  (What users see - the galaxy dashboard)               │
│  - SVG canvas with planets                             │
│  - Service detail panels                               │
│  - Real-time updates                                   │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ Display Data
                           │
┌─────────────────────────────────────────────────────────┐
│          APPLICATION LAYER                              │
│  (Business logic and data management)                   │
│  - Service registry (which services exist?)            │
│  - Dependency mapper (service relationships)           │
│  - Pipeline status aggregator (current state)          │
│  - Data refresh scheduler (keep data fresh)            │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ Request Status
                           │
┌─────────────────────────────────────────────────────────┐
│          DATA INTEGRATION LAYER                          │
│  (Connects to external systems)                         │
│  - GitHub Actions connector                            │
│  - Jenkins connector                                   │
│  - GitLab CI connector (future)                         │
│  - Adapters for each CI/CD platform                   │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ Fetch Pipeline Status
                           │
┌─────────────────────────────────────────────────────────┐
│          EXTERNAL SYSTEMS                               │
│  (Things we don't control)                              │
│  - GitHub Actions API                                  │
│  - Jenkins API                                         │
│  - Other CI/CD platforms                               │
└─────────────────────────────────────────────────────────┘
```

This is the **3-tier architecture pattern**: Presentation → Application → Data Integration.

---

## Component Breakdown

### 1. Presentation Layer

**What it does:** Shows the dashboard to users.

**Components:**
- **Galaxy Canvas** — Renders planets and connections as SVG
- **Service Details Panel** — Shows detailed pipeline info when you click a planet
- **Auto-Refresh Manager** — Updates the canvas in real-time

**Responsibilities:**
- Render planets (services) as visual elements
- Render connections (dependencies) between planets
- Update visual state based on pipeline status (green/orange/red)
- Handle user interactions (clicks, hovers)
- Ask the Application Layer for data
- Update the display without page reloads

**Key Concept:** This layer is "dumb" about DevOps. It doesn't know about GitHub Actions or Jenkins. It just displays data it receives.

---

### 2. Application Layer

**What it does:** Business logic. Manages the state of services and their pipelines.

**Components:**

#### 2a. Service Registry
Keeps track of which services exist and their metadata.

Data it stores:
- Service name
- Service description
- Service dependencies (which services does it depend on?)
- Data source (where to fetch pipeline data)
- Data source ID (GitHub repo ID, Jenkins project name, etc.)

```
Example:
{
  "id": "frontend-service",
  "name": "Frontend Service",
  "description": "React web application",
  "dependsOn": ["api-service"],
  "dataSource": "github",
  "dataSourceId": "Shai-Shargal/frontend-service"
}
```

#### 2b. Pipeline Status Aggregator
Pulls pipeline data from external systems and normalizes it.

What it does:
1. Asks the Data Integration Layer for pipeline status
2. Converts data from different formats into a standard format
3. Computes the overall service status (green/orange/red)
4. Tracks when the data was last updated

```
Example output:
{
  "serviceId": "api-service",
  "status": "green",
  "lastBuild": {
    "status": "passed",
    "timestamp": "2026-09-02T10:30:00Z"
  },
  "lastTest": {
    "status": "passed",
    "timestamp": "2026-09-02T10:31:00Z"
  },
  "lastDeploy": {
    "status": "passed",
    "timestamp": "2026-09-02T10:35:00Z"
  },
  "lastCommit": {
    "hash": "abc123def",
    "message": "Fix API response parsing"
  },
  "updatedAt": "2026-09-02T10:35:45Z"
}
```

#### 2c. Dependency Mapper
Understands which services depend on which.

What it does:
1. Reads the Service Registry
2. Computes the dependency graph
3. Provides information like: "If api-service is down, frontend-service is also affected"

Later, this could help with:
- Highlighting affected services
- Showing failure propagation
- Understanding system impact

#### 2d. Data Refresh Scheduler
Keeps pipeline data fresh.

What it does:
1. Periodically asks the Data Integration Layer for updates
2. Stores the most recent pipeline status
3. Triggers an update to the Presentation Layer

This is how the dashboard stays fresh without requiring manual page refreshes.

**Key Concept:** The Application Layer doesn't know or care about GitHub Actions, Jenkins, etc. It just knows "get me the status of service X" and expects a standard response.

---

### 3. Data Integration Layer

**What it does:** Talks to external CI/CD systems.

**Components:**

#### 3a. CI/CD Platform Adapters
Each adapter knows how to talk to a specific CI/CD system.

```
GitHub Actions Adapter:
- Knows how to call GitHub's REST API
- Knows what endpoints to hit to get pipeline status
- Converts GitHub's response format to standard format

Jenkins Adapter:
- Knows how to call Jenkins's API
- Knows what endpoints to hit
- Converts Jenkins's response format to standard format

GitLab CI Adapter (future):
- Knows how to call GitLab's API
- Converts GitLab response to standard format
```

Each adapter is responsible for:
1. Authentication (how to authenticate with that system)
2. Data fetching (which API endpoints to hit)
3. Response parsing (understanding the response)
4. Error handling (what if the API is down?)
5. Data normalization (converting to our standard format)

#### 3b. Adapter Registry
Knows which adapter to use for each service.

When the Application Layer asks "get status for api-service", the adapter registry says: "That service uses GitHub, so use the GitHub Adapter."

**Key Concept:** Adapters are the boundary between DevOps Galaxy and the external world. By isolating them here, we can add support for new CI/CD systems without changing the rest of the application.

---

## Data Flow: How Information Moves

### Scenario 1: User Visits Dashboard

```
1. User opens devops-galaxy.com
   ↓
2. Presentation Layer asks Application Layer: "Give me all services and their statuses"
   ↓
3. Application Layer asks Data Integration Layer: "Fetch fresh pipeline data for all services"
   ↓
4. Data Integration Layer:
   - Asks GitHub Adapter for api-service status
   - Asks GitHub Adapter for frontend-service status
   - Asks Jenkins Adapter for payment-service status
   ↓
5. External APIs respond with pipeline data
   ↓
6. Data Integration Layer normalizes responses to standard format
   ↓
7. Application Layer computes overall service statuses (green/orange/red)
   ↓
8. Presentation Layer receives data and renders the galaxy
   ↓
9. User sees the dashboard
```

**Time:** 1-2 seconds (depending on API response times)

### Scenario 2: Auto-Refresh (Every 30 Seconds)

```
1. Data Refresh Scheduler wakes up
   ↓
2. Asks Data Integration Layer for updates
   ↓
3. Data Integration Layer fetches from CI/CD systems
   ↓
4. Application Layer updates stored statuses
   ↓
5. Presentation Layer is notified: "Data changed"
   ↓
6. Presentation Layer re-renders only changed planets
   ↓
7. Dashboard updates without requiring page refresh
```

**Time:** < 1 second for re-render (assuming APIs respond quickly)

### Scenario 3: User Clicks a Service

```
1. User clicks the "api-service" planet
   ↓
2. Presentation Layer asks Application Layer: "Give me detailed info for api-service"
   ↓
3. Application Layer returns stored data (already fetched and cached)
   ↓
4. Presentation Layer opens details panel with:
   - Build status
   - Test status
   - Deploy status
   - Last commit
   - Last updated time
```

**Time:** < 100ms (data is already cached, no external API call needed)

---

## Key Design Decisions

### Decision 1: Three-Layer Architecture

**Why?** Separation of concerns.

- **Presentation** doesn't know about GitHub/Jenkins
- **Application** doesn't know about HTTP APIs or dashboard rendering
- **Data Integration** doesn't know about business logic

This makes each layer independent and testable.

### Decision 2: Adapters for Different CI/CD Systems

**Why?** Platform independence.

Instead of hardcoding "GitHub Actions" everywhere, we use adapters. Adding Jenkins support means:
- Write a Jenkins Adapter
- Register it in the Adapter Registry
- No other code changes needed

### Decision 3: Caching & Refresh Strategy

**Why?** Performance and reliability.

- We cache pipeline status locally (in Application Layer)
- Data Refresh Scheduler periodically fetches fresh data
- Clicking a service shows cached data (fast, no API call)
- If GitHub is temporarily down, users still see the last-known state

This is more robust than fetching live on every click.

### Decision 4: Normalization

**Why?** Consistency.

GitHub returns data in GitHub's format. Jenkins returns data in Jenkins's format. We normalize everything to a standard "pipeline status" format.

This means:
- The Presentation Layer works the same way regardless of where data comes from
- The Application Layer has predictable data structures

---

## Component Interactions (Simplified)

```
Presentation Layer
├── Galaxy Canvas
│   └── Asks Application Layer for "all services with statuses"
├── Service Details Panel
│   └── Asks Application Layer for "detailed info for service X"
└── Auto-Refresh Manager
    └── Listens to Application Layer for "data changed" events

Application Layer
├── Service Registry
│   └── Stores configuration (which services exist, their dependencies)
├── Pipeline Status Aggregator
│   ├── Asks Data Integration Layer for fresh data
│   ├── Stores results locally
│   └── Computes green/orange/red status
├── Dependency Mapper
│   └── Reads Service Registry to understand relationships
└── Data Refresh Scheduler
    └── Periodically triggers "refresh all data"

Data Integration Layer
├── GitHub Actions Adapter
│   └── Calls GitHub API
├── Jenkins Adapter
│   └── Calls Jenkins API
├── GitLab CI Adapter (future)
│   └── Calls GitLab API
└── Adapter Registry
    └── Routes requests to the correct adapter
```

---

## Important Concepts

### Adapter Pattern
Each CI/CD system has its own adapter. This is the **Adapter design pattern** — a way to convert one interface into another. It's how we support multiple CI/CD systems without writing a different dashboard for each.

### Observer Pattern
The Data Refresh Scheduler triggers updates, and the Presentation Layer "listens" for those updates. This is the **Observer pattern** — it allows loose coupling between components.

### Caching Strategy
We cache pipeline data locally. This makes the system fast and resilient. If GitHub goes down temporarily, users still see the last-known state.

### Normalization
Different CI/CD systems return different data formats. We normalize them to a standard format. This is crucial for supporting multiple systems.

---

## What Happens Next (Architecture)

Once we approve this system design, the next step is **Architecture** where we decide:

- **Frontend technology** (React? Vue? Plain HTML/JS?)
- **Backend technology** (Node.js? Python? Go?)
- **Where do we store data?** (Database? In-memory? Redis cache?)
- **How do we communicate between layers?** (REST APIs? Message queues?)
- **Where does the Data Refresh Scheduler run?** (In the browser? On the server?)
- **How do we authenticate with GitHub/Jenkins?** (API tokens? OAuth?)

---

## Diagram: The Complete System

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ PRESENTATION LAYER                                       │   │
│  │ ┌──────────────┐ ┌──────────────────┐ ┌─────────────┐   │   │
│  │ │ Galaxy       │ │ Service Details  │ │ Auto-Refresh│   │   │
│  │ │ Canvas (SVG) │ │ Panel            │ │ Manager     │   │   │
│  │ └──────────────┘ └──────────────────┘ └─────────────┘   │   │
│  └────────────────────────────┬─────────────────────────────┘   │
│                               │                                  │
│                        HTTP / WebSocket                          │
│                               │                                  │
│  ┌────────────────────────────▼─────────────────────────────┐   │
│  │ APPLICATION LAYER (Backend API)                         │   │
│  │ ┌──────────────┐ ┌──────────────────┐ ┌──────────────┐  │   │
│  │ │ Service      │ │ Pipeline Status  │ │ Dependency   │  │   │
│  │ │ Registry     │ │ Aggregator       │ │ Mapper       │  │   │
│  │ └──────────────┘ └──────────────────┘ └──────────────┘  │   │
│  │ ┌──────────────────────────────────────────────────────┐ │   │
│  │ │ Data Refresh Scheduler                               │ │   │
│  │ └──────────────────────────────────────────────────────┘ │   │
│  └────────────────────────────┬─────────────────────────────┘   │
│                               │                                  │
│                        HTTP to External APIs                     │
│                               │                                  │
│  ┌────────────────────────────▼─────────────────────────────┐   │
│  │ DATA INTEGRATION LAYER                                   │   │
│  │ ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────────────┐   │   │
│  │ │ GitHub   │ │Jenkins │ │ GitLab │ │ Adapter        │   │   │
│  │ │ Adapter  │ │Adapter │ │Adapter │ │ Registry       │   │   │
│  │ └──────────┘ └────────┘ └────────┘ └────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                 HTTP to External APIs
                               │
     ┌─────────────────────────┼─────────────────────────┐
     ▼                         ▼                         ▼
 GitHub API              Jenkins API              GitLab API
 (pipeline status)       (pipeline status)        (pipeline status)
```

---

**Last Updated:** 2026-09-02

