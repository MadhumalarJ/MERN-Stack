import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";

function App() {
  const [page, setPage] = useState("home");
  const [username, setUsername] = useState("");

  // Sign Up
  const handleSignup = (name, username, password) => {
    const userData = {
      name: name,
      username: username,
      password: password
    };

    localStorage.setItem(
      "expenseTrackerUser",
      JSON.stringify(userData)
    );

    setPage("login");
  };

  // Login
  const handleLogin = (name) => {
    setUsername(name);
    setPage("dashboard");
  };

  // Logout
  const handleLogout = () => {
    setUsername("");
    setPage("home");
  };

  // Sign Up Page
  if (page === "signup") {
    return (
      <Signup
        onSignup={handleSignup}
        onLogin={() => setPage("login")}
      />
    );
  }

  // Login Page
  if (page === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => setPage("signup")}
      />
    );
  }

  // Dashboard Page
  if (page === "dashboard") {
    return (
      <Dashboard
        username={username}
        onLogout={handleLogout}
      />
    );
  }

  // Home Page
  return (
    <div className="home-page">

      <div className="home-container">

        <div className="home-icon">
          ₹
        </div>

        <h1>
          Daily <span className="home-highlight">Expense Tracker</span>
        </h1>

        <p>
          Take control of your daily spending.
          Track your expenses, understand your spending habits,
          and manage your money with ease.
        </p>

        <div className="home-buttons">

          <button
            className="primary-button"
            onClick={() => setPage("signup")}
          >
            Create Account
          </button>

          <button
            className="secondary-button"
            onClick={() => setPage("login")}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;