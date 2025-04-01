import React, { useState, useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Avatar } from "./Avatar";
import { Form, Input, Button, Select, message, Card } from "antd";
import axios from "axios";

export const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
  });

  useEffect(() => {
    // Fetch user details from API
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setUserData(response.data);
        form.setFieldsValue({
          name: response.data.name,
          username: response.data.username,
        });
      } catch (error) {
        message.error("Failed to fetch user details");
      }
    };

    fetchUserData();
  }, [form]);

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const updateData = {
        name: values.name,
        username: values.username,
      };

      if (values.password) {
        updateData.password = values.password;
      }

      await axios.patch("http://localhost:8081/api/update", updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      message.success("Profile updated successfully!");
    } catch (error) {
      message.error(error.response?.data?.error || "Update failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex text-primary">
      <div className="w-auto">
        <Sidebar />
      </div>
      <div className="m-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium bg-secondary-100 p-3 rounded-md shadow-lg">
            Profile
          </h1>
          <Avatar />
        </div>

        <Card title="Update Profile" className="mt-3 w-full shadow-lg">
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ message: "Please enter your name" }]}
            >
              <Input placeholder={userData.name || "Enter full name"} />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              rules={[{ message: "Please enter a username" }]}
            >
              <Input placeholder={userData.username || "Enter username"} />
            </Form.Item>

            <Form.Item name="password" label="New Password">
              <Input.Password placeholder="Enter new password (optional)" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Update Profile
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};
