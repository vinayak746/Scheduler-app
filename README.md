# 📅 Scheduler App

An advanced, full-stack scheduling application designed for seamless daily and weekly planning. Built with React, TypeScript, Node.js, and PostgreSQL, Scheduler App lets you manage your time slots, appointments, and exceptions with a beautiful, modern interface. Experience real-time updates, mobile-first design, and robust backend logic for all your scheduling needs.

## 🌐 Live Demo

👉 Try it now: [Live Scheduler Frontend](https://scheduler-vinny.vercel.app/)

## ✨ Features

### 🌟 Core Features

- **Beautiful Calendar UI**: Modern, clean, and responsive calendar for daily and weekly views
- **Add, Edit & Delete Time Slots**: Easily manage your schedule with intuitive controls
- **Slot Notes**: Attach notes to any slot for extra context
- **Recurring Schedules**: Set up weekly recurring slots (with max 2 per day)
- **One-Time Exceptions**: Override or cancel slots for specific dates
- **Real-Time Feedback**: Toast notifications for all actions (add, edit, delete)
- **Today Highlighting**: Instantly spot the current day in your calendar
- **Mobile-First Design**: Optimized for phones, tablets, and desktops
- **Fast Loading**: Loading spinners and error handling for smooth UX
- **Backend Health Check**: Automatic reconnection if backend is down


### 🛡️ Backend Logic

- **Express + PostgreSQL**: Robust REST API for all schedule operations
- **Business Rules**: Enforces max 2 slots per day and per exception
- **Exception Handling**: Supports overrides and cancellations for any date
- **Secure & Fast**: Uses parameterized queries and transactions for data integrity

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, date-fns, react-hot-toast
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **State Management**: React Context API
- **Build Tool**: Vite
- **Linting**: ESLint, Prettier

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scheduler-app.git
   cd scheduler-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
    
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the `backend` directory:
     ```
     PORT=5000
     NODE_ENV=development
     ```

      - Set up PostgreSQL and add your connection string to `.env` as `DATABASE_URL`

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

The backend runs on port 3001 by default. The frontend connects automatically via environment variables.

## 📱 Mobile Responsiveness

Scheduler App is fully responsive:
- Touch-friendly controls
- Collapsible navigation
- Optimized layouts for all screen sizes
- Smooth transitions and animations

## 🎨 Design System

- **Colors**:
  - Primary: `#4f46e5` (Indigo)
  - Background: `#ffffff` (White)
  - Text: `#1f2937` (Gray-900)
  - Accent: `#6366f1` (Indigo-500)

- **Typography**:
  - Primary Font: Inter
  - Monospace: Fira Code

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [date-fns](https://date-fns.org/)
- [Vite](https://vitejs.dev/)
