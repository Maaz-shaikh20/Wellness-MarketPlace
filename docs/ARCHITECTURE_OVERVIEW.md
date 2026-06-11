# 🏗 Architecture Overview
### Wellness Marketplace for Alternative Therapies – Group A

This document describes the **technical architecture**, **design principles**, and **data flow** used in the Wellness Marketplace system.

---

## 🧠 Architectural Style

The application follows a **layered architecture** combined with **RESTful service design**.

### Layers:
1. Presentation Layer (Frontend)
2. Application Layer (Backend)
3. Data Layer (Database)

---

## 🎨 Presentation Layer (Frontend)

**Technology:** React + Tailwind CSS

### Responsibilities:
- User Interface rendering
- Form validation
- API consumption
- Role-based routing
- State management

---

## ⚙ Application Layer (Backend)

**Technology:** Spring Boot (Java)

### Responsibilities:
- REST API implementation
- Business logic
- Authentication & authorization
- Validation and exception handling

---

## 🗄 Data Layer (Database)

**Technology:** PostgreSQL

### Responsibilities:
- Persistent storage
- Data integrity
- Entity relationships

---

## 🔄 Request Flow
User Action ↓ React Frontend ↓ REST API Request ↓ Spring Boot Controllers ↓ Service Layer ↓ Repository Layer ↓ PostgreSQL Database
---

## 🔐 Security Architecture

- JWT-based authentication
- Role-based authorization
- Protected admin endpoints
- Token validation filters
- Secure password storage

---

## 🧱 Backend Package Structure
backend/ ├── controller/ ├── service/ ├── repository/ ├── model/ ├── dto/ ├── config/ └── exception/
---

## 🔗 Frontend Structure
frontend/ ├── pages/ ├── components/ ├── services/ ├── routes/ └── styles/
---

## 🧩 Key Design Principles

- Separation of concerns
- Modularity
- Scalability
- Maintainability
- Security-first approach

---

## 📘 Related Documentation

- 👉 **[SUMMARY.md](SUMMARY.md)**
- 👉 **[FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md)**
- 👉 **[API.md](API.md)**
- 👉 **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)**

---

📌 _Wellness Marketplace for Alternative Therapies – Group A_
📚 _Architecture & system design_
