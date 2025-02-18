import React from "react";
import Axios from "axios";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
// import "@arco-design/web-react/dist/css/arco.css";
import "@arco-themes/react-security/index.less";
import "./index.css";
import "./index.less";

import App from "./App";
import globalState from "./globalState";
import store from "./store";
import { getProjectRelativePath, axios, Ajax, deep } from "@/kit";
const projectRelativePath = getProjectRelativePath();
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const render = () => {
  // 初始化请求参数
  Axios.get(`${projectRelativePath}static/config/kmapue.config.json`).then(
    (res) => {
      console.log("res", res);
      const {
        portalUrl,
        secretKey,
        solution,
        userName,
        mainView,
        navView,
        buildingView,
        location,
        compressionZoom,
        isMetaConfig,
        metaConfig,
      } = res.data;
      store.ueConfig = res.data;
      store.getAccessToken();
      globalState.set({
        baseUrl: portalUrl,
        solution,
        userInfo: {
          userName,
          userToken: secretKey,
        },
        mainView,
        navView,
        buildingView,
        location,
        ueConfig: res.data,
        compressionZoom,
        isMetaConfig,
        metaConfig,
      });
    }
  );
  Ajax.get(`${projectRelativePath}static/config/global.json`).then(
    async (config) => {
      const globalConfig = config;
      // let isStandAlone = await AppStore.getIsStandalone(globalConfig);
      //1、全局配置注入window（深拷贝）
      window["globalConfig"] = deep(globalConfig);
      //初始化axios实例
      axios.defaults.baseURL = globalConfig.BASE_URL;
      axios.setAxiosConfig(globalConfig);
      store.initialPlatform();
    }
  );
  root.render(<App />);
  reportWebVitals();
};

render();
