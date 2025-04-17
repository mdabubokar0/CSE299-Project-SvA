import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table } from "antd";
import axios from "axios";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";

export const Users = ({ userType }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [token, navigate, pagination.current, pagination.pageSize, userType]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        role: userType === "all" ? undefined : userType, // Only send role if not "all"
      };

      const response = await axios.get("http://localhost:8081/api/users", {
        params,
        headers: {
          Authorization: `Bearer ${token}`, // Make sure to send the token
        },
      });

      // Filter on client side as fallback (though server should handle it)
      const filteredData =
        userType === "all"
          ? response.data.users
          : response.data.users.filter((user) => user.role === userType);

      setUserData(filteredData);
      setPagination((prev) => ({
        ...prev,
        total: filteredData.length, // Or response.data.total if server returns filtered count
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

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
      render: (role) => role.charAt(0).toUpperCase() + role.slice(1),
    },
  ];

  const paginationText = (total, range) => {
    return `${range[0]}-${range[1]} of ${total} items`;
  };

  return (
    <div className="flex">
      <div className="w-auto">
        <Sidebar />
      </div>
      <div className="m-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium bg-secondary-100 p-3 rounded-md shadow-lg">
            {userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase()}s
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
              showTotal: paginationText,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};
