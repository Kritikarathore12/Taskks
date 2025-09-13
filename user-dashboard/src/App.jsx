import React, { useEffect, useState } from "react";
import UsersTable from "./components/UserTable";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export default function App() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message || "Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app">
      <h1>Users Dashboard</h1>
      <p className="subtitle">Sortable · Searchable · Paginated · Expandable</p>

      {loading && <div className="status">Loading users…</div>}
      {error && <div className="status error">Error: {error}</div>}
      {!loading && !error && users && <UsersTable initialData={users} />}
    </div>
  );
}