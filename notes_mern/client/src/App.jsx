import React, { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("syncnotes_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("syncnotes_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("syncnotes_user");
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans antialiased selection:bg-indigo-500/20">
      {/* Toast Notification Provider with light/dark adaptive styling */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "border border-app-border bg-app-card text-app-text text-xs font-bold rounded-xl shadow-lg backdrop-blur-xs",
          duration: 3500,
          style: {
            padding: "10px 14px",
            background: "var(--color-card)",
            color: "var(--color-text-primary)",
            borderColor: "var(--color-border)"
          },
        }}
      />
      
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Auth onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
