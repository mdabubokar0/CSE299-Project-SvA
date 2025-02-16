import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import authData from "./authData.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("login");
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    role: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8081/api/register",
        registerData
      );
      setRegisterData({
        name: "",
        username: "",
        password: "",
      });
      handleActive("login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8081/api/login",
        loginData
      );

      if (response.status === 200) {
        // Storing JWT token and role in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.error || error.message
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (active === "register") {
      setRegisterData({
        ...registerData,
        [name]: value,
      });
    } else {
      setLoginData({
        ...loginData,
        [name]: value,
      });
    }
  };

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
            <form
              className="flex flex-col gap-3 mt-12 text-xs w-[400px]"
              onSubmit={handleRegister}
            >
              <input
                name="name"
                value={registerData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter Full Name"
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              />
              <input
                name="username"
                value={registerData.username}
                onChange={handleChange}
                type="text"
                placeholder="Enter Username"
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              />
              <select
                name="role"
                id="role"
                value={registerData.role}
                onChange={handleChange}
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              >
                <option value="attendee">Attendee</option>
                <option value="organizer">Organizer</option>
                <option value="photographer">Photographer</option>
              </select>
              <input
                name="password"
                value={registerData.password}
                onChange={handleChange}
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
            <form
              className="flex flex-col gap-3 mt-12 text-xs w-[400px]"
              onSubmit={handleLogin}
            >
              <input
                name="username"
                value={loginData.username}
                onChange={handleChange}
                type="text"
                placeholder="Enter Username"
                className="w-full h-12 rounded-max border border-primary px-3 bg-bg focus:outline-none"
              />
              <input
                name="password"
                value={loginData.password}
                onChange={handleChange}
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
              {authData.map((a, index) => (
                <SwiperSlide key={index}>
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
