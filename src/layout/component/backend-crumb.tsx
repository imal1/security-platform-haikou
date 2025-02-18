import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "@arco-design/web-react";
import routes from "@/routes";
import { Trees, deep } from "@/kit";
import { pathToRegexp } from "path-to-regexp";
import { IconRight } from "@arco-design/web-react/icon";
const { generateListNew } = Trees;
const BreadcrumbItem = Breadcrumb.Item;

const Crumb = () => {
  const location = useLocation();
  const [breadcrumbData, setBreadcrumbData]: any = useState(null);
  const [routeList, setRouteList] = useState([]);
  const init = async () => {
    let data = [];
    //把路由树展开
    generateListNew(routes, data);
    setRouteList(data);
  };
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    //匹配路由
    setBreadcrumbData([]);
    const routerIndex = routeList.findIndex((item: any) => {
      return pathToRegexp(item.path).exec(location.pathname);
    });
    if (routerIndex !== -1) {
      const row = routeList[routerIndex].breadcrumb;
      setBreadcrumbData(deep(row));
    }
  }, [location.pathname, routeList]);
  return (
    <div className={breadcrumbData ? "backend-breadcrumb-wrap" : ""}>
      {breadcrumbData && (
        <>
          {Array.isArray(breadcrumbData.data) ? (
            <Breadcrumb className="breadcrumb-box" separator={<IconRight />}>
              {breadcrumbData.data.map((item, index) => (
                <BreadcrumbItem
                  href={item.path ? `./#${item.path}` : null}
                  key={index}
                >
                  {item.name}
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          ) : (
            <div className="pass-title">
              <span>{breadcrumbData.data}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Crumb;
