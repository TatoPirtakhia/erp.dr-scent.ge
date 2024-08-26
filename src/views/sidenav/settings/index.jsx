import React from "react";
import {
  DollarOutlined,
  GlobalOutlined,
  CalendarOutlined,
  UserOutlined,
  MailOutlined,
  TranslationOutlined,
  FileTextOutlined,
  SettingOutlined,
  MobileOutlined,
  LoginOutlined,
  BellOutlined,
  GoogleOutlined,
  EnvironmentOutlined,
  BankOutlined,
  ToolOutlined,
  FolderOutlined,
  DeploymentUnitOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation, Routes, Route, Navigate } from "react-router-dom";
import InnerAppLayout from "../../../layouts/inner-app-layout/index";
import { useDispatch, useSelector } from "react-redux";
import { onMobileNavSettingToggle } from "../../../store/slices/themeSlice";
import { getTranslation } from "../../../lang/translationUtils";
import Unit from "./units";
const url = "/settings";
const MenuItem = ({ icon, path, label }) => {
  const dispatch = useDispatch();
  return (
    <>
      {icon}
      <span>{getTranslation(label)}</span>
      <Link to={`${url}/${path}`} onClick={() => dispatch(onMobileNavSettingToggle(false))} />
    </>
  );
};

const getMenuItems = (user) => {
  const allMenuItems = [
   
    {
      key: "Unit",
      label: <MenuItem label={getTranslation("sidenav.settings.Unit")} icon={<FolderOutlined />} path="Unit" />,
      user_type: [1,2],
      element: <Unit />
    },
    
  ];
  return allMenuItems.filter(elm => elm.user_type.includes(user?.user_type));
};

const SettingOption = () => {
  const user = useSelector(state => state.auth.user);
  const location = useLocation();
  const locationPath = location.pathname.split("/");
  const currentPath = locationPath[locationPath.length - 1];
  const menuItems = getMenuItems(user);

  return <Menu mode="inline" selectedKeys={[currentPath]} items={menuItems} />;
};

const SettingContent = () => {
  const user = useSelector(state => state.auth.user);
  const menuItems = getMenuItems(user);
  return (
    <Routes>
      {menuItems.map((elm, index) =>
        <Route path={`${elm.key}`} key={index} element={elm.element} />
      )}
      {menuItems.length === 0 ? null : <Route path="*" element={<Navigate to={menuItems[0].key} replace />} />}
    </Routes>
  );
};

const Setting = () => (
  <div className="overflow-hidden">
    <InnerAppLayout
      sideContentWidth={320}
      sideContent={<SettingOption />}
      mainContent={<SettingContent />}
    />
  </div>
);

export default Setting;
