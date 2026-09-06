# DevOps Galaxy

An interactive DevOps visualization dashboard that displays the state of multiple software services and their CI/CD pipelines in a rotating spiral galaxy environment.

## Project Vision

DevOps Galaxy is a **visualization and aggregation layer** over real DevOps environments. It does not replace CI/CD systems (GitHub Actions, Jenkins, GitLab, etc.) — instead, it collects information about pipelines and visualizes them.

Services are represented as **interactive planets** within a **rotating spiral galaxy**. The visual state of each planet reflects the current health of that service.

## Project Structure

```
devops-galaxy/
├── frontend/                    (React + Vite + GalaxyJS)
│   ├── src/
│   │   ├── components/          (React components)
│   │   ├── main.jsx             (Entry point)
│   │   ├── App.jsx              (Main app)
│   │   └── index.css            (Global styles)
│   ├── index.html               (HTML entry)
│   ├── package.json             (Dependencies)
│   ├── vite.config.js           (Vite config)
│   └── node_modules/
│
├── backend/                     (Node.js + Express - not yet implemented)
│   ├── src/
│   │   ├── routes/              (API endpoints)
│   │   ├── services/            (Business logic)
│   │   ├── adapters/            (CI/CD integrations)
│   │   └── app.js               (Express setup)
│   ├── data/
│   │   └── services.json        (Service configuration)
│   ├── package.json
│   └── .env.example
│
├── docs/                        (Design documentation)
│   ├── 01-project-overview.md
│   ├── 02-requirements.md
│   ├── 03-system-design.md
│   ├── 04-architecture.md
│   ├── 05-data-model.md
│   ├── 06-api-design.md
│   ├── 07-ui-design.md
│   ├── 08-svg-design.md
│   └── SPIRAL-GALAXY-VISION.md
│
├── README.md                    (This file)
├── INTEGRATION-GUIDE.md         (GalaxyJS integration details)
└── .gitignore
```

## Quick Start

### Frontend Only (Current)

```bash
cd frontend
npm install
npm run dev
```

Opens http://localhost:5173 with the GalaxyJS spiral galaxy visualization.

### Full Stack (Future)

Once backend is implemented:

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

## Current Status

**Frontend:** ✅ Complete
- React + Vite application
- GalaxyJS spiral galaxy visualization
- Beautiful rotating animation with particles
- Ready for service integration

**Backend:** 🚧 Not yet implemented
- Directory structure prepared
- Will be built incrementally in future phases

## Technology Stack

### Frontend
- **React 18** — UI framework
- **Vite** — Build tool (fast development)
- **GalaxyJS** — Spiral galaxy visualization
- **CSS** — Styling

### Backend (Planned)
- **Node.js** — Runtime
- **Express.js** — Web framework
- **GitHub/Jenkins APIs** — CI/CD integration
- *PostgreSQL* (later) — Data persistence

## Documentation

All design decisions are in `/docs`:

- **01-project-overview.md** — Vision and scope
- **02-requirements.md** — System requirements
- **03-system-design.md** — Component design
- **04-architecture.md** — Tech stack and decisions
- **05-data-model.md** — Data structures
- **06-api-design.md** — API specification
- **07-ui-design.md** — UI/UX design
- **08-svg-design.md** — Visualization design
- **SPIRAL-GALAXY-VISION.md** — Galaxy implementation options

## Development Approach

This project is built **slowly and intentionally** as a learning laboratory:

1. ✅ Understand the problem (design phase)
2. ✅ Define requirements
3. ✅ System design
4. ✅ Architecture decisions
5. ✅ Data model
6. ✅ API design
7. ✅ UI design
8. ✅ Prototype & visualization (GalaxyJS)
9. → Next: Backend API
10. → Service integration
11. → CI/CD connectors
12. → Real-world testing

Each phase is completed before moving to the next.

## Next Steps

1. **Integration validation** — Confirm GalaxyJS spiral works perfectly
2. **Backend setup** — Express.js API framework
3. **Service registry** — Define which services to track
4. **API connectors** — GitHub Actions, Jenkins, GitLab
5. **Service visualization** — Position planets on galaxy
6. **Interactions** — Click for details, status updates
7. **Real data** — Connect to actual CI/CD systems

## Resources

- **GalaxyJS:** https://edwson.com/GalaxyJS/
- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **Express.js:** https://expressjs.com

## Current Phase

Building the **DevOps Galaxy Frontend** with interactive spiral galaxy visualization.

Services and backend integration coming next.

---

**Status:** Frontend complete with GalaxyJS spiral galaxy visualization 🌌  
**Date:** 2026-09-06  
**See:** `INTEGRATION-GUIDE.md` for GalaxyJS details
