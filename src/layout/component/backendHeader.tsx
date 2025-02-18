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
  useEffect(() => {
    init();
  }, []);
  return (
    <div className="backend-header-wrap">
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
    </div>
  );
};
export default Header;
