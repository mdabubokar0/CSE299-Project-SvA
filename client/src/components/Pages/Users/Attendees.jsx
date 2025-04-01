import React from "react";
import { Users } from "./Users";
import { Sidebar } from "../../Sidebar/Sidebar";
import { Avatar } from "../../Profile/Avatar";

export const Attendees = () => {
  return (
    <div className="flex">
      <div className="w-auto">
        <Sidebar />
      </div>
      <div className="m-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium bg-secondary-100 p-3 rounded-md shadow-lg">
            Attendees
          </h1>
          <Avatar />
        </div>
        <div className="mt-3">
          <Users userType="attendee" />
        </div>
      </div>
    </div>
  );
};
