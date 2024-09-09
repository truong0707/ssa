import React, { useState, useEffect } from "react";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Connect = () => {
  // eslint-disable-next-line no-unused-vars
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast("Quay lại trực tuyến", { type: "success" });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast("Không có mạng. Kiểm tra lại kết nối!", { type: "error" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <ToastContainer />
    </>
  );
};

export default Connect;
