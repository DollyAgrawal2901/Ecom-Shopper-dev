import React, { useState, useEffect } from "react";

const RegistrationData = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [passwordInput, setPasswordInput] = useState(""); // State to hold the password input
  const [revealedPassword, setRevealedPassword] = useState({}); // State to manage revealed passwords

  // Helper function to calculate total cart items
  const calculateCartItems = (cart) => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/admin/registration-data", {
          method: "GET",
        });
        const data = await response.json();
        
        console.log("API Response:", data);  // Log the entire response
        if (data.success) {
          setUsers(data.users);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching users:", error);  // Log errors
        setError("Error occurred while fetching users");
      }
    };
    fetchUsers();
  }, []);

  // Function to handle password reveal
  const handlePasswordReveal = (userId) => {
    const inputPassword = prompt("Enter password to reveal:"); // Prompt for password
    if (inputPassword === "adminshopper") {
      setRevealedPassword((prev) => ({ ...prev, [userId]: true })); // Reveal password
    } else {
      alert("Incorrect password"); // Alert for incorrect password
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-600 flex justify-center">Registered Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      {users.length > 0 ? (
        <table className="min-w-full table-auto border-red-600">
          <thead>
            <tr>
              <th className="px-4 py-2 text-red-600 border border-red-600">ID</th>
              <th className="px-4 py-2 text-red-600 border border-red-600">Name</th>
              <th className="px-4 py-2 text-red-600 border border-red-600">Email</th>
              <th className="px-4 py-2 text-red-600 border border-red-600">Total Cart Items</th>
              <th className="px-4 py-2 text-red-600 border border-red-600">Password</th>
              <th className="px-4 py-2 text-red-600 border border-red-600">Registered At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2 border-red-600">{user._id}</td>
                <td className="border px-4 py-2 border-red-600">{user.name}</td>
                <td className="border px-4 py-2 border-red-600">{user.email}</td>
                <td className="flex border px-4 py-2 justify-center border-red-600">
                  {user.cart ? calculateCartItems(user.cart) : 0}
                </td>
                <td className="border px-4 py-2 cursor-pointer border-red-600" onClick={() => handlePasswordReveal(user._id)}>
                  {revealedPassword[user._id] ? user.password : "************"}
                </td>
                <td className="border px-4 py-2 border-red-600">{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-red-600">No registered users found.</p>
      )}
    </div>
  );
};

export default RegistrationData;
