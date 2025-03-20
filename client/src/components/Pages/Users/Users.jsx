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
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if no token found
    } else {
      fetchUserData();
    }
  }, [token, navigate, pagination.current, pagination.pageSize]);

  // Fetch users from API
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/users", {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
      });
      setUserData(response.data.users);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total, // Update total count from API
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPagination(pagination);
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

  // Custom pagination text (e.g., "1-10 of 100 items")
  const paginationText = () => {
    const { current, pageSize, total } = pagination;
    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);
    return `${start}-${end} of ${total} items`;
  };

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
          <Table
            columns={columns}
            dataSource={userData}
            rowKey="id"
            loading={loading}
            pagination={{
              ...pagination,
              showTotal: paginationText, // Show custom pagination text
              showSizeChanger: true, // Allow changing page size
              pageSizeOptions: ["10", "20", "50"], // Page size options
            }}
            onChange={handleTableChange} // Handle pagination change
          />
        </div>
      </div>
    </div>
  );
};