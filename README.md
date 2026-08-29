# DevOps Galaxy

A personal DevOps learning project: a visual dashboard that aggregates and displays the state of multiple software services and their CI/CD pipelines.

## Project Vision

DevOps Galaxy is a **visualization and aggregation layer** over a real DevOps environment. It does not replace CI/CD systems (GitHub Actions, GitLab CI, Jenkins, etc.) — instead, it collects information about those pipelines and visualizes them in a galaxy-style dashboard.

Services are represented as **planets**. Dependencies between services are shown as **connections**. The visual state of each planet reflects the current health of that service and its pipeline.

## Development Approach

This project is being built **slowly and intentionally** as a long-term learning laboratory. We prioritize understanding concepts before implementation. Development is documentation-first, with design decisions captured before code is written.

**Phases:**
1. Understand the problem
2. Define requirements
3. System design
4. Architecture
5. Data model
6. API design
7. UI design
8. SVG visualization
9. Prototype
10. Real services
11. Real CI/CD
12. Docker
13. Monitoring
14. Cloud/Kubernetes/Terraform (eventually)

## Documentation

All planning and design decisions are documented in `/docs`:

- **01-project-overview.md** — Project vision and scope
- **02-requirements.md** — What the system needs to do
- **03-system-design.md** — How the system works (coming soon)
- **04-architecture.md** — Technical architecture (coming soon)
- **05-data-model.md** — Data structures (coming soon)
- **06-api-design.md** — API specification (coming soon)
- **07-ui-design.md** — User interface design (coming soon)
- **08-svg-design.md** — SVG visualization design (coming soon)
- **09-roadmap.md** — Development roadmap (coming soon)

## Current Status

**Phase:** Requirements Definition (Step 2)

We are currently defining what DevOps Galaxy needs to accomplish.
