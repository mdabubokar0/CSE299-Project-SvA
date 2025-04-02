import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Input,
  Card,
  Row,
  Col,
  Spin,
  message,
  Modal,
  Descriptions,
  Button,
  Select,
} from "antd";
import {
  CameraOutlined,
  PhoneOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Option } = Select;

export const PhotographerList = () => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // State for payment modal
  const [paymentMethod, setPaymentMethod] = useState("bKash"); // State for payment method
  const [mobileNumber, setMobileNumber] = useState(""); // State for mobile number
  const [transactionId, setTransactionId] = useState(""); // State for transaction ID

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
    if (!selectedPhotographer) {
      message.error("No photographer selected");
      return;
    }

    if (!mobileNumber || !transactionId) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8081/payment/photographer",
        {
          photographer_id: selectedPhotographer.id,
          payment_method: paymentMethod,
          mobile_number: mobileNumber,
          transaction_id: transactionId,
          amount: selectedPhotographer.hourly_charge,
          status: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success("Payment successful");
        handlePaymentModalClose();
        handleModalClose();
      } else {
        message.error(response.data.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      message.error(error.response?.data?.message || "Payment failed");
    }
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
        footer={[
          <Button
            key="book"
            type="primary"
            className="w-full bg-primary"
            onClick={handlePaymentModalOpen} // Open payment modal
          >
            Hire
          </Button>,
        ]}
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
