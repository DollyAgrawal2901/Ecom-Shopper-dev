import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updateData, setUpdateData] = useState({ name: "", address: "", email: "" });
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user data
    fetch("http://localhost:4000/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setUpdateData({ name: data.name, address: data.address, email: data.email });
        setIsLoading(false);
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, [navigate]);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setUpdateData({ ...updateData, email });
  
    // Check for existing email
    if (email) {
      fetch("http://localhost:4000/user/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, currentEmail: userData.email }), // Send the current email
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.exists) {
            setEmailError("User with this email already exists");
          } else {
            setEmailError("");
          }
        })
        .catch((error) => console.error("Error checking email:", error));
    } else {
      setEmailError("");
    }
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:4000/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Profile updated successfully!", { autoClose: 2000 });
        
        // Check if the email has changed
        if (updateData.email !== userData.email) {
          localStorage.removeItem("authToken"); // Remove the authToken
          toast.info("You have been logged out due to email change. Please log in again.", { autoClose: 6000 });
          setTimeout(() => {
            navigate("/login"); // Redirect to login page
          }, 4000); // Wait before redirecting
        } else {
          // Update userData without logging out
          setUserData({ ...userData, ...updateData });
        }
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-lime-400 to-cyan-400 p-8">
      <div className="p-8 max-w-lg w-full bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-10">Profile</h1>
        <form onSubmit={handleUpdate}>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Name:</label>
            <input
              type="text"
              value={updateData.name}
              onChange={(e) =>
                setUpdateData({ ...updateData, name: e.target.value })
              }
              className="w-full p-2 ring-1 ring-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Email:</label>
            <input
              type="text"
              value={updateData.email}
              onChange={handleEmailChange}
              className={`w-full p-2 border rounded ${emailError ? "ring-red-500" : "ring-gray-300"}`}
            />
            {emailError && <p className="text-red-500">{emailError}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Delivery Address:</label>
            <textarea
              type="text"
              value={updateData.address}
              onChange={(e) =>
                setUpdateData({ ...updateData, address: e.target.value })
              }
              className="w-full p-2 border border-gray-300 ring-1 ring-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              disabled={!!emailError}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-all ${!!emailError ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
