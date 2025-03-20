import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Card, Select, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";

export const CreateSuggestion = ({ userId }) => {
  const [fileList, setFileList] = useState([]); // Store uploaded file list
  const [loading, setLoading] = useState(false);

  // Handle File Upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList); // Update fileList state
  };

  // Handle Form Submit
  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload a thumbnail.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("type", values.type);
    formData.append("thumbnail", fileList[0].originFileObj); // Attach file

    try {
      const response = await axios.post(
        "http://localhost:8081/suggestion/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored
          },
        }
      );

      message.success("Suggestion created successfully!");
      console.log("Suggestion Created:", response.data);
    } catch (error) {
      message.error("Error creating suggestion");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="w-auto">
        <Sidebar />
      </div>
      <div className="m-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium bg-secondary-100 p-3 rounded-md shadow-lg">
            Create Suggestion
          </h1>
          <Avatar />
        </div>
        <Card title="Suggestion Details" className="mt-3 shadow-lg">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter price"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select type" }]}
            >
              <Select placeholder="Select type">
                <Select.Option value="Drinks">Drinks</Select.Option>
                <Select.Option value="Snacks">Snacks</Select.Option>
                <Select.Option value="Venue">Venue</Select.Option>
                <Select.Option value="Transportation">Transportation</Select.Option>
                <Select.Option value="Decoration">Decoration</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Thumbnail"
              name="thumbnail"
              rules={[{ required: true, message: "Please upload a thumbnail" }]}
            >
              <Upload
                beforeUpload={() => false} // Prevent automatic upload
                fileList={fileList} // Bind fileList state
                onChange={handleFileChange} // Handle change
                showUploadList={true}
                maxCount={1}
                accept="image/*" // Restrict file types
              >
                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Create Suggestion
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};