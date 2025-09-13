# 📅 Scheduler App

A modern, responsive scheduling application built with React, TypeScript, and Node.js. Easily manage your time slots, appointments, and daily schedule with an intuitive interface that works seamlessly across all devices.

## 🌐 Live Demo

Check out the live frontend here: [https://scheduler-vinny.vercel.app/](https://scheduler-vinny.vercel.app/)

## ✨ Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI with smooth interactions
- **Daily/Weekly View**: Switch between different time views
- **Add/Edit/Delete Slots**: Manage your schedule with ease
- **Notes Support**: Add important notes to your time slots
- **Today Highlighting**: Current day is clearly highlighted
- **Dark Mode**: Easy on the eyes in low-light conditions

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **State Management**: React Context API
- **Date Handling**: date-fns
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

## 📱 Mobile Responsiveness

The app is fully responsive and provides an optimized experience on mobile devices with:
- Touch-friendly controls
- Collapsible navigation
- Optimized layouts for different screen sizes
- Smooth scrolling and transitions

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
