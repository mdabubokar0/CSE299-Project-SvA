import React from "react";
import { Navbar } from "../Navbar/Navbar";
import { EventList } from "../Pages/Event/EventList";

export const Portfolio = () => {
  return (
    <div>
      <Navbar />
      <div>
        <h1 className="text-center font-reospec mt-10 text-[100px] leading-none">
          EVENTLY
        </h1>
        <p className="text-center text-sm font-medium">
          Your Ticket to Amazing Moments.
        </p>
        <div  className="w-[1000px] m-auto mt-10">
          <EventList />
        </div>
      </div>
    </div>
  );
};
