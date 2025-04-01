import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

export const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button onClick={() => navigate("/")}>Go Home</Button>}
      />
    </div>
  );
};
