import React from 'react'
import { Navbar } from '../Navbar/Navbar'

export const Portfolio = () => {
  return (
    <div>
      <Navbar />
      <div className="absolute left-1/2 top-[108px] transform -translate-x-1/2 text-center">
      {/* EVENTLY Heading */}
      <h1 className="font-[Reospec] font-bold text-[96px] leading-[90px] text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
        EVENTLY
      </h1>
      {/* Subheading: "Your Ticket to Amazing Moments." */}
      <p className="absolute left-1/2 top-[160px] transform -translate-x-1/2 w-[235px] text-center font-[Poppins] font-medium text-[14px] leading-[18px] text-black">
        Your Ticket to Amazing Moments.
      </p>
      <div className="relative w-[300px] h-[252px] bg-[#F6FAF4] rounded-[12px] shadow-md">
      {/* Event Image */}
      <img 
        src={image} 
        alt={title} 
        className="w-full h-[170px] object-cover rounded-t-[12px]" 
      />

      {/* Event Title */}
      <h2 className="absolute top-[190px] left-1/2 transform -translate-x-1/2 text-[18px] font-medium text-black text-center">
        {title}
      </h2>

      {/* Event Price */}
      <p className="absolute top-[220px] left-1/2 transform -translate-x-1/2 text-[14px] font-medium text-black text-center">
        ৳ {price}
      </p>
    </div>
    </div>

    </div>
  )
}
