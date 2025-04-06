import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";
import { Table, Button, Modal, Form, Input, message, DatePicker } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

export const Events = ({ eventType }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchEvents();
    }
  }, [token, pagination.current, pagination.pageSize]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8081/event/paginated-list",
        {
          params: {
            page: pagination.current,
            limit: pagination.pageSize,
          },
        }
      );

      // Filter events based on eventType
      const filteredEvents =
        eventType === "All"
          ? response.data.events
          : response.data.events.filter(
              (event) => event.category === eventType
            );

      setEvents(filteredEvents);
      setPagination((prev) => ({
        ...prev,
        total: response.data.total || response.data.events.length,
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/event/delete/${id}`);
      fetchEvents();
      message.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
      message.error("Failed to delete event");
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    form.setFieldsValue(event);
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setEditingEvent(null);
    form.resetFields();
  };

  const handleEditSubmit = async (values) => {
    try {
      const response = await axios.patch(
        `http://localhost:8081/event/edit/${editingEvent.id}`,
        values
      );
      if (response.data) {
        message.success("Event updated successfully!");
        fetchEvents();
        handleEditModalClose();
      }
    } catch (error) {
      console.error("Error updating event:", error);
      message.error("Failed to update event");
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
      title: "Venue",
      dataIndex: "venue",
      key: "venue",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Ticket",
      dataIndex: "ticket",
      key: "ticket",
    },
    {
      title: "Action",
      key: "action",
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
            {eventType}s
          </h1>
          <Avatar />
        </div>
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={events}
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
        title="Edit Event"
        open={isEditModalVisible}
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
        <Form form={form} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            rules={[{ required: true, message: "Please enter thumbnail URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Venue"
            name="venue"
            rules={[{ required: true, message: "Please enter a venue" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please enter a date" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: "Please enter capacity" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ticket"
            name="ticket"
            rules={[{ required: true, message: "Please enter ticket count" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
