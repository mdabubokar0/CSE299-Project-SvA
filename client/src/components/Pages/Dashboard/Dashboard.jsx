import React, { useEffect, useState } from "react";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios"; 
import { Table } from "antd";

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

export const Dashboard = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [organizers, setOrganizers] = useState(0);
  const [photographers, setPhotographers] = useState(0);
  const [attendees, setAttendees] = useState(0);
  const [userData, setUserData] = useState([]);

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
    fetchCounts();
    fetchUserData()
  }, [token]);

  const data = {
    labels: ["Organizers", "Photographers", "Attendees"],
    datasets: [
      {
        label: "Participants",
        data: [organizers, photographers, attendees], // Dynamic data from API
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF4D67", "#2D8AD2", "#E6B800"],
      },
    ],
  };

  // ✅ Define table columns
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
      filters: [
        { text: "Organizer", value: "organizer" },
        { text: "Photographer", value: "photographer" },
        { text: "Attendee", value: "attendee" },
      ],
      onFilter: (value, record) => record.role === value,
    },
  ];

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
        <div className="flex items-center justify-between w-full">
          <div className="mt-3 flex flex-col gap-3">
            <div className="text-lg font-medium w-60 h-28 bg-secondary-100 p-3 rounded-md shadow-lg flex flex-col">
              Organizers
              <span className="text-2xl text-center">{organizers}</span>
            </div>
            <div className="text-lg font-medium w-60 h-28 bg-secondary-100 p-3 rounded-md shadow-lg flex flex-col">
              Photographers
              <span className="text-2xl text-center">{photographers}</span>
            </div>
            <div className="text-lg font-medium w-60 h-28 bg-secondary-100 p-3 rounded-md shadow-lg flex flex-col">
              Attendees
              <span className="text-2xl text-center">{attendees}</span>
            </div>
          </div>
          <div>
            <Doughnut data={data} />
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <div className="text-lg text-end font-medium w-60 h-28 bg-secondary-100 p-3 rounded-md shadow-lg flex flex-col">
              Male <span className="text-2xl text-center">{attendees}</span>
            </div>
            <div className="text-lg text-end font-medium w-60 h-28 bg-secondary-100 p-3 rounded-md shadow-lg flex flex-col">
              Female <span className="text-2xl text-center">{attendees}</span>
            </div>
            <div className="text-lg text-end font-medium w-60 h-28 bg-secondary-100 p-3 rounded-md shadow-lg flex flex-col">
              Attendees
              <span className="text-2xl text-center">{attendees}</span>
            </div>
          </div>
        </div>
        {/* ✅ Ant Design Table */}
        <div className="mt-3">
          <h1 className="text-xl font-medium mb-3">Recent Users</h1>
          <Table columns={columns} dataSource={userData} rowKey="id" />
        </div>
      </div>
    </div>
  );
};
