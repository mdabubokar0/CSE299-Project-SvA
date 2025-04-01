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

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
    fetchCounts();
    fetchUserData();
  }, []);

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

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/users");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
                    <Card title="Events" count="5" />
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
              <div className="w-full bg-secondary-100 rounded-md shadow-lg mt-3 pb-5">
                <div
                  className="m-auto mt-5"
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

        {/* Attendee Section (Unchanged) */}
        {role === "attendee" && <div className="mt-3"></div>}
      </div>
    </div>
  );
};
