# 🌿 Wellnest — Wellness Marketplace for Alternative Therapies

<div align="center">

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**[🌐 Live Demo](https://wellnest-marketplace.vercel.app)** &nbsp;|&nbsp; **[📖 API Docs](#-api-overview)** &nbsp;|&nbsp; **[🚀 Quick Start](#-quick-start)**

*A production-ready, full-stack marketplace connecting patients with verified alternative therapy practitioners.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [API Overview](#-api-overview)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)

---

## 🌟 Overview

**Wellnest** is a comprehensive wellness marketplace that bridges the gap between patients seeking alternative healthcare and verified practitioners. The platform provides:

- **Patients** — Book therapy sessions, purchase wellness products, get AI-powered health insights, and engage with the community
- **Practitioners** — Manage therapy services, handle bookings, sell wellness products, and respond to community questions
- **Admins** — Verify practitioner credentials, review certification documents, and manage platform users

The project implements **role-based access control** with distinct portals for each user type, backed by a secure JWT authentication system and a RESTful Spring Boot backend.

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend Framework** | React | 19.x |
| **Build Tool** | Vite | 7.x |
| **Styling** | Tailwind CSS | 3.4 |
| **Icons** | Lucide React | 0.56 |
| **HTTP Client** | Axios | 1.13 |
| **Routing** | React Router DOM | 7.x |
| **Backend Framework** | Spring Boot | 3.2.4 |
| **Language** | Java | 17 |
| **Database** | PostgreSQL | 16 |
| **ORM** | Spring Data JPA / Hibernate | — |
| **Authentication** | JWT (jjwt 0.11.5) | — |
| **Security** | Spring Security | — |
| **Real-time** | Spring WebSocket | — |
| **Caching** | Spring Cache | — |
| **External API** | OpenFDA Drug API | — |
| **Containerization** | Docker + Docker Compose | — |
| **Deployment** | Vercel (Frontend) + Render (Backend) | — |

---

## ✨ Features

### 👤 Patient Module
| Feature | Description |
|---|---|
| **Authentication** | JWT-based register/login with role selection |
| **Therapy Booking** | Browse verified therapies with search & category filters |
| **Session Management** | View, track, and cancel bookings with reason support |
| **Wellness Store** | Product browsing, cart management, checkout flow |
| **AI Recommendations** | Symptom-based therapy suggestions via custom ML endpoint |
| **FDA Drug Reference** | Integrated OpenFDA API for clinical pharmacology data |
| **Community Forum** | Post questions, receive answers from verified practitioners |
| **Notifications** | Real-time notification system with unread badge count |
| **Product Reviews** | Star ratings and written reviews for purchased products |

### 🧑‍⚕️ Practitioner Module
| Feature | Description |
|---|---|
| **Profile Setup** | Bio, specialization, clinic address onboarding |
| **Credential Verification** | Google Drive certificate link submission for admin review |
| **Therapy Management** | Create, edit, and delete therapy services with images |
| **Session Dashboard** | Accept/reject patient bookings with notes |
| **Product Management** | List, edit, and manage wellness product inventory |
| **Community Responses** | Answer patient questions to build professional reputation |

### 🛡️ Admin Module
| Feature | Description |
|---|---|
| **Verification Queue** | Review pending practitioner applications |
| **Document Review** | Access certificate links and credential details |
| **Approve/Reject Flow** | Verify practitioners or reject with reason |
| **Platform Overview** | Monitor user and practitioner activity |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 19 + Vite │ Tailwind CSS │ React Router │ Axios      │
│  ┌──────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │  Patient  │  │ Practitioner│  │       Admin          │   │
│  │  Portal   │  │   Portal    │  │     Dashboard        │   │
│  └──────────┘  └─────────────┘  └──────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / REST API + JWT
┌────────────────────────▼────────────────────────────────────┐
│                        BACKEND                               │
│          Spring Boot 3.2 │ Java 17 │ Spring Security        │
│  ┌─────────┐ ┌─────────┐ ┌───────┐ ┌────────┐ ┌─────────┐  │
│  │  Auth   │ │Therapy  │ │Product│ │Session │ │  Forum  │  │
│  │Controller│ │Controller│ │  API  │ │  API   │ │   API   │  │
│  └─────────┘ └─────────┘ └───────┘ └────────┘ └─────────┘  │
│  ┌──────────────────────┐  ┌─────────────────────────────┐  │
│  │   Spring Data JPA    │  │   OpenFDA External API      │  │
│  │  + Hibernate ORM     │  │   Integration               │  │
│  └──────────────────────┘  └─────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     PostgreSQL 16                            │
│  Users │ Practitioners │ Therapies │ Sessions │ Products     │
│  Cart  │ Orders │ Forum │ Notifications │ Recommendations    │
└─────────────────────────────────────────────────────────────┘
```

### Key Design Decisions
- **Stateless JWT Auth** — Token stored client-side, sent via `Authorization: Bearer` header on every request
- **Role-Based Route Guards** — `PrivateRoute`, `PractitionerRoute`, `AdminRoute` components protect frontend pages
- **Optimistic UI Updates** — Cart, session cancellations, and forum posts update the UI before server confirmation
- **Axios Interceptors** — Centralized token injection and error handling at the HTTP layer

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Java** 17+
- **PostgreSQL** 16+
- **Maven** 3.8+

### 1. Clone the Repository
```bash
git clone https://github.com/Maaz-shaikh20/Wellness-MarketPlace.git
cd Wellness-MarketPlace
```

### 2. Backend Setup
```bash
cd backend

# Configure your database in src/main/resources/application.properties
# (see Environment Variables section below)

# Build and run
./mvnw spring-boot:run
# Backend starts on http://localhost:8080
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8080/api" > .env

# Start dev server
npm run dev
# Frontend starts on http://localhost:5173
```

### 4. Docker (Optional — runs everything together)
```bash
# From project root
docker-compose up --build
```

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login, returns JWT | Public |
| `GET` | `/api/users/me` | Get current user profile | JWT |
| `GET` | `/api/therapies` | List all therapies | JWT |
| `POST` | `/api/sessions` | Book a therapy session | JWT |
| `GET` | `/api/sessions/user/{id}` | Get user's sessions | JWT |
| `PUT` | `/api/sessions/{id}/cancel` | Cancel a session | JWT |
| `GET` | `/api/products` | List all products | JWT |
| `POST` | `/api/cart/add` | Add product to cart | JWT |
| `POST` | `/api/recommendations` | Generate AI recommendation | JWT |
| `GET` | `/api/external/openfda/search` | FDA drug reference search | JWT |
| `POST` | `/api/forum/ask` | Post a community question | JWT |
| `POST` | `/api/forum/answer/{id}` | Answer a question | PRACTITIONER |
| `GET` | `/api/admin/practitioners/unverified` | Get pending applications | ADMIN |
| `PUT` | `/api/admin/practitioner/{id}/verify` | Verify a practitioner | ADMIN |
| `POST` | `/api/practitioners/user/{id}/upload-certificate` | Submit credential link | PRACTITIONER |

---

## 🔧 Environment Variables

### Backend — `application.properties`
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/wellness_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your_jwt_secret_key_minimum_256_bits
jwt.expiration=86400000
```

### Frontend — `.env`
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 📁 Project Structure

```
Wellness-MarketPlace/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── api/                 # Axios instance & interceptors
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PractitionerNavbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ...
│   │   ├── context/             # React Context (CartContext)
│   │   ├── pages/               # Route-level page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx    # Profile completion (Patient/Practitioner)
│   │   │   ├── Home.jsx
│   │   │   ├── BookTherapy.jsx
│   │   │   ├── MySessions.jsx
│   │   │   ├── AiRecommendation.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PractitionerHome.jsx
│   │   │   └── payment/         # Checkout flow
│   │   ├── routes/              # Route guard components
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── PractitionerRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   └── App.jsx              # Router configuration
│   ├── Dockerfile
│   └── vercel.json
│
├── backend/                     # Spring Boot application
│   └── src/main/java/com/example/wellnessbackend/
│       ├── config/              # Security, CORS, WebSocket config
│       ├── controller/          # REST API controllers (16 controllers)
│       ├── dto/                 # Data Transfer Objects
│       ├── entity/              # JPA entities / DB models
│       ├── repository/          # Spring Data JPA repositories
│       ├── security/            # JWT filter, UserDetails service
│       └── service/             # Business logic layer
│
├── docker-compose.yml           # Full-stack Docker orchestration
├── render.yaml                  # Render deployment config
└── docs/                        # Extended documentation
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ for learning and professional growth.</p>
  <p>
    <a href="https://wellnest-marketplace.vercel.app">Live Demo</a> ·
    <a href="https://github.com/Maaz-shaikh20/Wellness-MarketPlace/issues">Report Bug</a> ·
    <a href="https://github.com/Maaz-shaikh20/Wellness-MarketPlace/issues">Request Feature</a>
  </p>
</div>
