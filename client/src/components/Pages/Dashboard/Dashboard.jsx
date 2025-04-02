import React, { useEffect, useState } from "react";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import axios from "axios";
import Card from "./Card";
import { useNavigate } from "react-router-dom";
import { Ticket } from "../Ticket/Ticket";
import { List, Typography, Image } from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TagOutlined,
} from "@ant-design/icons";

// Register necessary components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement
);

const { Text } = Typography;

export const Dashboard = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [organizers, setOrganizers] = useState(0);
  const [photographers, setPhotographers] = useState(0);
  const [attendees, setAttendees] = useState(0);
  const [events, setEvents] = useState(0);
  const [purchasedEvents, setPurchasedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
    fetchCounts();
    if (role === "attendee") {
      fetchPurchasedEvents();
    }
  }, [role]);

  const fetchCounts = async () => {
    try {
      const [organizerRes, photographerRes, attendeeRes, eventRes] =
        await Promise.all([
          axios.get("http://localhost:8081/api/organizer/count"),
          axios.get("http://localhost:8081/api/photographer/count"),
          axios.get("http://localhost:8081/api/attendee/count"),
          axios.get("http://localhost:8081/event/count"),
        ]);

      setOrganizers(organizerRes.data.count);
      setPhotographers(photographerRes.data.count);
      setAttendees(attendeeRes.data.count);
      setEvents(eventRes.data.count);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchPurchasedEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await axios.get(
        "http://localhost:8081/event/purchased",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setPurchasedEvents(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching purchased events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString || "Date not specified";
    }
  };

  const lineData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Revenue (BDT)",
        data: [
          100000, 150000, 120000, 180000, 220000, 210000, 250000, 270000,
          300000, 320000, 350000, 400000,
        ],
        fill: false,
        borderColor: "#36A2EB",
        backgroundColor: "#36A2EB",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="flex text-primary">
      <div className="w-auto">
        <Sidebar />
      </div>
      <div className="m-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium bg-secondary-100 p-3 rounded-md shadow-lg">
            Dashboard
          </h1>
          <Avatar />
        </div>

        {(role === "admin" ||
          role === "organizer" ||
          role === "photographer") && (
          <div>
            <div className="flex flex-col w-full">
              {/* Cards */}
              <div className="mt-3 flex gap-3">
                {role === "admin" && (
                  <>
                    <Card title="Organizers" count={organizers} />
                    <Card title="Photographers" count={photographers} />
                    <Card title="Attendees" count={attendees} />
                    <Card title="Events" count={events} />
                  </>
                )}
                {role === "organizer" && (
                  <>
                    <Card title="Events Created" count={organizers} />
                    <Card title="Hired" count={organizers} />
                    <Card title="Tickets Sold" count={organizers} />
                  </>
                )}
                {role === "photographer" && (
                  <>
                    <Card title="Got Hired" count={organizers} />
                    <Card title="Rejected" count={organizers} />
                    <Card title="Charge" count="10000" />
                  </>
                )}
              </div>

              {/* Line Chart for All Roles */}
              <div className="w-full bg-secondary-100 rounded-md shadow-lg mt-3 py-16">
                <div
                  className="m-auto"
                  style={{ width: "600px", height: "300px" }}
                >
                  <Line
                    data={lineData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                          text: "Monthly Revenue Trends",
                        },
                      },
                      scales: {
                        y: { beginAtZero: true },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendee Section */}
        {role === "attendee" && (
          <div>
            <div className="mt-3 bg-secondary-100 rounded-md shadow-lg">
              <Ticket />
            </div>
            <div className="mt-3 bg-secondary-100 rounded-md shadow-lg p-4">
              <h2 className="text-lg font-medium mb-4">Recent Events</h2>
              {loadingEvents ? (
                <div className="text-center p-4">Loading events...</div>
              ) : purchasedEvents.length > 0 ? (
                <List
                  grid={{ gutter: 12, column: 2 }}
                  dataSource={purchasedEvents}
                  renderItem={(event) => (
                    <List.Item>
                      <div className="bg-white p-4 rounded-md shadow">
                        <div className="flex gap-4">
                          <Image
                            width={100}
                            height={100}
                            src={
                              `http://localhost:8081${event.thumbnail}` ||
                              "https://via.placeholder.com/100x100?text=No+Image"
                            }
                            style={{ objectFit: "cover", borderRadius: 8 }}
                          />
                          <div>
                            <Text strong className="block">
                              {event.title}
                            </Text>
                            <div className="mt-1">
                              <CalendarOutlined /> {formatDate(event.date)}
                            </div>
                            <div>
                              <EnvironmentOutlined /> {event.venue}
                            </div>
                            <div>
                              <TagOutlined /> ৳{event.ticket}
                            </div>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div className="text-center p-4">
                  <Text type="secondary">
                    You haven't purchased any events yet
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
