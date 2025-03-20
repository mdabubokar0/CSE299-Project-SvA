import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";
import { Table, Button, Modal, Form, Input, Select, message } from "antd"; // Import message
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

export const SuggestionList = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchSuggestions();
    }
  }, [token, navigate, pagination.current, pagination.pageSize]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8081/suggestion/paginated-list",
        {
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
          },
        }
      );
      setSuggestions(response.data.suggestions);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total,
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/suggestion/delete/${id}`);
      fetchSuggestions();
      message.success("Suggestion deleted successfully!");
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      message.error("Failed to delete suggestion");
    }
  };

  const handleEditClick = (suggestion) => {
    setEditingSuggestion(suggestion);
    form.setFieldsValue(suggestion);
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setEditingSuggestion(null);
    form.resetFields();
  };

  const handleEditSubmit = async (values) => {
    try {
      const response = await axios.patch(
        `http://localhost:8081/suggestion/edit/${editingSuggestion.id}`,
        values
      );
      if (response.data) {
        message.success("Suggestion updated successfully!"); // Show success toast
        fetchSuggestions(); // Refresh the list
        handleEditModalClose(); // Close the modal
      }
    } catch (error) {
      console.error("Error updating suggestion:", error);
      message.error("Failed to update suggestion"); // Show error toast
    }
  };

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <img
          src={`http://localhost:8081${thumbnail}`}
          alt="Thumbnail"
          style={{ width: "50px", height: "50px", borderRadius: "5px" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/50";
          }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

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
            Suggestions
          </h1>
          <Avatar />
        </div>
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={suggestions}
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

      <Modal
        title="Edit Suggestion"
        visible={isEditModalVisible}
        onCancel={handleEditModalClose}
        footer={[
          <Button key="cancel" onClick={handleEditModalClose}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Save Changes
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter a price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            rules={[
              { required: true, message: "Please enter a thumbnail URL" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select a type" }]}
          >
            <Select>
              <Select.Option value="Drinks">Drinks</Select.Option>
              <Select.Option value="Snacks">Snacks</Select.Option>
              <Select.Option value="Venue">Venue</Select.Option>
              <Select.Option value="Transportation">
                Transportation
              </Select.Option>
              <Select.Option value="Decoration">Decoration</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
