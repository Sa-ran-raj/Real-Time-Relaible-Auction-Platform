import { useEffect, useState } from "react";
import axios from "axios";

function AdminPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/admin", { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>Access Denied or Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {user.displayName}</p>
      <p>Email: {user.email}</p>
      {/* Add more features like: user list, logs, controls */}
    </div>
  );
}

export default AdminPage;
