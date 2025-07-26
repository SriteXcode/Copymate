import React, { useEffect, useState } from "react";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState("");

  const API = "http://localhost:3000";

  useEffect(() => {
    chrome.storage.local.get(["jwt"]).then((res) => {
      const jwt = res.jwt;
      setToken(jwt);
      fetchData(jwt);
    });
  }, []);

  const fetchData = async (jwt) => {
    const userRes = await fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const noteRes = await fetch(`${API}/admin/notes`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const userData = await userRes.json();
    const noteData = await noteRes.json();
    setUsers(userData.users);
    setNotes(noteData.notes);
  };

  const deleteUser = async (id) => {
    await fetch(`${API}/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData(token);
  };

  const deleteNote = async (id) => {
    await fetch(`${API}/admin/note/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData(token);
  };

  return (
    <div className="dashboard-container">
      <h2>🛡️ Admin Panel</h2>
      <h3>👥 Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.email} <button onClick={() => deleteUser(u._id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
      <h3>📝 All Notes</h3>
      <ul>
        {notes.map((n) => (
          <li key={n._id}>
            {n.content} ({n.tag}) <button onClick={() => deleteNote(n._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}



