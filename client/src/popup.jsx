import React, { useState } from "react";

const API = "https://your-backend.onrender.com";  // Change to your deployed API URL
 // 🔁 Change this to your deployed backend URL

export default function Popup() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔐 Attempting login:", { email, password });

    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("✅ Login response:", data);

      if (res.ok) {
        const token = data.token;
        await chrome.storage.local.set({ jwt: token });
        console.log("🔑 Token saved to chrome.storage:", token);
        setLoggedIn(true);

        // Clear fields
        setEmail("");
        setPassword("");
      } else {
        console.error("❌ Login failed:", data.message || "Unknown error");
      }
    } catch (err) {
      console.error("🚨 Login error:", err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("📝 Attempting signup:", { name, email, password });

    try {
      const res = await fetch(`${API}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("✅ Signup response:", data);

      if (res.ok) {
        const token = data.token;
        await chrome.storage.local.set({ jwt: token });
        console.log("🔑 Token saved to chrome.storage:", token);
        setLoggedIn(true);

        // Clear fields
        setName("");
        setEmail("");
        setPassword("");
      } else {
        console.error("❌ Signup failed:", data.message || "Unknown error");
      }
    } catch (err) {
      console.error("🚨 Signup error:", err);
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial", width: "250px" }}>
      {loggedIn ? (
        <h3>🎉 You're logged in!</h3>
      ) : (
        <>
          <h2>{isLogin ? "Login" : "Signup"}</h2>
          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "0.5rem",
                  padding: "0.4rem",
                }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                display: "block",
                width: "100%",
                marginBottom: "0.5rem",
                padding: "0.4rem",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                display: "block",
                width: "100%",
                marginBottom: "0.5rem",
                padding: "0.4rem",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: "#6a5acd",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              {isLogin ? "Login" : "Signup"}
            </button>
          </form>

          <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            {isLogin ? "New user?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                color: "#6a5acd",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {isLogin ? "Signup here" : "Login here"}
            </button>
          </p>
        </>
      )}
    </div>
  );
}
