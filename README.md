# 💰 FinTrack — Personal Finance & Budget Tracking Application

A full-stack web application to track income, expenses, budgets, and financial insights through a structured dashboard.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |

## ✨ Features

- ✅ JWT Authentication (Register / Login / Logout)
- ✅ Income & Expense transaction management
- ✅ Filter transactions by date, category, and type
- ✅ Budget management with real-time spending progress
- ✅ Over-budget visual alerts
- ✅ Category management (income & expense)
- ✅ Dashboard with summary cards and charts
- ✅ Responsive dark UI

## 📁 Project Structure

finance-tracker/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/mdewmini/finance-tracker.git
cd finance-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Configure environment variables
Create a `.env` file inside the `backend/` folder:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=8000
```

### 4. Run the backend
```bash
npm run dev
```
Backend runs on: `http://localhost:8000`

### 5. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

### 6. Run the frontend
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 7. Database
- Create a free MongoDB Atlas cluster at https://cloud.mongodb.com
- Get the connection string and paste it in `MONGO_URI`
- Allow network access from anywhere (0.0.0.0/0)

## 📊 Dashboard Preview

- Total Income / Expenses / Balance summary cards
- Monthly Income vs Expenses bar chart
- Expense distribution pie chart
- Budget progress bars with over-budget alerts
- Recent transactions list

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get all transactions |
| POST | /api/transactions | Add transaction |
| PUT | /api/transactions/:id | Update transaction |
| DELETE | /api/transactions/:id | Delete transaction |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/budgets | Get all budgets |
| POST | /api/budgets | Create budget |
| PUT | /api/budgets/:id | Update budget |
| DELETE | /api/budgets/:id | Delete budget |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

## 👩‍💻 Author

**Maheesha Dewmini**  
BSc (Hons) Software Engineering — University of Plymouth  
GitHub: [@mdewmini](https://github.com/mdewmini)