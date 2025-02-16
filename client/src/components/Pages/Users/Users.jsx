import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";

export const Users = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    
  }, [token]);

  return (
    <div className="flex">
      <div className="w-auto">
        <Sidebar />
      </div>
      <div className="m-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium bg-secondary-100 p-3 rounded-md shadow-lg">
            User
          </h1>
          <Avatar />
        </div>
      </div>
    </div>
  );
};
