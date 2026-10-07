import { useState } from "react";

function Login({ onLogin, onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");

    if (username.trim() === "") {
      setError("Username is required");
      return;
    }

    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    const savedUser = localStorage.getItem("expenseTrackerUser");

    if (!savedUser) {
      setError("No account found. Please create an account first.");
      return;
    }

    const userData = JSON.parse(savedUser);

    if (
      username.trim() !== userData.username ||
      password !== userData.password
    ) {
      setError("Invalid username or password");
      return;
    }

    onLogin(userData.name);
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <div className="home-icon">
          ₹
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to manage your daily expenses
        </p>

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        <p className="account-link">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={onSignup}
            className="link-button"
          >
            Create Account
          </button>
        </p>

      </div>

    </div>
  );
}

export default Login;