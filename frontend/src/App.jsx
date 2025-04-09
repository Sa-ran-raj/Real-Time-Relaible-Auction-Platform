import { Dialog } from '@headlessui/react'; // Make sure to install @headlessui/react
import { Fragment } from 'react';
import Dashboard from './Dashboard';

import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}


function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // File object
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  useEffect(() => {
    axios.get("http://localhost:5000/dashboard", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startingPrice", price);
    formData.append("image", image); // file object
    formData.append("startTime", startDateTime);
    formData.append("endTime", endDateTime);

    try {
      const res = await axios.post("http://localhost:5000/api/auction/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Auction uploaded:", res.data);
      alert("Auction item submitted successfully!");
      setIsModalOpen(false);

      // Clear form
      setTitle('');
      setDescription('');
      setPrice('');
      setImage(null);
      setStartDateTime('');
      setEndDateTime('');
    } catch (err) {
      console.error("Error uploading auction:", err);
      alert("Error uploading auction item.");
    }
  };

  if (loading) return <p className="text-center mt-20 text-xl">Loading...</p>;

  return (
    <div>
      <nav className="flex justify-between items-center p-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold">My App</h1>
        {user ? (
          <button onClick={() => navigate("/dashboard")}>
            <img src={user.photo} alt="Profile" className="w-10 h-10 rounded-full border" />
          </button>
        ) : (
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        )}
      </nav>

      <div className="flex flex-col items-center justify-center h-screen">
        {!user && <h1 className="text-3xl font-bold">Welcome to Home Page</h1>}

        {user?.role === "user" && (
          <>
            <h1 className="text-3xl font-bold text-green-600">Welcome {user.displayName}!</h1>
            <p className="mt-4 text-xl text-gray-700">This is the best app for bidding!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Click to Add Auction Item
            </button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <h1 className="text-3xl font-bold text-red-600">Welcome Admin {user.displayName}!</h1>
            <p className="mt-4 text-xl text-gray-700">Approve pending auction requests below:</p>
            <button
              onClick={() => navigate("/admin")}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to Admin Panel
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add Auction Item</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Starting Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="border p-2 rounded"
                required
              />
              <label className="text-sm text-gray-600">Start Date & Time</label>
              <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <label className="text-sm text-gray-600">End Date & Time</label>
              <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Login with Google</h1>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded shadow-lg hover:bg-blue-600"
        onClick={() => (window.location.href = "http://localhost:5000/auth/google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}


export default App;
