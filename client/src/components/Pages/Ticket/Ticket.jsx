import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Spin,
  message,
  Row,
  Col,
  Empty,
  Typography,
  Divider,
} from "antd";
import { QRCode } from "antd";

const { Title, Text } = Typography;

export const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/ticket", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success) {
          const formattedTickets =
            response.data.tickets?.map((ticket) => ({
              ...ticket,
              amount:
                typeof ticket.amount === "string"
                  ? parseFloat(ticket.amount)
                  : Number(ticket.amount) || 0,
            })) || [];

          setTickets(formattedTickets);
        } else {
          message.error(response.data?.message || "Failed to fetch tickets");
        }
      } catch (error) {
        console.error("API Error:", error);
        message.error(
          error.response?.data?.message || "Failed to load tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTickets();
    } else {
      message.error("Please login to view tickets");
      setLoading(false);
    }
  }, [token]);

  const formatAmount = (amount) => {
    const num = Number(amount);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString || "Unknown date";
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2} style={{ marginBottom: 12, fontSize: 20 }}>
        Recent Tickets
      </Title>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Spin size="large" />
        </div>
      ) : tickets.length > 0 ? (
        <Row gutter={[12, 12]}>
          {tickets.map((ticket) => (
            <Col
              xs={24}
              md={12}
              key={ticket.ticket_id || ticket.transaction_id}
            >
              <Card
                bordered={false}
                style={{
                  borderRadius: 8,
                  height: "100%",
                }}
              >
                <Row gutter={16}>
                  {/* Left side - Ticket Info */}
                  <Col xs={16} sm={16} md={16}>
                    <Title level={4} style={{ marginBottom: 8 }}>
                      {ticket.event_title || "Untitled Event"}
                    </Title>
                    <Text strong>Transaction ID: </Text>
                    <Text code copyable>
                      {ticket.transaction_id || "N/A"}
                    </Text>
                    <Divider dashed style={{ margin: "12px 0" }} />

                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">Date: </Text>
                      <Text>{formatDate(ticket.event_date)}</Text>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">Venue: </Text>
                      <Text>{ticket.event_venue || "Venue not specified"}</Text>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Text type="secondary">Amount: </Text>
                      <Text strong>৳{formatAmount(ticket.amount)}</Text>
                    </div>

                    <div>
                      <Text type="secondary">Purchased on: </Text>
                      <Text>{formatDate(ticket.purchase_date)}</Text>
                    </div>
                  </Col>

                  {/* Right side - QR Code */}
                  <Col
                    xs={8}
                    sm={8}
                    md={8}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <QRCode
                      value={`${window.location.origin}/tickets/${ticket.transaction_id}`}
                      size={150}
                      style={{
                        border: "1px solid #f0f0f0",
                        padding: "8px",
                        backgroundColor: "white",
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<Text type="secondary">No tickets found</Text>}
          style={{
            padding: "40px 0",
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        />
      )}
    </div>
  );
};
