import modalCloseIconHover from "@/assets/img/arco/modal/close-hover.png";
import modalCloseIcon from "@/assets/img/arco/modal/close.png";
import noDataUrl from "@/assets/img/no-data/no-data.svg";
import deleteTips from "@/assets/img/place-manage/delete-tips.png";
import { ConfigProvider, Message, Modal } from "@arco-design/web-react";
import { ComponentConfig } from "@arco-design/web-react/es/ConfigProvider/interface";
import { pathToRegexp } from "path-to-regexp";
import React, { CSSProperties, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import {  Trees } from "@/kit";

import { NoData } from "../components";
import Undeveloped from "../pages/undeveloped";
import routes from "../routes";
import BasicLayout from "./basicLayout";
import IndexLayout from "./index";
import { IconLoading } from "@arco-design/web-react/icon";

const { generateListNew } = Trees;

export const CustomModalCloseIcon = ({
  styles,
  onClick,
}: {
  styles?: CSSProperties;
  onClick?: () => void;
}) => {
  const [src, setSrc] = useState(modalCloseIcon);
  return (
    <img
      onClick={onClick}
      src={src}
      className="custom-modal-close-icon"
      onMouseEnter={() => {
        setSrc(modalCloseIconHover);
      }}
      style={styles}
      onMouseLeave={() => setSrc(modalCloseIcon)}
    />
  );
};

const AuthRouter = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const componentConfig: ComponentConfig = {
    Input: {
      autoComplete: "off",
      placeholder: "请输入",
    },
    Form: {
      autoComplete: "off",
      requiredSymbol: { position: "start" },
    },
    Modal: {
      focusLock: false,
      maskClosable: false,
      closeIcon: <CustomModalCloseIcon />,
      mask: true,
      maskStyle: {
        opacity: "0.93",
        background: "#041b31",
      },
    },
    Popconfirm: {
      icon: <img src={deleteTips} width={21} />,
      okButtonProps: {
        size: "small",
      },
      cancelButtonProps: {
        size: "small",
      },
    },
    Drawer: {
      closeIcon: <CustomModalCloseIcon />,
    },
    TreeSelect: {
      allowClear: true,
      notFoundContent: <NoData image_width="50px" />,
      treeProps: {
        autoExpandParent: false,
        virtualListProps: { height: 200 },
        onExpand: (keys, extra) => {
          setExpandedKeys(keys);
        },
      },
    },
    Select: {
      notFoundContent: <NoData image_width="50px" />,
    },
    Empty: {
      imgSrc: noDataUrl,
    },
    Tooltip: {
      style: {
        zIndex: 99999999,
      },
    },
    Spin: {
      size: 40,
      icon: <IconLoading style={{ color: "#7fc6ff" }} />,
    },
  };
  const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  const [routeList, setRouteList] = useState([]);
  //   const TOKEN_KEY: string = process.env.TOKEN_KEY || `${projectIdentify}-key`;
  //   const token: string = localStorage.getItem(TOKEN_KEY);
  const init = async () => {
    Message.config({
      maxCount: 1,
    });
    let data = [];
    //把路由树展开
    generateListNew(routes, data);
    setRouteList(data);
  };
  useEffect(() => {
    init();
  }, []);
  // 已登录，无法跳转到登录页
  //   if (token && location.pathname === "/login") {
  //     return <Navigate to="/" replace />;
  //   }

  // 每次进入路由时，都执行此判断函数
  const onEnterApp = () => {
    // // 清理所有请求
    // abortAllRequest();
    // // 不存在Token 跳转到登录页
    // // 此时的 Token 为 mobx 内存的Token数据
    // // 不刷新页面情况下，删除 Locastorage 内的 Token 并不影响路由切换
    // if (!token && location.pathname !== "/login") {
    //   //清除登录缓存
    //   clearPlatformStorage();
    //   return <Navigate to="/login" replace />;
    // }
    //匹配路由
    const routerIndex = routeList.findIndex((item: any) => {
      return pathToRegexp(item.path).exec(location.pathname);
    });
    if (routerIndex !== -1) {
      const row = routeList[routerIndex];
      if (row.screen) {
        return <IndexLayout />;
      }
    }
    return <BasicLayout />;
  };

  // 针对 menus 内的路由进行组装渲染
  const renderRoutes = (routes: any) => {
    return routes.map((item: any) => {
      // 当前的组件
      const Component = item.component;
      // 递归执行
      return item.children?.length ? (
        <React.Fragment key={item.path}>
          {/* 当 存在 重定向 且 地址为当前地址时，重定向到对应地址 */}
          <Route
            path={item.path}
            element={
              item.redirect && location.pathname === item.path ? (
                <Navigate to={item.redirect} />
              ) : null
            }
          />
          <Route path={item.path}>{renderRoutes(item.children)}</Route>
        </React.Fragment>
      ) : (
        <React.Fragment key={item.path}>
          {/* 如果存在重定向，这设置为 Navigate 组件 */}
          <Route
            path={item.path}
            element={
              item.redirect ? <Navigate to={item.redirect} /> : <Component />
            }
          />
        </React.Fragment>
      );
    });
  };
  // 用来作为 404 页面的组件
  const NotFound = () => {
    return <div className="pass-container">正在努力开发中，敬请期待...</div>;
  };
  return (
    <ConfigProvider componentConfig={componentConfig}>
      <Routes>
        <Route element={onEnterApp()}>
          {renderRoutes(routes)}
          <Route path="*" element={<Undeveloped />}></Route>
        </Route>
      </Routes>
    </ConfigProvider>
  );
};

export default AuthRouter;
