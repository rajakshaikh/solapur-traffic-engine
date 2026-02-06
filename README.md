# Smart Traffic & Parking Management System – SMC (Prototype)

This repository contains a **working prototype** of a smart traffic and parking management system designed for **Solapur Municipal Corporation (SMC)**.

The aim of the project is to show how **traffic congestion, parking problems, and recurring road obstructions** can be handled better using a **software-based, decision-support system**, instead of manual and reactive methods.

This is a **hackathon prototype**, built to demonstrate the idea, system flow, and feasibility.

---

## What problem are we solving?

Solapur faces frequent traffic congestion near:

* Markets
* Bus stands & railway station
* Schools, hospitals, and commercial areas

Major causes include:

* Improper parking
* Roadside hawkers
* Peak-hour traffic patterns
* Lack of data-driven planning tools for authorities

Currently, most actions are reactive and manual.
Our system focuses on **planned, time-based traffic and parking decisions**.

---

## What does this prototype show?

### Citizen Side

* View traffic advisories based on recurring congestion patterns
* City bus **schedule timetable** with delay indicators
* Report traffic / parking / obstruction issues
* View status of reported issues (received, under review, action planned)

### SMC Officer Dashboard

* Map-based view of congestion and parking impact areas
* Daily traffic & parking action list
* Rule-based recommendations (parking control, hawker restrictions, signal actions)
* Heatmaps and trend views for planning
* Manual review and control by officers (no automation)

---

## Important note about data

This prototype uses **sample and pattern-based data** for demonstration.

* No paid APIs
* No live enforcement systems
* No automated decision-making

The focus is on **system design, logic, and usability**.
Real-time integrations can be added later with official data access.

---

## Live Prototype (Recommended)

👉 **Deployed Demo:**
🔗 **https://smcpatmsystem.lovable.app**
🔗 **https://smcbot.lovable.app**   

This link shows the complete working prototype.
Judges are recommended to view the project using this link instead of running it locally.

---

## Tech Stack Used

* React + TypeScript
* Tailwind CSS + shadcn-ui
* Vite
* OpenStreetMap (Leaflet)
* Deployed using Lovable

---

## Running locally (optional)

If you want to explore the code:

```sh
git clone https://github.com/WhiteFurr/solapur-traffic-engine.git
cd solapur-traffic-engine
npm install
npm run dev
```

App will run on:

```
http://localhost:8080
```

---

## Hackathon Context

This project was built as part of a hackathon based on the problem statement:

**“Design and develop a smart, integrated traffic and parking management system for Solapur Municipal Corporation (SMC).”**

---




