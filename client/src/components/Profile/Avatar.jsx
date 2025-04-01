import React, { useEffect, useState } from "react"; // Import react hooks
import axios from "axios"; // Import axios for API integration
import AntdAvatar from "antd/es/avatar"; // Import the Avatar component from Ant Design
import { useNavigate } from "react-router-dom"; // Import navigate from react router dom for navigation
import { Link } from "react-router-dom";

export const Avatar = () => {
  // Get the token from the local storage
  const token = localStorage.getItem("token");

  // Navigate
  const navigate = useNavigate();

  // State to store the fetched username
  const [userName, setUserName] = useState("");

  // State to store error messages if any issue occurs during API call
  const [error, setError] = useState(null);

  // useEffect to fetch user name when the component mounts
  useEffect(() => {
    if (!token) {
      navigate("/"); // If token is not available in the local storage then navigate to the login page
      return; // Stop execution
    }
    // If token is available then fetch the user name
    const fetchUserName = async () => {
      try {
        // API call to get the user name
        const response = await axios.get("http://localhost:8081/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Ensures credentials (cookies/auth headers) are included in request
        });

        // Update state with fetched user name (default to "User" if empty)
        setUserName(response.data.name || "User");
      } catch (err) {
        console.error("❌ Error fetching user name:", err);
        setError("Failed to load user name"); // Set error message in case of failure
      }
    };

    fetchUserName(); // Call the function to fetch user name
  }, [token, navigate]); // Dependency array depends on token and navigate

  // Function to extract initials from the username
  const getInitials = (name) => {
    return name
      .split(" ") // Split name into parts (first name, last name, etc.)
      .map((part) => part.charAt(0)) // Get the first character of each part
      .join("") // Join the initials together
      .toUpperCase(); // Convert to uppercase for consistency
  };

  return (
    <div>
      {error ? (
        <p className="text-red-500">{error}</p> // Show error message if fetching failed
      ) : (
        <Link to="/profile">
          <AntdAvatar size={50} className="bg-primary shadow-lg">
            {getInitials(userName)} {/* Display initials inside avatar */}
          </AntdAvatar>
        </Link>
      )}
    </div>
  );
};
