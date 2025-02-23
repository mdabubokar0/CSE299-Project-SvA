import React from "react";
import { Navbar } from "../Navbar/Navbar";
import { EventList } from "../Pages/Event/EventList";
import Title from "../Props/Title";

export const Portfolio = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Title title="EVENTLY" subtitle="Your Ticket to Amazing Moments." />
        <div  className="w-[1000px] m-auto mt-10">
          <EventList />
        </div>
      </div>
    </div>
  );
};
