# EduSync Server

The backend for the **EduSync School Management System**. Built with Node.js, Express, and MongoDB.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port `27017`)

### Installation

1.  Navigate to the server directory:
    ```bash
    cd server
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - Update `.env` with your configuration (if needed). Default values work for local development.

### Running the Server

-   **Development Mode** (with hot-reload):
    ```bash
    npm run dev
    ```
    Server runs at `http://localhost:5001`.

-   **Seed Database** (Populate with demo data):
    ```bash
    npm run seed
    ```
    **Note:** This clears existing data and creates demo accounts.

## 📂 Project Structure

```
server/
├── server.js           # Entry point
├── src/
│   ├── config/         # Database configuration
│   ├── middleware/     # Custom middleware (Auth, Error Handling)
│   ├── models/         # Mongoose Schemas (Data Models)
│   ├── routes/         # API Route definitions
│   ├── seed/           # Database Seeding script
│   └── utils/          # Helper functions (Calculations, etc.)
└── .env                # Environment variables
```

## 🧱 Key Components

### 1. Models (`src/models/`)
Defines the structure of your data.
-   `User.js`: Base user for authentication (Super Admin, School Admin, Teacher, Student, Parent).
-   `School.js`: Tenant details for multi-tenancy.
-   `Student.js`: Student profiles linked to a User account.
-   `Staff.js`: Teacher and Staff profiles linked to a User account.
-   `Class.js`: Academic classes and sections.
-   `Attendance.js`: Daily attendance records.
-   `Exam.js` & `Result.js`: Examination management.
-   `Fee.js`: Fee structures and payment tracking.

### 2. Routes (`src/routes/`)
API endpoints extending `/api/`.
-   `/auth`: Login and authentication.
-   `/schools`: School management (Super Admin).
-   `/users`: User management.
-   `/students`: Student admission and retrieval.
-   `/academics`: Timetables, etc.

### 3. Middleware (`src/middleware/`)
-   `auth.js`: Verifies JWT tokens and checks user roles (`protect`, `authorize(...)`).
-   `errorHandler.js`: Centralized error handling.

## 🛠️ Customization Guide

### Adding a New API Module
1.  **Create Model**: Add a new file in `src/models/` (e.g., `Event.js`).
2.  **Create Route**: Add a new file in `src/routes/` (e.g., `event.routes.js`).
    -   Define endpoints (`router.get`, `router.post`).
    -   Import your Model.
3.  **Register Route**: In `server.js`, import and use the route:
    ```javascript
    app.use('/api/events', require('./src/routes/event.routes'));
    ```

### Changing Business Logic
-   **Grade Calculations**: Modify `src/utils/calculations.js`.
-   **Permission Rules**: Update `authorize(...)` calls in route files.

## 🔐 Demo Credentials
Check the console output after running `npm run seed`. Default password for all demo accounts is usually `Admin@123`, `Teacher@123`, `Student@123`, or `Parent@123`.
