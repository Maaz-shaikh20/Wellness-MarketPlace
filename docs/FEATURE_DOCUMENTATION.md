# 🧩 Feature Documentation
### Wellness Marketplace for Alternative Therapies – Group A

This document explains **all functional features** of the system, organized by user role.

---

## 👤 Patient Features

### 🔐 Authentication
- Patient registration
- Secure login using JWT
- Logout functionality

---

### 🔍 Browse Practitioners
- View all verified practitioners
- Filter practitioners by:
  - Therapy type
  - Specialization
- View practitioner profile details

---

### 📅 Appointment Booking
- Select practitioner
- Choose available time slots
- Book appointments
- View upcoming appointments
- View appointment history

---

### 👤 Profile Management
- Update personal details
- View booking history
- Manage account information

---

## 🧑‍⚕ Practitioner Features

### 🔐 Authentication
- Practitioner registration
- Login with restricted access (until verification)

---

### 📄 Verification Workflow
- Upload certification details
- Submit professional information
- Track verification status:
  - Pending
  - Approved
  - Rejected

---

### 🧑‍⚕ Profile Management
- Create professional profile
- Add therapy services
- Set availability
- Update personal and professional details

---

### 📋 Appointment Management
- View patient bookings
- Accept or manage appointments
- Track appointment history

---

## 🛡 Admin Features

### 🔐 Authentication
- Admin-only login
- Secure access to admin dashboard

---

### 🧑‍⚖ Practitioner Verification
- View list of unverified practitioners
- Review submitted documents
- Approve or reject practitioners
- Assign specialization and ratings

---

### 📊 System Monitoring
- View all registered users
- Monitor appointments
- Track platform activity

---

## 🔄 Feature Access Control

| Feature | Patient | Practitioner | Admin |
|-------|--------|-------------|------|
| Registration | ✅ | ✅ | ❌ |
| Login | ✅ | ✅ | ✅ |
| Book Appointment | ✅ | ❌ | ❌ |
| Manage Appointments | ❌ | ✅ | ❌ |
| Verify Practitioner | ❌ | ❌ | ✅ |

---

## 🔐 Security Features

- JWT-based authentication
- Role-based authorization
- Secured REST APIs
- Admin-only protected routes

---

## 📘 Related Documentation

- 👉 **[ARCHITECTURE_OVERVIEW.md](ARCHITECTURE_OVERVIEW.md)**
- 👉 **[API.md](API.md)**
- 👉 **[DATABASE.md](DATABASE.md)**
- 👉 **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)**

---

📌 _Wellness Marketplace for Alternative Therapies – Group A_
📚 _Feature-level documentation_


