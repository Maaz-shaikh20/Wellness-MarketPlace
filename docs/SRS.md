# Software Requirements Specification (SRS)
## Wellness Marketplace for Alternative Therapies

| Field | Details |
|---|---|
| **Author** | Maaz Shaikh |
| **Course** | Software Engineering |
| **Institution** | Walchand Institute of Technology |
| **Version** | 1.0 |
| **Date** | April 2026 |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Stakeholders & User Classes](#3-system-stakeholders--user-classes)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Architecture & Constraints](#6-system-architecture--constraints)
7. [External Interface Requirements](#7-external-interface-requirements)
8. [Use Case Summary](#8-use-case-summary)
9. [Data Requirements](#9-data-requirements)
10. [Assumptions & Dependencies](#10-assumptions--dependencies)
11. [Glossary](#11-glossary)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document defines the complete functional and non-functional requirements for the **Wellness Marketplace for Alternative Therapies** — a full-stack web platform that connects patients seeking alternative wellness treatments with verified, professional therapists and wellness practitioners.

### 1.2 Scope
The system provides a digital marketplace where:
- **Patients** can discover, compare, and book alternative therapy sessions.
- **Practitioners** can register, get verified, manage their services, and handle appointments.
- **Admins** can oversee platform operations, verify practitioners, and monitor activity.

The platform covers therapy discovery, appointment scheduling, community forums, product purchases, notifications, AI-based recommendations, and payment processing.

### 1.3 Document Conventions
| Term | Meaning |
|------|---------|
| **FR** | Functional Requirement |
| **NFR** | Non-Functional Requirement |
| **SHALL** | Mandatory requirement |
| **SHOULD** | Recommended requirement |
| **MAY** | Optional requirement |

### 1.4 Intended Audience
- Development team (Group A)
- Academic evaluators / instructors
- Future maintainers and contributors

### 1.5 Real-World Scenario
Alternative and complementary therapies (yoga, acupuncture, naturopathy, meditation, aromatherapy, etc.) are gaining global popularity. However, patients struggle to find verified, trustworthy practitioners, and practitioners have no unified digital platform to manage their services. This system addresses that gap by providing a structured, secure, and scalable marketplace.

---

## 2. Overall Description

### 2.1 Product Perspective
The Wellness Marketplace is a standalone web application consisting of:
- A **React.js** single-page frontend application
- A **Spring Boot (Java)** RESTful backend
- A **MySQL** relational database
- JWT-based authentication and role-based access control

### 2.2 Product Functions (High-Level Summary)
- User registration and secure login (Patients, Practitioners, Admins)
- Practitioner profile creation, verification workflow, and management
- Therapy service creation and management by practitioners
- Session/appointment booking, tracking, and cancellation
- Notification system for booking updates
- Community forum (Q&A) for patients and practitioners
- Product store with cart, orders, and payment processing
- AI-based therapy recommendations
- Admin dashboard for monitoring and verification

### 2.3 Operating Environment
- **Client:** Any modern web browser (Chrome, Firefox, Edge, Safari)
- **Server:** Java 17+, Spring Boot 3.x
- **Database:** MySQL 8.x
- **Frontend Runtime:** Node.js 18+, Vite build tool
- **Communication:** HTTPS REST APIs

---

## 3. System Stakeholders & User Classes

### 3.1 Patient (End User)
- Individuals seeking alternative therapy services
- Can browse, book, pay, and review practitioners
- Access level: Limited to patient-facing features

### 3.2 Practitioner (Service Provider)
- Certified or self-declared wellness professionals
- Must undergo admin verification before offering services
- Can manage therapies, sessions, availability, and products
- Access level: Practitioner dashboard and management tools

### 3.3 Administrator (Platform Manager)
- Platform operator responsible for quality control
- Verifies practitioners, manages users, monitors activity
- Access level: Full admin dashboard

### 3.4 System (Automated)
- Sends notifications on booking events
- Processes AI-based recommendations
- Handles payment gateway interactions

---

## 4. Functional Requirements

---

### 4.1 Authentication & Authorization Module

#### FR-AUTH-01: User Registration
- The system SHALL allow new users to register as a **Patient** or **Practitioner**.
- Registration SHALL collect: full name, email address, password, and role.
- Email addresses SHALL be unique across the system.
- Passwords SHALL be securely hashed before storage (BCrypt).

#### FR-AUTH-02: User Login
- The system SHALL authenticate users via email and password.
- On successful login, the system SHALL issue a **JWT access token** and a **refresh token**.
- Login SHALL be role-aware and redirect users to their respective dashboards.

#### FR-AUTH-03: Token Refresh
- The system SHALL support refresh token-based session extension.
- Expired access tokens SHALL be renewed using a valid refresh token.

#### FR-AUTH-04: Logout
- The system SHALL invalidate the refresh token on logout.
- The client SHALL discard the stored JWT upon logout.

#### FR-AUTH-05: Role-Based Access Control (RBAC)
- The system SHALL enforce access control based on roles: `PATIENT`, `PRACTITIONER`, `ADMIN`.
- Protected API endpoints SHALL reject requests with invalid or missing tokens.

---

### 4.2 Patient Module

#### FR-PAT-01: Browse Practitioners
- Patients SHALL be able to view a list of all **verified** practitioners.
- Each practitioner card SHALL display: name, specialization, rating, and bio.

#### FR-PAT-02: Filter Practitioners
- Patients SHALL be able to filter practitioners by therapy type and specialization.

#### FR-PAT-03: View Practitioner Profile
- Patients SHALL be able to view a full practitioner profile including: bio, specialization, rating, certificate status, clinic address, and offered therapies.

#### FR-PAT-04: Book a Therapy Session
- Patients SHALL be able to select a practitioner, choose a therapy, select a date/time, and confirm a booking.
- The system SHALL create a `TherapySession` record with status `booked`.

#### FR-PAT-05: View Session History
- Patients SHALL be able to view all their past and upcoming sessions with statuses: `booked`, `completed`, `cancelled`.

#### FR-PAT-06: Cancel a Session
- Patients SHALL be able to cancel a booked session before it occurs.
- A cancellation reason SHALL be required and stored.
- The `cancelledBy` field SHALL be set to `PATIENT`.

#### FR-PAT-07: Patient Profile Management
- Patients SHALL be able to view and update their name and bio.

#### FR-PAT-08: Notifications
- Patients SHALL receive in-app notifications for: session confirmations, cancellations, and rejections.

#### FR-PAT-09: AI Therapy Recommendations
- The system SHALL provide AI-based therapy suggestions based on patient input or history.

#### FR-PAT-10: Community Forum
- Patients SHALL be able to post questions and read answers in the community forum.

#### FR-PAT-11: Product Store
- Patients SHALL be able to browse wellness products, add to cart, and place orders.

#### FR-PAT-12: Payment
- Patients SHALL be able to complete payments via the integrated (fake/real) payment gateway.
- Payment status SHALL be tracked per order.

---

### 4.3 Practitioner Module

#### FR-PRAC-01: Practitioner Registration
- Practitioners SHALL register with name, email, password, and role `PRACTITIONER`.
- Account SHALL be initially **unverified**.

#### FR-PRAC-02: Profile Creation & Update
- Practitioners SHALL be able to create and update their profile with: specialization, bio, clinic address, and certificate link.
- Certificate submission SHALL record the submission timestamp.

#### FR-PRAC-03: Verification Status Tracking
- Practitioners SHALL be able to view their current verification status: `Pending`, `Verified`, or `Rejected`.
- On rejection, the system SHALL display the rejection reason.
- Practitioners SHALL be allowed to re-upload certificates after a configured waiting period.

#### FR-PRAC-04: Therapy Service Management
- Practitioners SHALL be able to create, update, and delete therapy services.
- Each therapy SHALL include: name, description, duration, and price.

#### FR-PRAC-05: Session Management
- Practitioners SHALL be able to view all incoming session bookings.
- Practitioners SHALL be able to accept, complete, or reject sessions.
- Rejection SHALL require a reason, stored in `rejectedReason`.

#### FR-PRAC-06: Availability Management
- Practitioners SHALL be able to define available time slots for bookings.

#### FR-PRAC-07: Product Management
- Verified practitioners SHALL be able to list, update, and remove wellness products for sale.

#### FR-PRAC-08: Community Participation
- Practitioners SHALL be able to answer patient questions in the forum.

#### FR-PRAC-09: Notifications
- Practitioners SHALL receive notifications for new bookings, cancellations, and payment events.

---

### 4.4 Admin Module

#### FR-ADM-01: Admin Login
- Admins SHALL log in via a dedicated admin account.
- Admin credentials SHALL be pre-seeded or created by a super-admin.

#### FR-ADM-02: Practitioner Verification
- Admins SHALL be able to view all practitioners with status `Pending`.
- Admins SHALL be able to **approve** or **reject** practitioners.
- On approval, the practitioner's `verified` flag SHALL be set to `true`.
- On rejection, a mandatory rejection reason SHALL be stored.

#### FR-ADM-03: User Management
- Admins SHALL be able to view all registered users (patients and practitioners).

#### FR-ADM-04: Platform Monitoring
- Admins SHALL be able to view all sessions, bookings, and platform activity from the admin dashboard.

#### FR-ADM-05: Practitioner Document Review
- Admins SHALL be able to view submitted certificate links before making a verification decision.

---

### 4.5 Notification Module

#### FR-NOT-01: Notification Creation
- The system SHALL automatically generate notifications on key events: booking confirmed, session cancelled, session rejected, payment received.

#### FR-NOT-02: Notification Retrieval
- Users SHALL be able to retrieve their unread notifications.

#### FR-NOT-03: Mark as Read
- Users SHALL be able to mark individual or all notifications as read.

---

### 4.6 Payment Module

#### FR-PAY-01: Payment Initiation
- The system SHALL initiate a payment request on session booking or product checkout.

#### FR-PAY-02: Payment Processing
- The system SHALL integrate with a payment gateway (fake gateway included for testing).
- Payment status SHALL be tracked: `PENDING`, `SUCCESS`, `FAILED`.

#### FR-PAY-03: Payment Record
- The system SHALL store a `PaymentTransaction` record for every payment attempt.

---

## 5. Non-Functional Requirements

### 5.1 Performance

#### NFR-PERF-01: Response Time
- API responses for standard queries SHALL complete within **2 seconds** under normal load.
- Page load time for the React frontend SHALL not exceed **3 seconds** on a standard broadband connection.

#### NFR-PERF-02: Concurrent Users
- The system SHOULD support at least **100 concurrent users** without degradation.

#### NFR-PERF-03: Database Query Optimization
- All database queries SHALL use indexed columns for primary lookups (user ID, email, session ID).

---

### 5.2 Security

#### NFR-SEC-01: Authentication Security
- All passwords SHALL be hashed using **BCrypt** with a minimum cost factor of 10.
- JWT tokens SHALL have a defined expiry (e.g., 15 minutes for access tokens).
- Refresh tokens SHALL be stored securely and invalidated on logout.

#### NFR-SEC-02: Authorization
- All protected endpoints SHALL validate JWT tokens via a security filter chain.
- Role-specific endpoints SHALL reject unauthorized roles with HTTP `403 Forbidden`.

#### NFR-SEC-03: Data Transmission
- All client-server communication SHALL occur over **HTTPS** in production.

#### NFR-SEC-04: Input Validation
- The backend SHALL validate all incoming request payloads.
- The frontend SHALL perform client-side form validation before submission.

#### NFR-SEC-05: SQL Injection Prevention
- The system SHALL use **JPA/Hibernate parameterized queries** exclusively; raw SQL SHALL be avoided.

---

### 5.3 Usability

#### NFR-USE-01: Intuitive UI
- The user interface SHALL follow consistent design patterns across all pages.
- Navigation SHALL be role-aware (patients see patient menus; practitioners see practitioner menus).

#### NFR-USE-02: Responsiveness
- The frontend SHALL be responsive and usable on desktop, tablet, and mobile screen sizes.

#### NFR-USE-03: Error Messaging
- The system SHALL display clear, user-friendly error messages for failed actions (e.g., invalid login, booking conflict).

#### NFR-USE-04: Accessibility
- The UI SHOULD follow WCAG 2.1 Level AA accessibility guidelines where feasible.

---

### 5.4 Reliability & Availability

#### NFR-REL-01: Uptime
- The system SHOULD target **99% uptime** during operational hours.

#### NFR-REL-02: Data Integrity
- Database transactions SHALL ensure atomicity; partial writes SHALL be rolled back on failure.

#### NFR-REL-03: Error Handling
- The backend SHALL implement global exception handling to return structured error responses (HTTP status codes + error messages) instead of stack traces.

---

### 5.5 Maintainability

#### NFR-MNT-01: Code Structure
- The backend SHALL follow the **MVC pattern** with clear separation: Controller → Service → Repository.
- The frontend SHALL organize code into pages, components, and API service modules.

#### NFR-MNT-02: Documentation
- All public API endpoints SHALL be documented.
- All major modules SHALL have accompanying documentation files.

#### NFR-MNT-03: Configurability
- Environment-specific configurations (database URL, JWT secret, allowed origins) SHALL be externalized in `application.properties` or environment variables.

---

### 5.6 Scalability

#### NFR-SCA-01: Horizontal Scalability
- The backend SHOULD be designed as a stateless REST service to support horizontal scaling behind a load balancer.

#### NFR-SCA-02: Database Scalability
- The database schema SHOULD support future migration to a distributed database or read replicas.

---

### 5.7 Portability

#### NFR-POR-01: Cross-Browser Compatibility
- The frontend SHALL function correctly on the latest versions of Chrome, Firefox, Edge, and Safari.

#### NFR-POR-02: Platform Independence
- The backend SHALL run on any platform supporting **Java 17+** (Windows, Linux, macOS).

---

## 6. System Architecture & Constraints

### 6.1 Architectural Pattern
The system follows a **three-tier layered architecture**:

```
[ React Frontend (Vite) ]
          ↕  HTTPS / REST API
[ Spring Boot Backend ]
          ↕  JPA / Hibernate
[ MySQL Database ]
```

### 6.2 Backend Package Structure
```
com.example.wellnessbackend/
├── controller/     ← REST API endpoints
├── service/        ← Business logic
├── repository/     ← Data access (Spring Data JPA)
├── entity/         ← JPA entity classes
├── dto/            ← Data Transfer Objects
├── security/       ← JWT filters & config
└── config/         ← CORS, beans, app config
```

### 6.3 Constraints
- The system is developed for **academic and learning purposes**.
- The payment gateway used is a **simulated/fake gateway** for testing; real payment integration is out of scope.
- AI recommendations use a basic rule-based or external API approach; advanced ML models are out of scope.
- Certificate upload stores a **URL link** only; actual file storage (e.g., S3) is out of scope.

---

## 7. External Interface Requirements

### 7.1 User Interface
- Built with **React.js** and styled using **Tailwind CSS**.
- State managed via React hooks and context.
- Routing handled by **React Router**.

### 7.2 API Interface
- All backend communication occurs via **RESTful HTTP APIs**.
- Request/response format: **JSON**.
- Authentication: `Authorization: Bearer <JWT>` header.

### 7.3 Database Interface
- Backend communicates with MySQL via **Spring Data JPA / Hibernate**.
- Schema is auto-managed via `spring.jpa.hibernate.ddl-auto`.

### 7.4 External APIs
- **Payment Gateway:** Fake gateway controller simulating payment processing.
- **AI Recommendation API:** External API or internal rule-based engine via `RecommendationController`.

---

## 8. Use Case Summary

| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-01: Register | Patient / Practitioner | Create a new account |
| UC-02: Login | All Users | Authenticate and receive JWT |
| UC-03: Browse Practitioners | Patient | View list of verified practitioners |
| UC-04: Book Session | Patient | Schedule a therapy appointment |
| UC-05: Cancel Session | Patient / Practitioner | Cancel a booked session |
| UC-06: Manage Therapies | Practitioner | CRUD operations on therapy services |
| UC-07: Submit Certificate | Practitioner | Upload credentials for verification |
| UC-08: Verify Practitioner | Admin | Approve or reject a practitioner |
| UC-09: View Notifications | All Users | Read in-app notifications |
| UC-10: Purchase Product | Patient | Add to cart and complete payment |
| UC-11: Post Forum Question | Patient | Ask a wellness question in the forum |
| UC-12: Answer Forum Question | Practitioner | Respond to patient forum questions |
| UC-13: Get AI Recommendation | Patient | Receive personalized therapy suggestions |
| UC-14: Monitor Dashboard | Admin | View overall platform statistics |

---

## 9. Data Requirements

### 9.1 Core Entities

| Entity | Key Attributes |
|--------|---------------|
| `User` | id, name, email, password, role, bio, verified |
| `PractitionerProfile` | id, userId, specialization, verified, rating, bio, certificateLink, clinicAddress |
| `Therapy` | id, name, description, duration, price, practitionerId |
| `TherapySession` | id, therapyId, practitionerId, userId, dateTime, status, notes, cancellationReason |
| `Notification` | id, userId, message, read, createdAt |
| `Product` | id, name, description, price, stock, practitionerId |
| `Order` / `OrderItem` | id, userId, items, totalAmount, status |
| `Payment` / `PaymentTransaction` | id, orderId, amount, status, gateway reference |
| `Cart` | id, userId, items |
| `Question` / `Answer` | id, userId, content, createdAt |
| `Recommendation` | id, userId, therapyType, reason |

### 9.2 Data Retention
- User data SHALL be retained as long as the account is active.
- Session records SHALL be retained indefinitely for history and audit purposes.
- Notification records SHOULD be retained for a minimum of 90 days.

---

## 10. Assumptions & Dependencies

### 10.1 Assumptions
- Users have access to a modern web browser and stable internet connection.
- Practitioners are responsible for the accuracy of their submitted certifications.
- The platform assumes good-faith usage; advanced fraud detection is out of scope.
- Admin accounts are pre-created; self-registration for admin role is not permitted.

### 10.2 Dependencies
| Dependency | Purpose |
|-----------|---------|
| Spring Boot 3.x | Backend framework |
| React 18.x | Frontend UI framework |
| MySQL 8.x | Primary data store |
| JWT (jjwt library) | Token-based authentication |
| Tailwind CSS | UI styling |
| Vite | Frontend build tool |
| Lombok | Java boilerplate reduction |
| Spring Data JPA | ORM / data access |
| Axios | HTTP client for API calls |

---

## 11. Glossary

| Term | Definition |
|------|-----------|
| **Alternative Therapy** | Non-conventional wellness practices such as yoga, acupuncture, naturopathy, aromatherapy, etc. |
| **Practitioner** | A wellness professional offering one or more alternative therapy services on the platform |
| **Patient** | A registered user seeking and booking therapy services |
| **JWT** | JSON Web Token — a compact, URL-safe token used for stateless authentication |
| **RBAC** | Role-Based Access Control — restricting system access based on user roles |
| **SRS** | Software Requirements Specification — this document |
| **CRUD** | Create, Read, Update, Delete — basic data operations |
| **REST** | Representational State Transfer — architectural style for web APIs |
| **MVC** | Model-View-Controller — a software design pattern |
| **Verification** | The admin process of approving a practitioner's credentials before they can offer services |
| **Session** | A scheduled therapy appointment between a patient and a practitioner |

---

*Prepared by: **Maaz Shaikh***
*Course: Software Engineering | Walchand Institute of Technology*
*Project: Wellness Marketplace for Alternative Therapies*
*Version: 1.0 | Date: April 2026*
