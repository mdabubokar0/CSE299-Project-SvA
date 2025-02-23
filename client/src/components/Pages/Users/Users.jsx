import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";
import { Table } from "antd";
import axios from "axios"; // Import axios for API requests

export const Users = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if no token found
    } else {
      fetchUserData();
    }
  }, [token, navigate]);

  // Fetch users from API
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/users");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Organizer", value: "organizer" },
        { text: "Photographer", value: "photographer" },
        { text: "Attendee", value: "attendee" },
      ],
      onFilter: (value, record) => record.role === value,
    },
  ];

  return (
    <div className="flex">
      <div className="w-auto">
        <Sidebar />
      </div>
      <div className="m-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium bg-secondary-100 p-3 rounded-md shadow-lg">
            Users
          </h1>
          <Avatar />
        </div>
        <div className="mt-3">
          <Table columns={columns} dataSource={userData} rowKey="id" />
        </div>
      </div>
    </div>
  );
};
