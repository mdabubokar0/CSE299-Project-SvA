import React, { useEffect, useState } from "react";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";
import { Doughnut, Bar, Pie, PolarArea } from "react-chartjs-2"; // Import Bar chart
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
} from "chart.js"; // Import necessary components
import axios from "axios";
import { Table } from "antd";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

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

export const Dashboard = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [organizers, setOrganizers] = useState(0);
  const [photographers, setPhotographers] = useState(0);
  const [attendees, setAttendees] = useState(0);
  const [userData, setUserData] = useState([]);

  // Sample data for events
  const [eventData, setEventData] = useState({
    concerts: 10,
    workshops: 13,
    festivals: 7,
    showcases: 8,
    exhibitions: 0,
    others: 1,
  });

  const navigate = useNavigate();

  // Fetch Counts from Backend
  const fetchCounts = async () => {
    try {
      const [organizerRes, photographerRes, attendeeRes] = await Promise.all([
        axios.get("http://localhost:8081/api/organizer/count"),
        axios.get("http://localhost:8081/api/photographer/count"),
        axios.get("http://localhost:8081/api/attendee/count"),
      ]);

      setOrganizers(organizerRes.data.count);
      setPhotographers(photographerRes.data.count);
      setAttendees(attendeeRes.data.count);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch User Data for Table
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/users");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
    fetchCounts();
    fetchUserData();
  }, []); // Removed token from dependencies since it comes from localStorage

  const data = {
    labels: ["Organizers", "Photographers", "Attendees"],
    datasets: [
      {
        label: "Signed Up",
        data: [organizers, photographers, attendees], // Dynamic data from API
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF4D67", "#2D8AD2", "#E6B800"],
      },
    ],
  };

  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  const barData = {
    labels: [
      "Concerts",
      "Workshops",
      "Festivals",
      "Showcases",
      "Exhibitions",
      "Others",
    ],
    datasets: [
      {
        label: "Events You Attended",
        data: [
          eventData.concerts,
          eventData.workshops,
          eventData.festivals,
          eventData.showcases,
          eventData.exhibitions,
          eventData.others,
        ],
        backgroundColor: [
          "#FF6384", // Color for Concerts
          "#36A2EB", // Color for Workshops
          "#FFCE56", // Color for Festivals
          "#4BC0C0", // Color for Showcases
          "#9966FF", // Color for Exhibitions
          "#FF9F40", // Color for Others
        ],
        borderColor: "#fff",
        borderWidth: 2,
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
        {role === "admin" && (
          <div>
            <div className="flex items-center justify-between w-full">
              <div className="mt-3 flex flex-col gap-3">
                <Card title="Organizers" count={organizers} />
                <Card title="Photographers" count={photographers} />
                <Card title="Attendees" count={attendees} />
              </div>
              <div>
                <Doughnut data={data} />
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <Card title="Male" count={organizers} right="true" />
                <Card title="Female" count={organizers} right="true" />
                <Card title="Events" count="5" right="true" />
              </div>
            </div>
            {/* Table */}
            <div className="mt-3">
              <h1 className="text-xl font-medium mb-3">Recent Users</h1>
              <Table columns={columns} dataSource={userData} rowKey="id" />
            </div>
          </div>
        )}
        {role === "organizer" && (
          <div className="mt-3 flex justify-between">
            <div className="flex flex-col justify-between">
              <Card title="Events Created" count={organizers} />
              <Card title="Events Attended" count={organizers} />
            </div>
            <div className="w-[500px]">
              <Pie
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                    title: {
                      display: true,
                      text: "Organized",
                    },
                  },
                }}
              />
            </div>
            <div className="flex flex-col justify-between">
              <Card title="Hired" count={organizers} right="true" />
              <Card title="Tickets Sold" count={organizers} right="true" />
            </div>
          </div>
        )}
        {role === "photographer" && (
          <div className="mt-3 flex justify-between">
            <div className="mt-3 flex flex-col gap-3">
              <Card title="Got Hired" count={organizers} />
              <Card title="Event Attended" count={photographers} />
            </div>
            <div className="w-[500px]">
              <PolarArea
                data={barData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                    title: {
                      display: true,
                      text: "Hired For",
                    },
                  },
                }}
              />
            </div>
            <div className="mt-3 flex flex-col gap-3 justify-end">
              <Card title="Rejected" count={organizers} />
              <Card title="Charge" count="10000" />
            </div>
          </div>
        )}
        {role === "attendee" && (
          <div className="mt-3">
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Number of Attendees by Event Type",
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
