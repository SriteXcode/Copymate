import React, { useEffect, useState } from "react";
import "./index.css";

function Popup() {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // or 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = "https://your-backend.onrender.com";  // Change to your deployed API URL

  useEffect(() => {
    chrome.storage.local.get(["jwt"]).then((res) => {
      if (res.jwt) {
        setToken(res.jwt);
        fetchNotes(res.jwt);
      }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id, { action: "getSelectedText" }, (res) => {
        if (res?.text) setText(res.text);
      });
    });
  }, []);

 const handleAuth = async () => {
  const endpoint = authMode === "signup" ? "/api/user/signup" : "/api/user/login";

  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      console.log(`✅ ${authMode === "signup" ? "Signed up" : "Logged in"} successfully`);

      setToken(data.token);
      chrome.storage.local.set({ jwt: data.token });

      // Clear inputs
      setEmail("");
      setPassword("");

      fetchNotes(data.token);
    } else {
      console.error("❌ Auth failed:", data.error || "Unknown error");
    }
  } catch (err) {
    console.error("❌ Auth error:", err);
  }
};


  const handleSave = async () => {
    await fetch(`${API}/api/notes/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: text, tag }),
    });
    setSaved(true);
    setText("");
    setTag("");
    fetchNotes(token);
    setTimeout(() => setSaved(false), 2000);
  };

  const fetchNotes = async (jwt) => {
    const res = await fetch(`${API}/api/notes/notes`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await res.json();
    setNotes(data.notes || []);
  };

  if (!token) {
    return (
      <div className="popup-container">
        <h2>SweetSave++ 💖</h2>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={handleAuth}>{authMode === "signup" ? "Sign Up" : "Log In"}</button>
        <p style={{ cursor: "pointer" }} onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}>
          {authMode === "signup" ? "Already have an account?" : "Create an account"}
        </p>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <h2>SweetSave++ 💾</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Selected text here..." />
      <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="#Tag" />
      <button onClick={handleSave}>Save</button>
      {saved && <p className="saved-msg">Saved! 💖</p>}
      <h3>Recent Notes</h3>
      <ul>
        {notes.map((n, i) => (
          <li key={i}>
            {n.content} <em>({n.tag})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Popup;
