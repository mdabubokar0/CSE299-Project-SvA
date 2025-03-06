import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spin, message } from "antd";

export const PhotographerList = () => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/photographers");
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

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Row gutter={[16, 16]} className="flex items-center justify-center">
        {photographers.map((photographer) => (
          <Col key={photographer.id}>
            <Card
              hoverable
              cover={<img alt={photographer.name} src={photographer.image} />}
            >
              <Card.Meta
                title={photographer.name}
                description={`Hourly Rate: ${photographer.price}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

