import { useState } from "react";

function Signup({ onSignup, onLogin }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (event) => {
    event.preventDefault();

    setError("");

    if (name.trim() === "") {
      setError("Full name is required");
      return;
    }

    if (username.trim() === "") {
      setError("Username is required");
      return;
    }

    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    if (password.length < 4) {
      setError("Password must contain at least 4 characters");
      return;
    }

    if (confirmPassword.trim() === "") {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    onSignup(
      name.trim(),
      username.trim(),
      password
    );
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <div className="home-icon">
          ₹
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Start managing your daily expenses
        </p>

        <form onSubmit={handleSignup}>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <label>Username</label>

          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
          />

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="account-link">
          Already have an account?{" "}

          <button
            type="button"
            onClick={onLogin}
            className="link-button"
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default Signup;