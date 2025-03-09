import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Row,
  Col,
  Spin,
  message,
  Modal,
  Descriptions,
  Button,
} from "antd";
import {
  CameraOutlined,
  PhoneOutlined,
  DollarOutlined,
} from "@ant-design/icons";

export const PhotographerList = () => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/photographer/list"
        );
        setPhotographers(response.data);
      } catch (error) {
        message.error("Error fetching photographers");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographers();
  }, []);

  const handlePhotographerClick = (photographer) => {
    setSelectedPhotographer(photographer);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPhotographer(null);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="mt-5">
      <Row gutter={[16, 16]} justify="center">
        {photographers.map((photographer) => (
          <Col key={photographer.nid}>
            <Card
              hoverable
              onClick={() => handlePhotographerClick(photographer)}
              cover={
                <img
                  alt={photographer.name}
                  src={`http://localhost:8081${photographer.picture}`}
                />
              }
            >
              <Card.Meta
                title={photographer.photographer_name}
                description={
                  <>
                    <CameraOutlined /> {photographer.camera_model}
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for photographer details */}
      <Modal
        title={selectedPhotographer?.photographer_name}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <Row gutter={12}>
          <Col span={10}>
            <img
              alt={selectedPhotographer?.photographer_name}
              src={`http://localhost:8081${selectedPhotographer?.picture}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          </Col>
          <Col span={14}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Contact">
                <PhoneOutlined /> {selectedPhotographer?.contact_no}
              </Descriptions.Item>
              <Descriptions.Item label="Experience">
                {selectedPhotographer?.experience}
              </Descriptions.Item>
              <Descriptions.Item label="Camera Model">
                <CameraOutlined /> {selectedPhotographer?.camera_model}
              </Descriptions.Item>
              <Descriptions.Item label="Hourly Charge">
                <DollarOutlined /> {selectedPhotographer?.hourly_charge}
              </Descriptions.Item>
              <Descriptions.Item label="Bio">
                {selectedPhotographer?.bio}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
