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
  Select,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // State for payment modal
  const [paymentMethod, setPaymentMethod] = useState("bKash"); // State for payment method
  const [mobileNumber, setMobileNumber] = useState(""); // State for mobile number
  const [transactionId, setTransactionId] = useState(""); // State for transaction ID

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
    setSelectedEvent(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category) => {
    if (category === categoryFilter) {
      setCategoryFilter("");
    } else {
      setCategoryFilter(category);
    }
  };

  const handlePaymentModalOpen = () => {
    setIsPaymentModalVisible(true); // Open payment modal
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalVisible(false); // Close payment modal
    setPaymentMethod("bKash"); // Reset payment method
    setMobileNumber(""); // Reset mobile number
    setTransactionId(""); // Reset transaction ID
  };

  const handlePaymentSubmit = async () => {
    if (!selectedEvent) {
      message.error("No event selected");
      return;
    }

    if (!mobileNumber || !transactionId) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8081/payment/event", {
        event_id: selectedEvent.id,
        user_id: 1, // Replace with actual user ID (from JWT or context)
        payment_method: paymentMethod,
        mobile_number: mobileNumber,
        transaction_id: transactionId,
        amount: selectedEvent.ticket,
      });

      if (response.data) {
        message.success("Payment successful");
        handlePaymentModalClose(); // Close payment modal
        handleModalClose(); // Close event details modal
      }
    } catch (error) {
      console.error("Payment Save Error:", error);
      message.error("Error saving payment");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

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

      {/* Category Bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
          <Button
            key="all"
            onClick={() => handleCategoryClick("")}
            style={{
              borderRadius: "20px",
              padding: "8px 20px",
              fontSize: "16px",
              backgroundColor: categoryFilter === "" ? "#010101" : "#fff",
              color: categoryFilter === "" ? "#fff" : "#000",
            }}
          >
            All
          </Button>

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
                color: category === categoryFilter ? "#fff" : "#000",
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
            onClick={handlePaymentModalOpen} // Open payment modal
          >
            Book Ticket
          </Button>,
        ]}
        width={900}
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

      {/* Payment Modal */}
      <Modal
        title="Complete Payment"
        visible={isPaymentModalVisible}
        onCancel={handlePaymentModalClose}
        footer={[
          <Button key="cancel" onClick={handlePaymentModalClose}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handlePaymentSubmit}>
            Submit Payment
          </Button>,
        ]}
      >
        <h2 className="mb-1">* Send the payment to 01712345678</h2>
        <Select
          defaultValue="bKash"
          style={{ width: "100%", marginBottom: "16px" }}
          onChange={(value) => setPaymentMethod(value)}
        >
          <Option value="bKash">bKash</Option>
          <Option value="Nagad">Nagad</Option>
          <Option value="Rocket">Rocket</Option>
        </Select>

        <Input
          placeholder="Mobile Number"
          value={mobileNumber}
          type="number"
          onChange={(e) => setMobileNumber(e.target.value)}
          style={{ marginBottom: "16px" }}
        />

        <Input
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          style={{ marginBottom: "16px" }}
        />
      </Modal>
    </div>
  );
};
