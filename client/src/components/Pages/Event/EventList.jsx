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
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8081/event/list");
        setEvents(response.data);
      } catch (error) {
        message.error("Error fetching events");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedEvent(null); // Reset selected event
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]} justify="center">
        {events.map((event) => (
          <Col key={event.id}>
            <Card
              hoverable
              onClick={() => handleEventClick(event)}
              cover={
                <img
                  alt={event.title}
                  src={`http://localhost:8081${event.thumbnail}`}
                />
              }
            >
              <Card.Meta
                title={event.title}
                description={`৳ ${event.ticket}`}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for event details */}
      <Modal
        title={selectedEvent?.title}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button
            key="book"
            type="primary"
            className="w-full bg-primary"
            onClick={() => message.success("Ticket booked!")}
          >
            Book Ticket
          </Button>,
        ]}
        width={900} // Adjust width for better view
      >
        <Row gutter={12}>
          <Col span={10}>
            <img
              alt={selectedEvent?.title}
              src={`http://localhost:8081${selectedEvent?.thumbnail}`}
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
              <Descriptions.Item label="Venue">
                <EnvironmentOutlined /> {selectedEvent?.venue}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                <CalendarOutlined /> {selectedEvent?.date}
              </Descriptions.Item>
              <Descriptions.Item label="Capacity">
                <UserOutlined /> {selectedEvent?.capacity}
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                <strong>{selectedEvent?.ticket}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedEvent?.description}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
