import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import authData from "./authData.json";

export const Auth = () => {
  const [active, setActive] = useState("register");

  const handleActive = (value) => {
    setActive(value);
  };

  return (
    <div className="flex items-center justify-evenly">
      <div className="w-1/2 flex flex-col items-center justify-center">
        {/* Toggle Container */}
        <div className="bg-secondary-100 flex items-center gap-[2px] rounded-sm w-[300px] h-[28px] px-1 text-xs">
          {/* Register Button */}
          <div
            onClick={() => handleActive("register")}
            className={`h-6 rounded-sm flex items-center justify-center w-[145px] cursor-pointer transition-all duration-200 ${
              active === "register" ? "bg-primary text-white" : "text-black"
            }`}
          >
            Register
          </div>
          {/* Login Button */}
          <div
            onClick={() => handleActive("login")}
            className={`h-6 rounded-sm flex items-center justify-center w-[145px] cursor-pointer transition-all duration-200 ${
              active === "login" ? "bg-primary text-white" : "text-black"
            }`}
          >
            Login
          </div>
        </div>
        {/* Form Container */}
        {active === "register" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="text-center flex flex-col items-center">
              <h1 className="font-medium text-[40px]">Welcome</h1>
              <p className="w-3/4 text-sm">
                Sign up to Evently to experience the easy and user friendly
                event management system
              </p>
            </div>
            <form className="flex flex-col gap-3 mt-12 text-xs w-[400px]">
              <input
                type="text"
                placeholder="Enter Full Name"
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Enter Username"
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              />
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="checkbox"
                  className="accent-primary"
                />
                <label htmlFor="checkbox">
                  I agree to the terms and conditions
                </label>
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-max bg-primary text-white hover:bg-bg transition-all duration-200 hover:text-primary border border-primary"
              >
                Register
              </button>
            </form>
            <p>
              Already have an account?{" "}
              <span
                className="text-secondary-200 cursor-pointer"
                onClick={() => handleActive("login")}
              >
                Login
              </span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="text-center flex flex-col items-center">
              <h1 className="font-medium text-[40px]">Welcome back</h1>
              <p className="w-3/4 text-sm">
                Login to Evently to experience the easy and user friendly event
                management system
              </p>
            </div>
            <form className="flex flex-col gap-3 mt-12 text-xs w-[400px]">
              <input
                type="text"
                placeholder="Enter Username"
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              />
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              />
              <button
                type="submit"
                className="w-full h-12 rounded-max bg-primary text-white hover:bg-bg transition-all duration-200 hover:text-primary border border-primary"
              >
                Login
              </button>
            </form>
            <p>
              Don't have an account?{" "}
              <span
                className="text-secondary-200 cursor-pointer"
                onClick={() => handleActive("register")}
              >
                Register
              </span>
            </p>
          </div>
        )}
      </div>
      <div className="w-1/2 h-[100vh] p-3">
        <div className="bg-secondary-100 rounded-lg h-full shadow-md">
          <div className="pt-[90px]">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={50}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
            >
              {authData.map((a) => (
                <SwiperSlide>
                  <div className="flex flex-col items-center gap-3">
                    <img src={a.img} alt="image" />
                    <p className="text-center w-3/4">{a.title}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};
