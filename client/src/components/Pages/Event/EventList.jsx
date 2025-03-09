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
  Input,
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
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [categoryFilter, setCategoryFilter] = useState(""); // State for selected category

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
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

  // Filter events based on search query and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter
      ? event.category === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedEvent(null); // Reset selected event
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  const handleCategoryClick = (category) => {
    if (category === categoryFilter) {
      setCategoryFilter(""); // Remove filter if clicked again
    } else {
      setCategoryFilter(category); // Set new category filter
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  const handleBookClick = async (event) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/payment/initiate",
        {
          event_id: event.id,
          user_id: 1, // Replace with actual user ID
          amount: event.ticket,
        }
      );

      if (response.data && response.data.GatewayPageURL) {
        window.location.href = response.data.GatewayPageURL; // Redirect to SSLCOMMERZ
      } else {
        message.error("Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Error initiating payment.");
    }
  };

  return (
    <div className="mt-5">
      {/* Search Bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Input
          className="w-[930px] h-[48px]"
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Category Bar (Flexbox) */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          {/* All Button */}
          <Button
            key="all"
            onClick={() => handleCategoryClick("")}
            style={{
              borderRadius: "20px",
              padding: "8px 20px",
              fontSize: "16px",
              backgroundColor: categoryFilter === "" ? "#010101" : "#fff",
              color: categoryFilter === "" ? "#fff" : "#000", // Change text color when active
            }}
          >
            All
          </Button>

          {/* Category Buttons */}
          {["Concert", "Gaming", "Anime", "Workshop"].map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={{
                borderRadius: "20px",
                padding: "8px 20px",
                fontSize: "16px",
                backgroundColor:
                  category === categoryFilter ? "#010101" : "#fff",
                color: category === categoryFilter ? "#fff" : "#000", // Change text color when active
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Row gutter={[16, 16]} justify="center">
        {filteredEvents.length === 0 ? (
          <Col span={24} style={{ textAlign: "center" }}>
            <h3>No events found matching your search</h3>
          </Col>
        ) : (
          filteredEvents.map((event) => (
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
          ))
        )}
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
            onClick={() => handleBookClick(selectedEvent)}
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
