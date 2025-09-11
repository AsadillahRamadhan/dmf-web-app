// import { useState } from 'react';
// import { HomePage } from './components/HomePage';
// import { HistoryPage } from './components/HistoryPage';
// import { UserPage } from './components/UserPage';
// import { BottomNavigation } from './components/BottomNavigation';
// import { LoginForm } from './components/LoginForm';
// import { RegisterForm } from './components/RegisterForm';

// interface UserData {
//   name: string;
//   id: string;
//   status: string;
//   email: string;
//   phone: string;
//   joinDate: string;
// }

// export default function App() {
//   const [activeTab, setActiveTab] = useState<'home' | 'history' | 'user'>('home');
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
//   const [userData, setUserData] = useState<UserData | null>(null);

//   const handleLogin = (user: UserData) => {
//     setUserData(user);
//     setIsAuthenticated(true);
//   };

//   const handleRegister = (user: UserData) => {
//     setUserData(user);
//     setIsAuthenticated(true);
//   };

//   const handleLogout = () => {
//     setUserData(null);
//     setIsAuthenticated(false);
//     setActiveTab('home');
//   };

//   const renderContent = () => {
//     if (!userData) return null;

//     switch (activeTab) {
//       case 'home':
//         return <HomePage userData={userData} />;
//       case 'history':
//         return <HistoryPage />;
//       case 'user':
//         return <UserPage userData={userData} onLogout={handleLogout} />;
//       default:
//         return <HomePage userData={userData} />;
//     }
//   };

//   // Show authentication forms if not logged in
//   if (!isAuthenticated) {
//     if (authMode === 'login') {
//       return (
//         <LoginForm 
//           onLogin={handleLogin}
//           onSwitchToRegister={() => setAuthMode('register')}
//         />
//       );
//     } else {
//       return (
//         <RegisterForm 
//           onRegister={handleRegister}
//           onSwitchToLogin={() => setAuthMode('login')}
//         />
//       );
//     }
//   }

//   // Show main app if authenticated
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Main content area with bottom padding for navbar */}
//       <div className="p-4 pb-20">
//         <div className="max-w-md mx-auto">
//           {renderContent()}
//         </div>
//       </div>
      
//       {/* Bottom Navigation */}
//       <BottomNavigation 
//         activeTab={activeTab} 
//         onTabChange={setActiveTab} 
//       />
//     </div>
//   );
// }

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenticateRoute, IsAuthenticatedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./components/HomePage";
import { LoginForm } from "./components/LoginForm";
import { HistoryPage } from "./components/HistoryPage";
import { UserPage } from "./components/UserPage";
import { RegisterForm } from "./components/RegisterForm";
import { Layout } from "./components/Layout"; // pakai layout baru
import React from "react";

function App() {
  const [activeTab, setActiveTab] = React.useState<"home" | "history" | "user">("home");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthenticateRoute>
              <Layout activeTab={activeTab} onTabChange={setActiveTab}>
                <HomePage />
              </Layout>
            </AuthenticateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <IsAuthenticatedRoute>
              <LoginForm />
            </IsAuthenticatedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <IsAuthenticatedRoute>
              <RegisterForm />
            </IsAuthenticatedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <AuthenticateRoute>
              <Layout activeTab={activeTab} onTabChange={setActiveTab}>
                <HomePage />
              </Layout>
            </AuthenticateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <AuthenticateRoute>
              <Layout activeTab={activeTab} onTabChange={setActiveTab}>
                <HistoryPage />
              </Layout>
            </AuthenticateRoute>
          }
        />
        <Route
          path="/user"
          element={
            <AuthenticateRoute>
              <Layout activeTab={activeTab} onTabChange={setActiveTab}>
                <UserPage />
              </Layout>
            </AuthenticateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;