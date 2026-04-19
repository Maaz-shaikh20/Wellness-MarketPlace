
# 🚀 API Documentation  
### Wellness Marketplace for Alternative Therapies – Group A

This document lists the **main REST API endpoints** used by the system.

---

## 🔐 Authentication APIs

- `POST /api/auth/register`
- `POST /api/auth/login`

---

## 👤 Patient APIs

- `GET /api/patient/profile`
- `POST /api/patient/appointments`
- `GET /api/patient/appointments`

---

## 🧑‍⚕ Practitioner APIs

- `GET /api/practitioner/profile`
- `POST /api/practitioner/services`
- `GET /api/practitioner/appointments`

---

## 🛡 Admin APIs

- `GET /api/admin/unverified-practitioners`
- `POST /api/admin/verify-practitioner`
- `GET /api/admin/users`

---

## 🔐 Security
- JWT required for protected endpoints
- Role validation on each request

---

📌 _Wellness Marketplace for Alternative Therapies – Group A_  
📚 _API reference_

