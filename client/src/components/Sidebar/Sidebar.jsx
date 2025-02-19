import React, { useState } from "react";
import bData from "./barData.json";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const role = localStorage.getItem("role");
  const navigate = useNavigate()

  const handleActive = (link) => {
    setActive(link);
  };

  const routes = bData.filter((b) => {
    if (role === "admin") {
      return (
        b.title === "Dashboard" ||
        b.title === "Users" ||
        b.title === "Events" ||
        b.title === "Settings"
      );
    } else if (role === "organizer") {
      return (
        b.title === "Dashboard" ||
        b.title === "Events" ||
        b.title === "Settings"
      );
    } else if (role === "photographer") {
      return (
        b.title === "Dashboard" ||
        b.title === "Hiring" ||
        b.title === "Settings"
      );
    } else if (role === "attendee") {
      return (
        b.title === "Dashboard" ||
        b.title === "Events" ||
        b.title === "Settings"
      );
    } else {
      return false;
    }
  });

  return (
    <div className="p-3 text-primary w-[350px] h-[100vh] top-0 sticky">
      <div className="bg-secondary-100 h-full rounded-md shadow-lg flex flex-col justify-between">
        <div>
          <Link to="/">
            <h1 className="font-reospec text-center text-2xl py-5">EVENTLY</h1>
          </Link>
          {routes.map((b) => (
            <div
              key={b.id}
              onClick={() => handleActive(b.link)}
              className={`text-[18px] rounded-l-md ml-10 cursor-pointer hover:bg-white
            ${active === b.link ? "bg-white" : "bg-transparent"}`}
            >
              <Link to={b.link} className="block p-[10px] w-full h-full">
                {b.title}
              </Link>
            </div>
          ))}
        </div>
        <div
          className="text-[18px] rounded-l-md ml-10 mb-10 cursor-pointer hover:bg-white"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/auth");
          }}
        >
          <div className="block p-[10px] w-full h-full">Logout</div>
        </div>
      </div>
    </div>
  );
};
