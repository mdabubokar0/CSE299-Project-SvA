import React, { useState } from "react";
import { Form, Input, Button, Upload, InputNumber, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";

export const CreatePhotographer = ({ userId }) => {
  const [fileList, setFileList] = useState([]); // Store uploaded file list
  const [loading, setLoading] = useState(false);

  // Handle File Upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList); // Update fileList state
  };

  // Handle Form Submit
  const onFinish = async (values) => {
    if (fileList.length === 0) {
      message.error("Please upload a profile picture.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("nid", values.nid);
    formData.append("id", userId); // Pass logged-in user ID
    formData.append("bio", values.bio);
    formData.append("contact_no", values.contact_no);
    formData.append("experience", values.experience);
    formData.append("camera_model", values.camera_model);
    formData.append("hourly_charge", values.hourly_charge);
    formData.append("picture", fileList[0].originFileObj); // Attach file

    try {
      const response = await axios.post(
        "http://localhost:8081/photographer/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored
          },
        }
      );

      message.success("Photographer profile created successfully!");
      console.log("Photographer Created:", response.data);
    } catch (error) {
      message.error("Error creating photographer profile");
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
            Setup Profile
          </h1>
          <Avatar />
        </div>
        <Card title="Photographer Details" className="mt-3 shadow-lg">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="National ID (NID)"
              name="nid"
              rules={[{ required: true, message: "Please enter NID" }]}
            >
              <Input placeholder="Enter NID" />
            </Form.Item>

            <Form.Item
              label="Bio"
              name="bio"
              rules={[{ required: true, message: "Please enter bio" }]}
            >
              <Input.TextArea placeholder="Enter bio" rows={3} />
            </Form.Item>

            <Form.Item
              label="Contact Number"
              name="contact_no"
              rules={[
                { required: true, message: "Please enter contact number" },
              ]}
            >
              <Input placeholder="Enter contact number" maxLength={11} />
            </Form.Item>

            <Form.Item
              label="Experience"
              name="experience"
              rules={[{ required: true, message: "Please enter experience" }]}
            >
              <Input.TextArea placeholder="Describe experience" rows={3} />
            </Form.Item>

            <Form.Item
              label="Camera Model"
              name="camera_model"
              rules={[{ required: true, message: "Please enter camera model" }]}
            >
              <Input placeholder="Enter camera model" />
            </Form.Item>

            <Form.Item
              label="Hourly Charge (৳)"
              name="hourly_charge"
              rules={[
                { required: true, message: "Please enter hourly charge" },
              ]}
            >
              <InputNumber min={0} max={10000} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Profile Picture"
              name="picture"
              rules={[{ required: true, message: "Please upload an image" }]}
            >
              <Upload
                beforeUpload={() => false} // Prevent automatic upload
                fileList={fileList} // Bind fileList state
                onChange={handleFileChange} // Handle change
                showUploadList={true}
                maxCount={1}
                accept="image/*" // Restrict file types
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Setup Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};
