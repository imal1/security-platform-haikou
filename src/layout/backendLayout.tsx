import { Outlet } from "react-router-dom";
import AppHeader from "./component/backendHeader";
import Breadcrumb from "./component/backend-crumb";
import "./index.less";

const BasicLayout = () => {
  return (
    <div className="app-container backend-container-wrap">
      <AppHeader />
      <Breadcrumb />
      <div className="backend-content-wrap">
        <Outlet />
      </div>
    </div>
  );
};

export default BasicLayout;
