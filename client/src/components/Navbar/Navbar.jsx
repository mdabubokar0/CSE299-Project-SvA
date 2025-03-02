import React from "react"; // Import React library
import nData from "./navData.json"; // Import navigation data from a JSON file
import { Link } from "react-router-dom"; // Import Link component from react-router-dom for navigation

export const Navbar = () => {
  // Retrieve the JWT token from local storage to determine if the user is logged in
  const token = localStorage.getItem("token");

  return (
    <div className="flex items-center justify-center font-medium sticky top-0 z-50 bg-white">
      {/* Navbar container with background color and height */}
      <div className="bg-secondary-100 h-[70px] flex items-center gap-10 rounded-b-md px-5">
        <div className="flex items-center gap-10">
          {/* Map through the navigation data and create links for each item */}
          {nData.map((n) => (
            <Link key={n.title} to={n.link}>
              {" "}
              {/* Add key prop for list items and set the path for navigation */}
              <h2>{n.title}</h2>{" "}
              {/* Display the title of the navigation item */}
            </Link>
          ))}
        </div>
        {/* Conditional rendering of the login/dashboard link based on the presence of the token */}
        <Link
          to={token ? "/dashboard" : "/auth"} // Navigate to dashboard if logged in, otherwise to auth page
          className="w-[120px] h-[48px] rounded-md flex items-center justify-center bg-primary text-white"
        >
          {token ? "Dashboard" : "Login"}{" "}
          {/* Display "Dashboard" if logged in, otherwise "Login" */}
        </Link>
      </div>
    </div>
  );
};
