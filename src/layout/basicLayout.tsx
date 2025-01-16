import { Outlet } from "react-router-dom";
import AppHeader from "./component/header";
import Breadcrumb from "./component/Breadcrumb";
import "./index.less";

const BasicLayout = () => {
  return (
    <div className="app-container app-container-wrap">
      <AppHeader />
      <Breadcrumb />
      <div className="layout-content-wrap">
        <Outlet />
      </div>
    </div>
  );
};

export default BasicLayout;
