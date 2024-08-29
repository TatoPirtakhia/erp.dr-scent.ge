import React from "react";
import { useSelector } from "react-redux";

export const DefaultDashboard = () => {
  const settings = useSelector((state) => state.systemInfo.settings);

  return <>Dashboard</>;
};

export default DefaultDashboard;
