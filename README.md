# ServiceBlueprint

**Government Journey Mapping & Design Tool**

## Background
18F and USDS champion service design practices including journey mapping and service blueprinting. No open-source tooling exists specifically for government service design documentation. Agencies rely on commercial tools (Miro, Figma) that may not meet FedRAMP requirements and lack government-specific templates.

## Need
37 HISPs designated by OMB submitted capacity assessments emphasizing digital improvements, but without standardized service design tooling, agencies lack common language for documenting current-state services, identifying pain points, and designing improved experiences. GAO found OMB could not assess progress partly because service designs weren't documented in comparable formats.

## Solution
Collaborative, web-based service blueprint editor purpose-built for government. Templates for citizen journey maps, service blueprints, and experience maps aligned with OMB HISP reporting requirements, with version control and export capabilities.

## Design
**Features:**
- Canvas-based editor (drag-and-drop components)
- Pre-built templates (7 A-11 Section 280 indicators)
- Real-time multi-user collaboration
- Export formats: SVG, PDF, structured JSON
- USWDS-based interface (Section 508 compliant)
- Self-hosted on FedRAMP infrastructure

**Components:**
- Citizen actions (frontstage)
- Frontstage interactions
- Backstage processes
- Support systems
- Pain points & opportunities

**Tech Stack:** React + Fabric.js, Node.js, PostgreSQL, WebSocket (collaboration)

## Outcomes
- Accelerate service redesign cycles
- Create reusable design patterns across agencies
- Enable standardized HISP reporting
- Reduce time from assessment to implementation

**Quick Start:**
```bash
git clone https://github.com/636137/serviceblueprint.git
cd serviceblueprint && npm install
npm run dev
# Access at http://localhost:3000
```

---
**Status**: Active Development | **Last Updated**: 2026-02-28
