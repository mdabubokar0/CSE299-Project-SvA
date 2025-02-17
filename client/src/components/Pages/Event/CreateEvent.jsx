import React, { useState } from "react";
import { Form, Input, Button, Upload, DatePicker, InputNumber, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

export const CreateEvent = () => {
  const [fileList, setFileList] = useState([]); // Store uploaded file list
  const [loading, setLoading] = useState(false);

  // Handle File Upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList); // Update fileList state
  };

  // Handle Form Submit
  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload an event thumbnail.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("venue", values.venue);
    formData.append("date", values.date.format("YYYY-MM-DD"));
    formData.append("capacity", values.capacity);
    formData.append("ticket", values.ticket);
    formData.append("thumbnail", fileList[0].originFileObj); // Attach file

    try {
      const response = await axios.post("http://localhost:8081/event/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Event created successfully!");
      console.log("✅ Event Created:", response.data);
    } catch (error) {
      message.error("❌ Error creating event");
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create Event" style={{ maxWidth: 500, margin: "auto", marginTop: 30 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Event Title" name="title" rules={[{ required: true, message: "Please enter event title" }]}>
          <Input placeholder="Enter event title" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter description" }]}>
          <Input.TextArea placeholder="Enter event description" rows={3} />
        </Form.Item>

        <Form.Item label="Venue" name="venue" rules={[{ required: true, message: "Please enter venue" }]}>
          <Input placeholder="Enter venue location" />
        </Form.Item>

        <Form.Item label="Date" name="date" rules={[{ required: true, message: "Please select date" }]}>
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Capacity" name="capacity" rules={[{ required: true, message: "Please enter capacity" }]}>
          <InputNumber min={1} max={10000} style={{ width: "100%" }} placeholder="Enter capacity" />
        </Form.Item>

        <Form.Item label="Tickets Available" name="ticket" rules={[{ required: true, message: "Please enter ticket count" }]}>
          <InputNumber min={1} max={10000} style={{ width: "100%" }} placeholder="Enter ticket count" />
        </Form.Item>

        <Form.Item label="Event Thumbnail" name="thumbnail" rules={[{ required: true, message: "Please upload an image" }]}>
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            fileList={fileList} // Bind fileList state
            onChange={handleFileChange} // Handle change event
            showUploadList={true}
            maxCount={1}
            accept="image/*" // Restrict file types
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Event
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
