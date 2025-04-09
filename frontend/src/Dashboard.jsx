import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const navigate = useNavigate();

  // Fetch user info
  useEffect(() => {
    axios.get("http://localhost:5000/dashboard", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setLoadingUser(false);
      })
      .catch(() => {
        setUser(null);
        setLoadingUser(false);
      });
  }, []);

  // Fetch items only if user is a regular user
  useEffect(() => {
    if (user?.role === "user") {
      axios.get("http://localhost:5000/api/auction/mine", { withCredentials: true })
        .then((res) => {
          setItems(res.data);
          setLoadingItems(false);
        })
        .catch(() => {
          setItems([]);
          setLoadingItems(false);
        });
    }
  }, [user]);

  if (loadingUser) return <p className="text-center mt-20 text-xl">Loading user...</p>;
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Profile Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Welcome, {user.displayName}!</h1>
        <img src={user.photo} alt="Profile" className="w-20 h-20 rounded-full mx-auto mt-4" />
        <p className="mt-2 text-lg text-gray-700">Email: {user.email}</p>

        {user.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Go to Admin Panel
          </button>
        )}
      </div>

      {/* Show auction items only for regular users */}
      {user.role === "user" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Your Uploaded Items</h2>
          {loadingItems ? (
            <p className="text-center">Loading your items...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500">You haven't uploaded any items yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item._id} className="border p-4 rounded shadow-md">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-700 mb-1">{item.description}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Start:</strong> {new Date(item.startTime).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>End:</strong> {new Date(item.endTime).toLocaleString()}
                  </p>
                  <p className="text-sm font-medium mt-1">Starting Price: ₹{item.startingPrice}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
