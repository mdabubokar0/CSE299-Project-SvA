import React, { useEffect } from "react";
import { Navbar } from "../../Navbar/Navbar";
import { PhotographerList } from "./PhotographerList";
import Title from "../../Props/Title";
import { useNavigate } from "react-router-dom";

export const Photographers = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, []);
  
  return (
    <div>
      <Navbar />
      <div>
        <Title title="PHOTOGRAPHERS" subtitle="Hire Professionals" />
        <div className="w-[1000px] m-auto mt-10">
          <PhotographerList />
        </div>
      </div>
    </div>
  );
};
