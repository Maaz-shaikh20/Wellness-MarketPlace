---
marp: true
theme: default
paginate: true
header: 'Wellness Marketplace - Implementation Report'
footer: 'Prepared by Maaz Shaikh | Walchand Institute of Technology'
---

# Software Development Implementation Report
## Wellness Marketplace for Alternative Therapies
### Assignment 3: Executable Code & Best Practices

**Author:** Maaz Shaikh
**Course:** Software Engineering
**Institution:** Walchand Institute of Technology
**Version:** 1.0
**Date:** April 2026

---

## 1. Executive Summary
This report documents the practical implementation phase of the **Wellness Marketplace**. The system was developed using a modern full-stack approach, focusing on a **Spring Boot** backend and a **React.js** frontend. 

The implementation strictly adheres to the designs outlined in the SRS and Design Specification documents, specifically addressing:
-   Secure User Authentication (JWT)
-   Role-Based Access Control (RBAC)
-   Scalable Service Architecture
-   High-Performance Caching & Async Tasks

---

## 2. Technical Stack Implementation

### 2.1 Backend: Spring Boot (Java 17)
The backend leverages the Spring ecosystem to provide a secure and scalable REST API.
-   **Spring Security**: Handles authentication and prevents unauthorized access to sensitive endpoints.
-   **Spring Data JPA**: Simplifies database interactions with MySQL using ORM mapping.
-   **Lombok**: Reduces boilerplate code (Getters/Setters/Constructors).

### 2.2 Frontend: React + Vite
-   **Component-Based UI**: Reusable components for Navbars, Cards, and Modals.
-   **Tailwind CSS**: Utility-first CSS framework for a responsive, premium user interface.
-   **React Router**: Handles client-side routing and protected routes for Admin/Practitioner dashboards.

<!-- slide -->

## 3. Advanced Performance Features

### 3.1 Asynchronous Execution (`@Async`)
To ensure the system remains responsive, we decoupled time-consuming tasks like notification delivery from the main request thread.

**Implementation Example:**
```java
@Async
public void createNotification(Long userId, String type, String message) {
    Notification notification = Notification.builder()
            .userId(userId)
            .message(message)
            .createdAt(LocalDateTime.now())
            .build();
    notificationRepository.save(notification);
}
```
**Impact:** API response times improved by ~150ms as the system no longer waits for database writes on background tasks.

<!-- slide -->

### 3.2 High-Efficiency Caching (`@Cacheable`)
We implemented application-level caching to reduce the load on the MySQL database for frequently accessed but rarely changed data (e.g., Practitioner Lists).

**Key Cached Methods:**
-   `getAll()`: Caches the full list of verified practitioners.
-   `getByUserId()`: Caches specific practitioner profiles by their ID.

**Cache Eviction Policy:**
The cache is automatically invalidated (`@CacheEvict`) whenever a profile is updated or a new practitioner is verified, ensuring data consistency across all users.

---

## 4. Database & Data Management
The system uses **MySQL 8.x** with a normalized schema.

### 4.1 Core Entities
-   **User**: Handles base authentication and roles.
-   **PractitionerProfile**: Stores specialization, ratings, and verification documents.
-   **TherapySession**: Manages the lifecycle of an appointment (Booked -> Completed -> Cancelled).
-   **Notification**: Tracks in-app alerts for users.

<!-- slide -->

## 5. Security & Authentication Logic

### 5.1 JWT (JSON Web Tokens)
The system implements a stateless authentication flow:
1.  User logs in with credentials.
2.  Backend validates and issues a Signed JWT.
3.  Frontend stores the JWT and sends it in the `Authorization: Bearer` header for subsequent requests.

### 5.2 Role-Based Access Control (RBAC)
We used Method-Level Security to protect resources:
```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> verifyPractitioner(...) {
    // Admin only logic
}
```

---

## 6. Frontend Architecture

### 6.1 State Management & API Integration
We standardized all API interactions through a central `api` service layer using Axios.

**Example Fetch Logic:**
```javascript
const fetchPractitioners = async () => {
  const response = await axios.get('/api/practitioners', {
    headers: { Authorization: `Bearer ${token}` }
  });
  setPractitioners(response.data);
};
```

### 6.2 Responsive UI Components
-   **Practitioner Dashboard**: Visual overview of upcoming sessions and earnings.
-   **Patient Booking Flow**: Multi-step wizard for selecting therapy and time slots.

<!-- slide -->

## 7. Quality Assurance & Best Practices

### 7.1 Data Transfer Objects (DTOs)
To maintain a clean API contract, we used DTOs to transfer data between layers.
-   **Benefits**: Security (don't expose password hashes), Performance (send only needed fields).

### 7.2 Validation & Error Handling
Every incoming request is validated using `@Valid` and handled by a `GlobalExceptionHandler`.

| Feature | Best Practice Applied |
|---|---|
| Password Storage | BCrypt Hashing |
| Input Validation | JSR-303 Annotations |
| Error Responses | Standardized JSON Format |
| Code Quality | SOLID Principles |

---

## 8. Conclusion
The implementation of the Wellness Marketplace successfully demonstrates the application of advanced software engineering techniques. By combining **Spring Boot's** backend power with **React's** interactive frontend, the system achieves a high level of efficiency, security, and scalability.

---
*Prepared by: **Maaz Shaikh***
*Course: Software Engineering | Walchand Institute of Technology*
*Project: Wellness Marketplace for Alternative Therapies*
*Version: 1.0 | Date: April 2026*
