import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }
  , [token
  ]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard</p>
      <p>Your role is: {role}</p>
    </div>
  )
}
