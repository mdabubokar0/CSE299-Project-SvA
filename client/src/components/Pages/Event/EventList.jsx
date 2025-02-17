// EventList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spin, message } from "antd";

export const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Row gutter={[12, 12]} className="flex items-center justify-center">
        {events.map((event) => (
          <Col key={event.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={event.title}
                  src={`http://localhost:8081${event.thumbnail}`}
                />
              }
            >
              <Card.Meta title={event.title} description={`৳ ${event.ticket}`} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
