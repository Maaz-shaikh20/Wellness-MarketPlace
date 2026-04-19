# Deployment Plan and Execution Report

**Project Name:** Wellness Marketplace for Alternative Therapies  
**Assignment:** 5  
**Date:** April 19, 2026  

---

## 1. Introduction
This document outlines the deployment strategy and execution plan for transitioning the Wellness Marketplace system from a local development environment to a production-ready environment. The goal is to ensure high availability, scalability, and security using modern containerization and orchestration techniques.

---

## 2. Deployment Architecture
The system follows a containerized microservices architecture:

- **Frontend:** React (Vite) application served via Nginx.
- **Backend:** Spring Boot (Java 17) REST API.
- **Database:** MySQL 8.0 instance with persistent volume storage.
- **Orchestration:** Docker Compose for multi-container coordination.

---

## 3. Deployment Procedure

### 3.1 Environment Verification
Before execution, the following prerequisites must be met:
- Production server (AWS EC2, DigitalOcean, or similar) with Docker and Docker Compose installed.
- Valid SSL certificates (Let's Encrypt/Certbot).
- Environment variables configured for production (Database credentials, JWT secrets).

### 3.2 Step-by-Step Execution
1.  **Code Packaging:**
    - Build the backend JAR using Maven: `mvn clean package`.
    - Build the frontend production bundle: `npm run build`.
2.  **Containerization:**
    - Use `Dockerfile` to create immutable images for both services.
3.  **Orchestration:**
    - Deploy using Docker Compose: `docker-compose up -d --build`.
    - This command initializes the database, backend, and frontend containers in the correct order.
4.  **Database Migration:**
    - The backend uses Hibernate DDL-Auto to initialize schemas on first run.

---

## 4. Risk Mitigation and Rollback

| Risk Factor | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Data Loss** | Critical | Automated daily snapshots of the `db_data` volume to S3. |
| **Downtime** | High | Implement a Blue-Green deployment strategy using Nginx as a reverse proxy. |
| **Security Breach** | Critical | Store secrets in environment variables (not in code). Use a private network for the database container. |
| **Compatibility** | Medium | Use specific version tags (e.g., `mysql:8.0`) instead of `latest` to ensure consistency. |

**Rollback Procedure:** In case of deployment failure, use `docker-compose down` followed by `docker checkout <previous_stable_tag>` and `docker-compose up -d` to restore the last known working state.

---

## 5. Stakeholder Coordination
The deployment process involves coordination with the following stakeholders:
- **DevOps Team:** For infrastructure provisioning and CI/CD pipeline setup.
- **QA Team:** To perform smoke tests immediately after deployment.
- **Product Owner:** To approve the final production release.

---

## 5. Cloud-Specific Deployment (Vercel & Render)

### Frontend: Vercel
- **Root Directory:** `frontend`
- **Environment Variables:** `VITE_API_URL` = [Render URL]/api
- **SPA Routing:** Configured in `frontend/vercel.json`.

### Backend: Render
- **Blueprint:** Automatic deployment via `render.yaml`.
- **Services:** Provisions a Managed MySQL instance and a Docker-based Web Service for the Java backend.

---

## 6. Conclusion
The deployment of the Wellness Marketplace has been planned with a focus on reliability and "Infrastructure as Code" (IaC). By using Docker and Docker Compose, we have ensured that the production environment is an exact mirror of the testing environment, significantly reducing the risk of "it works on my machine" issues.

---

## 7. Deployment Assets Created
- `backend/Dockerfile`: For containerizing the Spring Boot API.
- `frontend/Dockerfile`: For serving the React UI via Nginx.
- `docker-compose.yml`: For full-system orchestration.
