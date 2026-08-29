# Requirements

## What Are Requirements?

**Requirements** describe what the system must do and how well it must do it. They are the "contract" between what we're building and what success looks like. They are NOT implementation details — they describe the "what" and "why", not the "how".

For DevOps Galaxy, requirements answer:
- What information must we display?
- How must users interact with it?
- How fast must it be?
- What data sources must we support?

---

## Functional Requirements

Functional requirements describe what the system must DO.

### FR1: Display Services as a Galaxy

**The system must visualize multiple services as planets in a galaxy-like visualization.**

- Each service is represented as a planet (visual element)
- Services are positioned in 2D space (a canvas)
- Services are distinguishable from each other (different names, positions, or visual markers)

**Why?** This is the core visual identity of the project. The galaxy metaphor makes the dashboard intuitive and memorable.

### FR2: Show Service Dependencies

**The system must visualize the relationships between services.**

- Dependencies are shown as connections (lines) between planets
- If service A depends on service B, there is a visible connection
- The direction of the connection should be clear (A depends on B, not the reverse)

**Why?** Understanding service dependencies is critical for understanding system-wide failures. If the API service is down, it affects the frontend service.

### FR3: Display Pipeline Status

**Each service must show the current state of its CI/CD pipeline.**

- State is visually represented (color-coded: green/orange/red)
- The state reflects: Build status, Test status, Deploy status
- The state is updated to reflect the most recent pipeline run

**Why?** The whole point of the dashboard is to see at a glance which services are healthy and which are broken.

### FR4: Show Pipeline States

**The system must distinguish between different pipeline states.**

- 🟢 **Green** = All pipeline stages passed (Build ✅, Tests ✅, Deploy ✅)
- 🟠 **Orange** = Pipeline currently running
- 🔴 **Red** = Pipeline failed at some stage

**Why?** A simple green/orange/red system lets you instantly understand the health of your services.

### FR5: Click for Details

**Clicking a service must show detailed pipeline information.**

Details must include:
- Build status (✅ passed / ❌ failed)
- Test status (✅ passed / ❌ failed)
- Deploy status (⏸️ pending / ✅ deployed / ❌ failed)
- Last commit (hash and message)
- Overall status (SUCCEEDED / FAILED / RUNNING)
- Timestamp of last update

**Why?** At a glance, you see the state. When you need to debug, you click to get details. This keeps the main dashboard clean while providing depth when needed.

### FR6: Auto-Update

**The dashboard must automatically refresh to show current pipeline state.**

- The dashboard should update without requiring a page refresh
- Updates should happen at regular intervals (e.g., every 30 seconds or every minute)
- Users should be able to configure the update frequency

**Why?** A DevOps dashboard is only useful if it shows current information. You don't want to have to refresh manually to see if a failing pipeline is fixed.

### FR7: Support Multiple Data Sources (Future)

**The system must be designed to support multiple CI/CD platforms.**

In the initial version, we may start with GitHub Actions only. But the architecture should allow for:
- GitHub Actions
- GitLab CI/CD
- Jenkins
- Other CI/CD platforms

**Why?** Different teams use different CI/CD systems. A good aggregation layer should be platform-agnostic.

---

## Non-Functional Requirements

Non-functional requirements describe qualities the system must have (not specific features, but how well they work).

### NFR1: Performance

**The dashboard must load quickly and feel responsive.**

- Initial page load: < 2 seconds
- Updates to dashboard: < 1 second (from data fetch to display)
- The dashboard should not lag when scrolling or clicking

**Why?** If the dashboard is slow, people won't use it. DevOps tools need to be fast.

### NFR2: Reliability

**The dashboard must remain functional even if one data source fails.**

- If GitHub Actions API is temporarily unavailable, the dashboard should still show cached data
- The system should gracefully handle API errors without crashing
- If a service's pipeline data is unavailable, show that service with an "unknown" state rather than breaking

**Why?** A DevOps dashboard that breaks when the CI/CD system hiccups defeats the purpose. It should be more reliable than its data sources.

### NFR3: Scalability

**The system must scale to handle many services.**

- Must support at least 10-50 services initially
- Should be designed to support 100+ services eventually
- Adding a new service should not significantly impact performance

**Why?** Small systems grow. We need a design that scales without major rewrites.

### NFR4: Maintainability

**The code must be well-documented and easy to understand.**

- Each major component should have clear documentation
- The architecture should be documented
- New team members should be able to understand the system

**Why?** This is a learning project. Understanding the code is as important as the code working.

### NFR5: Testability

**The system must be testable.**

- Core business logic should be unit testable
- The API layer should be mockable
- The visualization layer should be testable (though this is harder)

**Why?** Tests give us confidence that the system works. For a learning project, tests also teach us how the system is supposed to behave.

---

## Data Requirements

### DR1: Pipeline Data

For each service, the system must track:
- **Service name** (unique identifier)
- **Service status** (green/orange/red)
- **Latest build** status and timestamp
- **Latest test** status and timestamp
- **Latest deploy** status and timestamp
- **Last commit** (hash and message)
- **Last updated** (when we fetched the data)

### DR2: Service Metadata

For each service, the system must know:
- **Service name** (display name)
- **Service description** (what does this service do?)
- **Dependencies** (which other services does this depend on?)
- **Data source** (where do we get pipeline data? GitHub Actions? Jenkins? etc.)
- **Data source identifier** (the repository ID, project ID, or URL)

### DR3: Historical Data (Future)

Eventually, we should track:
- **Past pipeline runs** (build history)
- **Deployment history**
- **Failure trends** (which services fail most often?)
- **Performance metrics** (how long do builds take? deployments?)

For now, we'll focus on current state only.

---

## Constraints & Assumptions

### Constraints

**C1: No direct pipeline management**
- We do NOT manage or trigger pipelines. We only read their status.

**C2: Depends on external APIs**
- The dashboard depends on GitHub Actions, Jenkins, or other CI/CD APIs.
- If those APIs are down, we can only show cached data.

**C3: Initial scope is three services**
- We start with frontend-service, api-service, payment-service.
- The system should be designed to add more, but we don't build for 100 services yet.

**C4: No authentication initially**
- The first version is a simple dashboard with no user authentication.
- Future versions might require auth (especially for viewing sensitive data).

### Assumptions

**A1: Services are publicly accessible (or we have API access)**
- We can query GitHub Actions / Jenkins / other CI/CD systems for pipeline information.

**A2: CI/CD systems have usable APIs**
- GitHub Actions, Jenkins, etc. provide APIs we can use to fetch pipeline status.

**A3: Real services exist**
- Eventually (step 10+), we will have real services with real pipelines.
- For the prototype, we can mock data.

**A4: Users are DevOps engineers or developers**
- Users understand CI/CD concepts.
- We don't need to explain what "deployment" means in the UI.

---

## Out of Scope (For Now)

- **Authentication & Authorization** — Who can see what dashboard?
- **Alerting** — Notifying users when a pipeline fails
- **Detailed logs** — Full pipeline output (just summary status)
- **Historical analysis** — Trends over time
- **Cloud deployment** — We'll run this locally initially
- **Database** — We'll use in-memory storage initially
- **API versioning** — Not needed yet
- **Multi-tenant** — Not needed yet

These may be added later as the project grows.

---

## Success Criteria

How do we know when this step (requirements) is done?

✅ We have defined the core features (FR1-FR7)
✅ We have defined quality attributes (NFR1-NFR5)
✅ We have defined what data we need (DR1-DR3)
✅ We have identified constraints and assumptions
✅ We have agreed on scope and out-of-scope items

---

## Next Steps

Once requirements are approved:
1. **System Design** — How does the information flow? What are the major components?
2. **Architecture** — What technology stack? Frontend? Backend? Database?
3. **Data Model** — Exact structure of services, pipelines, dependencies
4. **API Design** — How does the backend expose data?
5. **UI Design** — Wireframes and interaction patterns
6. **SVG Design** — How do we draw the galaxy?

---

**Last Updated:** 2026-08-29
