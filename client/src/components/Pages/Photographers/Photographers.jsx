import React from "react";
import { Navbar } from "../../Navbar/Navbar";
import { PhotographerList } from "./PhotographerList";
import Title from "../../Props/Title";

export const Photographers = () => {
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
