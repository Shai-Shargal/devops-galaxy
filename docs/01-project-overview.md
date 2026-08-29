# Project Overview

## What is DevOps Galaxy?

DevOps Galaxy is a **visual dashboard** that shows the state of multiple software services and their CI/CD pipelines in one unified view.

## The Problem We're Solving

In a typical microservices environment:
- You have multiple services (frontend, API, payment service, etc.)
- Each service has its own CI/CD pipeline
- These pipelines live in different places (GitHub Actions, Jenkins, GitLab, etc.)
- When something breaks, you have to check multiple systems to understand what happened
- Dependencies between services make it hard to see the big picture

DevOps Galaxy solves this by creating a **single dashboard** that aggregates pipeline information from all your services and visualizes them together.

## Initial System

The initial system will track **three services**:

1. **frontend-service** — The user-facing web application
2. **api-service** — The backend API
3. **payment-service** — Payment processing

Example visualization:

```
                    🪐 frontend-service
                           |
                           |
                           ▼
                      🪐 api-service
                       /          \
                      /            \
                     ▼              ▼
              🪐 users        🪐 payment-service
```

## What Each Planet Shows

Each planet (service) displays:
- **Current state** (health status of the service)
- **Pipeline state** (is the CI/CD pipeline green/orange/red?)
- **Dependencies** (which other services does this depend on?)

Visual states:
- 🟢 **Green** = Healthy / All tests passing / Recently deployed successfully
- 🟠 **Orange** = Pipeline running / Build in progress
- 🔴 **Red** = Pipeline failed / Tests failed / Deployment failed

## Interactive Features

Clicking on a planet should eventually show:
- **Build status** ✅/❌
- **Test results** ✅/❌
- **Deploy status** ⏸️/✅/❌
- **Last commit** (hash and message)
- **Overall status** (SUCCEEDED / FAILED / RUNNING)
- **Detailed pipeline logs** (eventually)

## The DevOps Connection

**Important:** DevOps Galaxy is NOT a CI/CD system itself.

We do not want to reinvent GitHub Actions, GitLab CI/CD, or Jenkins. Those systems will run the actual pipelines.

DevOps Galaxy is a **visualization layer** that sits on top of existing CI/CD systems:

```
Developer
    ↓ (git push)
GitHub
    ↓
CI/CD Pipeline (GitHub Actions / Jenkins / etc.)
    ├── Build
    ├── Test
    ├── Docker
    └── Deploy
            ↓
       Infrastructure (servers, K8s, etc.)
            ↓
       Monitoring (logs, metrics, alerts)
            ↓
   DevOps Galaxy (aggregates & visualizes)
            ↓
   SVG Dashboard (what users see)
```

Our job is to:
1. **Collect** information from CI/CD systems via their APIs
2. **Aggregate** that information into a unified data model
3. **Visualize** it in an interactive dashboard
4. **Update in real-time** as pipelines run

## Why This Matters for Learning

Building DevOps Galaxy teaches us:
- How CI/CD pipelines work (in practice)
- How to integrate with real CI/CD systems
- How to design data models for complex systems
- How to build monitoring and aggregation layers
- How to visualize complex system state
- DevOps fundamentals (deployment, dependencies, monitoring)
- Later: Docker, Kubernetes, Infrastructure-as-Code

## Scope (What We're NOT Doing)

- We are NOT replacing GitHub/GitLab/Jenkins
- We are NOT building a new CI/CD system
- We are NOT managing deployments directly
- We are NOT a deployment orchestrator (at least not initially)

## Next Steps

1. ✅ Project Overview (this document)
2. → Requirements Definition
3. System Design
4. Architecture
5. ... and so on

---

**Last Updated:** 2026-08-29
