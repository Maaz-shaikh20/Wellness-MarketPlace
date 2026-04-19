
# ⚡ Quick Reference
### Wellness Marketplace for Alternative Therapies – Group A

This document is designed for **quick lookup**, **fast testing**, and **troubleshooting**.

---

## 🚀 Application URLs

| Service | URL |
|------|----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080 |

---

## 🔑 Default Roles

| Role | Description |
|----|-------------|
| Patient | Books therapy sessions |
| Practitioner | Provides therapy services |
| Admin | Verifies and manages users |

---

## 🔐 Authentication Flow

1. User registers
2. User logs in
3. JWT token issued
4. Token stored in frontend
5. Token sent in `Authorization` header

---

## 📡 Common API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Patient
- `GET /api/patient/profile`
- `POST /api/patient/book`

### Practitioner
- `GET /api/practitioner/appointments`
- `POST /api/practitioner/services`

### Admin
- `GET /api/admin/unverified`
- `POST /api/admin/verify`

---

## 🧪 Quick Test Checklist

✅ Backend running
✅ Frontend running
✅ Database connected
✅ Login works
✅ JWT token received
✅ Role-based access enforced

---

## 🆘 Common Issues & Fixes

### ❌ Backend not starting
✔ Check Java version
✔ Check database credentials

---

### ❌ Frontend not connecting to backend
✔ Verify API base URL
✔ Check CORS configuration

---

### ❌ Unauthorized errors
✔ Check JWT token
✔ Ensure role permissions

---

## 🧰 Useful Files

- API reference → **[API.md](API.md)**
- Setup steps → **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)**
- Feature list → **[FEATURE_DOCUMENTATION.md](FEATURE_DOCUMENTATION.md)**

---

📌 _Wellness Marketplace for Alternative Therapies – Group A_
📚 _Quick reference & troubleshooting_
