import { Icon } from "@/components";
import routes from "@/routes";
import classNames from "classnames";
import { microAppHistory } from "kit";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [routeList, setRouteList] = useState([]);
  const init = async () => {
    const data = routes.filter((item) => item.backend);
    setRouteList(data);
  };
  const handleExit = () => {
    localStorage.removeItem("server-token");
    microAppHistory.replace("/login");
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div className="backend-header-wrap">
      <div className="backend-logo"></div>
      <div className="backend-title">海口市大型活动安保平台</div>
      <div className="backend-menu">
        {routeList?.map((item) => (
          <div
            className={classNames(
              "backend-menu-li",
              location.pathname === item.path && "active",
            )}
            key={item.path}
            onClick={() => {
              microAppHistory.push(item.path);
            }}
          >
            <span>{item.title}</span>
          </div>
        ))}
      </div>
      <div className="backend-action">
        <div className="backend-action-btn btn-exit" onClick={handleExit}>
          <Icon type="anbao-exit" className="text-[28px] align-[-8px]" />
          退出
        </div>
      </div>
    </div>
  );
};
export default Header;
