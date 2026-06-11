# ⚙ Implementation Guide
### Wellness Marketplace for Alternative Therapies – Group A

This guide provides **step-by-step instructions** to set up, run, test, and deploy the Wellness Marketplace application locally.

---

## 🧾 Prerequisites

Ensure the following are installed on your system:

- Node.js (v16+ recommended)
- npm or yarn
- Java JDK 17+
- Maven
- PostgreSQL Server
- Git

---

## 📂 Repository Structure
Wellness-Marketplace-for-Alternative-Therapies-Group-A/ ├── backend/ ├── frontend/ ├── *.md (documentation files) └── docker-compose.yml
---

## 🗄 Database Setup (PostgreSQL)

1. Open PostgreSQL client (like psql or pgAdmin)
2. Create database:
   ```sql
   CREATE DATABASE wellness_marketplace;
   ```
3. Update database credentials in:
   `backend/src/main/resources/application.properties`
   Example:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/wellness_marketplace
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

⚙ Backend Setup (Spring Boot)
Navigate to backend folder:

cd backend
Build the project:

mvn clean install
Run the backend server:

mvn spring-boot:run
✅ Backend will run at:
http://localhost:8080
🎨 Frontend Setup (React)
Navigate to frontend folder:

cd frontend
Install dependencies:

npm install
Start the frontend:

npm start
✅ Frontend will run at:
http://localhost:5173
🔐 Authentication Configuration
JWT-based authentication
Tokens generated on login
Role-based route protection
Ensure frontend API base URL matches backend URL.
🧪 Testing the Application
Manual Testing
Register as Patient
Register as Practitioner
Login as Admin
Verify Practitioner
Book Appointments
API Testing
Import Postman collection: 👉 wellness-marketplace.postman_collection.json
🚀 Deployment (Optional)
Build Frontend
Copy code
Bash
npm run build
Build Backend
Copy code
Bash
mvn clean package
Using Docker (Optional)
Copy code
Bash
docker-compose up --build
✅ Verification Checklist
Before deployment, ensure:
Backend runs without errors
Frontend connects to backend
Database tables auto-created
JWT authentication works
Admin verification works
👉 Refer: IMPLEMENTATION_CHECKLIST.md
🆘 Troubleshooting
Database connection errors → Check PostgreSQL credentials
CORS issues → Verify backend CORS configuration
API errors → Check backend logs
📘 Related Documentation
👉 QUICK_REFERENCE.md
👉 ARCHITECTURE_OVERVIEW.md
👉 API.md
📌 Wellness Marketplace for Alternative Therapies – Group A
📚 Implementation & setup guide
