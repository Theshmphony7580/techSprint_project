# Government Project Transparency Platform 🏛️

**A Blockchain-inspired Ledger for Public Accountability**

This platform creates a tamper-proof digital record of government projects. It allows citizens to track progress, file verified complaints, and view real-time feedback, while enabling government officials to manage projects transparently.

![Dashboard Preview](https://via.placeholder.com/800x400?text=GovTransparency+Dashboard)

---

## 🚀 Key Features

*   **Public Transparency Portal**: View all sanctioned projects, budgets, and timelines without logging in.
*   **Immutable Ledger**: Every project update (creation, progress, completion) is hashed and chained. Data cannot be secretly altered.
*   **Citizen Feedback**: File complaints with image/PDF evidence. Track status from "Submitted" to "Resolved".
*   **Admin Dashboard**:
    *   Sanction new projects.
    *   Verify government employee accounts.
    *   View real-time analytics (Budget vs Spent, Completion Rates).
*   **Security**: Role-Based Access Control (RBAC), JWT Authentication, Rate Limiting, and Document Integrity Hashing.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Shadcn/UI, Lucide Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: SQLite (Dev) / PostgreSQL (Supported via Prisma), Prisma ORM.
*   **Security**: Zod (Validation), BCrypt (Hashing), JWT (Auth), SHA-256 (File Integrity).

---

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js (v18 or higher)
*   npm

### 1. Clone the Repository
```bash
git clone <repository-url>
cd techSprint
```

### 2. Backend Setup (Server)
```bash
cd server
npm install

# Create .env file
echo "PORT=3001" > .env
echo "DATABASE_URL=\"file:./dev.db\"" >> .env
echo "JWT_SECRET=\"supersecretkey_change_me_in_prod\"" >> .env

# Initialize Database
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Frontend Setup (Client)
```bash
# Open a new terminal
cd client
npm install
```

---

## ▶️ Running the Application

You need to run both the Client and Server terminals simultaneously.

**Terminal 1 (Server):**
```bash
cd server
npm run dev
# Server running at http://localhost:3001
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
# Client running at http://localhost:5173
```

---

## 📖 User Guide: Step-by-Step

### 1. For Public Users (Citizens)
*   **View Projects**: Go to the Home page. Click "Explore Projects" to see the list.
*   **Check Details**: Click "View Details" on any project to see its timeline, budget, and location.
*   **File a Complaint**:
    1.  Open a Project Page.
    2.  Click **"Report Issue / File Complaint"**.
    3.  Log in (or Sign Up) as a Public User.
    4.  Fill the form: Select Type (Delay/Corruption), Describe issue, Upload Proof image.
    5.  Submit. You will see it listed under "Citizen Complaints".

### 2. For Administrators
*   **Login**: Use credentials `admin@gov.in` / `password`.
*   **Admin Dashboard**:
    *   **Verify Users**: Toggle "Verify" on pending Government Employees to grant them access.
    *   **Analytics**: View the top cards for Total Budget and Complaint Stats.
*   **Sanction Project**:
    *   Go to "Government Dashboard" (via Profile menu).
    *   Fill "Create New Project" form (Name, Budget, District).
    *   Click "Sanction". This creates the **Genesis Block** in the ledger.

### 3. For Government Employees
*   **Login**: Use your official email (e.g., `demo@gov.in`).
*   **Update Progress**:
    1.  Go to a Project you oversee.
    2.  Click "Add Event" (if authorized).
    3.  Select "Progress Update" and enter percentage (e.g., 50%).
    4.  This adds a new **Immutable Block** to the timeline.
*   **Resolve Complaints**:
    1.  Scroll to "Citizen Complaints".
    2.  Click **"Respond & Resolve"** on any open complaint.
    3.  Enter the official resolution action. The status updates to `RESOLVED`.

---

## 🔒 Security Features Explained

*   **Rate Limiting**: The API blocks IPs making >100 requests/minute to prevent DDoS.
*   **File Hashing**: When you upload evidence, we calculate its `SHA-256` hash. This ensures the file stored on the server matches exactly what was uploaded, preventing tampering.
*   **JWT Auth**: Sessions are stateless and secure.
*   **Input Validation**: All forms (Login, Project Creation) are strictly validated using `Zod` schema to prevent bad data or injection attacks.

---

## 📂 Project Structure

```
techSprint/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/ui/  # Reusable UI components (Buttons, Cards)
│   │   ├── pages/          # Main Pages (Dashboard, ProjectDetails)
│   │   ├── context/        # Auth Context
│   │   └── ...
├── server/                 # Express Backend
│   ├── prisma/             # Database Schema (SQLite)
│   ├── src/
│   │   ├── controllers/    # Request Handlers
│   │   ├── services/       # Business Logic (Ledger, Notifications)
│   │   ├── routes/         # API Routes defined here
│   │   └── middleware/     # Auth & Validation Middleware
│   └── uploads/            # Stored evidence files
└── README.md               # You are here!
```
