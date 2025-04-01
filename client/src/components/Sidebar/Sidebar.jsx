import React, { useState } from "react";
import bData from "./barData.json";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DownOutlined, RightOutlined } from "@ant-design/icons";

export const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Track only one open submenu
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleActive = (link) => {
    setActive(link);
  };

  const toggleSubmenu = (id) => {
    setOpenSubmenu((prev) => (prev === id ? null : id)); // Close the submenu if clicked again
  };

  const routes = bData.filter((b) => {
    if (role === "admin") {
      return (
        b.title === "Dashboard" || b.title === "Users" || b.title === "Products"
      );
    } else if (role === "organizer") {
      return b.title === "Dashboard" || b.title === "Events";
    } else if (role === "photographer") {
      return b.title === "Dashboard" || b.title === "Hiring";
    } else if (role === "attendee") {
      return b.title === "Dashboard" || b.title === "Events";
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
            <div key={b.id}>
              <div
                onClick={() => {
                  if (b.submenu) {
                    toggleSubmenu(b.id);
                    return;
                  }
                  handleActive(b.link);
                }}
                className={`text-[18px] rounded-l-md ml-10 cursor-pointer hover:bg-white
                  ${active === b.link ? "bg-white" : "bg-transparent"}
                  ${b.submenu ? "flex justify-between items-center" : ""}`}
              >
                <Link
                  to={b.link}
                  className="block p-[10px] w-full h-full"
                  onClick={(e) => {
                    if (b.submenu) e.preventDefault();
                  }}
                >
                  {b.title}
                </Link>
                {b.submenu && (
                  <span className="pr-3">
                    {openSubmenu === b.id ? (
                      <DownOutlined className="text-sm" />
                    ) : (
                      <RightOutlined className="text-sm" />
                    )}
                  </span>
                )}
              </div>

              {b.submenu && openSubmenu === b.id && (
                <div className="ml-16">
                  {b.submenu.map((subItem) => (
                    <div
                      key={subItem.id}
                      onClick={() => handleActive(subItem.link)}
                      className={`text-[16px] rounded-l-md cursor-pointer hover:bg-white
                        ${
                          active === subItem.link
                            ? "bg-white"
                            : "bg-transparent"
                        }`}
                    >
                      <Link
                        to={subItem.link}
                        className="block p-[10px] w-full h-full"
                      >
                        {subItem.title}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
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
