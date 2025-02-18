import queryString from "query-string";

import globalState from "@/globalState";
import {
  getEventId,
  getRouteUrl,
  getVenueId,
  projectIdentify,
  tryGet,
} from "@/kit";
import appStore from "@/store";
import { BroadcastChannel } from "broadcast-channel";
import { debounce } from "lodash";
import { makeAutoObservable } from "mobx";
import {
  getAccessToken,
  getEventVenueInfo,
  getLayerBusinessQuery,
  getLayerServiceQuery,
  getUserBaseInfo,
  getUserInfo,
  platformRegisterInfo,
} from "./webapi";

class AppStore {
  broadcastChannel: BroadcastChannel;
  constructor() {
    makeAutoObservable(this);
    this.broadcastChannel = new BroadcastChannel("my_channel");
    this.openVideoList = debounce(this.openVideoList, 300); // 防抖处理
    // this.initBroadcastChannel();
  }
  serviceRoutes: any = null;
  accessToken: string = "";
  serverToken: string = "";
  expiresIn: number = 24 * 60 * 60;
  ueConfig: any = {};
  eventVenueInfo: any = {};
  dahuoUserInfo: any = {};
  winParams: any = {};
  window1: any = {};
  devicePerspectiveVisible: boolean = false;
  // initBroadcastChannel() {
  //   this.broadcastChannel.onmessage = (message) => {
  //     debugger;
  //     console.log("Received message:", message);
  //     // 处理接收到的消息
  //   };
  // }

  sendMessage(message: any) {
    const routeUrl = getRouteUrl();

    if (window.globalConfig["newPageVideo"] && message) {
      this.openVideoList();
      localStorage.setItem(
        `${projectIdentify}-message`,
        JSON.stringify(message),
      );
    }
    this.broadcastChannel.postMessage(message);
  }
  initialPlatform = async () => {
    try {
      const hash = window.location.hash.split("#")[1];
      const urlParams = queryString.parse(hash ? hash.split("?")[1] : "");
      const { eventId, venueId, token } = urlParams;
      if (eventId) {
        localStorage.setItem(`${projectIdentify}-eventId`, `${eventId}`);
      }
      if (venueId) {
        localStorage.setItem(`${projectIdentify}-venueId`, `${venueId}`);
      }
      if (token) {
        localStorage.setItem(`${projectIdentify}-token`, `${token}`);
      }
      const res = await getEventVenueInfo({
        eventId: getEventId(),
        venueId: getVenueId(),
      });
      this.eventVenueInfo = res;
      globalState.set({
        eventVenueInfo: res,
      });
      setTimeout(() => {
        this.openVideoList();
      }, 200);
      this.getUserInfo();
    } catch (error) {}
  };
  //获取云平台用户信息
  getUserBaseInfo = async () => {
    try {
      let res = await getUserBaseInfo();
      globalState.set({
        userInfo: res,
      });
    } catch (error) {}
  };
  getUserInfo = async () => {
    try {
      const jwtToken = localStorage.getItem(`${projectIdentify}-token`);
      if (!jwtToken) {
        const user = localStorage.getItem("dahuoUserInfo");
        if (!user) {
          globalState.set({
            dahuoUserInfo: {
              username: "avcs002",
            },
          });
          return;
        }
        this.dahuoUserInfo = JSON.parse(user);
        globalState.set({
          dahuoUserInfo: JSON.parse(user),
        });
        return;
      }
      const res = await getUserInfo({ jwtToken });
      this.dahuoUserInfo = res.user;
      globalState.set({
        dahuoUserInfo: res.user,
      });
      localStorage.setItem("dahuoUserInfo", JSON.stringify(res.user));
    } catch (error) {}
  };
  getAccessToken = async () => {
    try {
      const { userName, secretKey, portalUrl } = this.ueConfig;
      const res = await getAccessToken({ userName, secretKey }, portalUrl);
      this.accessToken = res.access_token;
      this.expiresIn = res.expires_in;
      this.refreshToken(this.expiresIn);
      setTimeout(() => {
        this.platformRegisterInfo();
      }, 200);
    } catch (error) {
      console.log(error);
    }
  };
  // 定时刷新 token
  refreshToken(expiresIn: number) {
    // 默认 token 是 24 小时过期
    if (!expiresIn) {
      expiresIn = 24 * 60 * 60;
    }
    const ms = (expiresIn - 4 * 60 * 60) * 1000;
    setTimeout(async () => {
      const { userName, secretKey, portalUrl } = this.ueConfig;
      const res = await getAccessToken({ userName, secretKey }, portalUrl);
      this.accessToken = res.access_token;
      this.expiresIn = res.expires_in;
      this.refreshToken(res.expires_in);
    }, ms);
  }
  //获取微服务路由映射
  platformRegisterInfo = async () => {
    try {
      const res = await platformRegisterInfo();
      this.serviceRoutes = res[0].serviceUrlSignMap;
      globalState.set({
        serviceRoutes: res[0].serviceUrlSignMap,
      });
      this.changeState({
        serviceRoutes: res[0].serviceUrlSignMap,
      });
    } catch (error) {}
  };
  /**
   * 获取警务设备位置
   * @param gbid
   */
  getLayerServiceQuery = async (gbid, viewer) => {
    try {
      if (!gbid || !viewer) return;
      const params = {
        appName: globalState.get("userInfo")?.userName,
        serviceNames: ["device_position_modify"],
        terms: [
          {
            column: "gbid",
            value: [gbid],
            termType: "in",
            filterType: 1,
            type: "and",
          },
        ],
      };
      const res = await getLayerServiceQuery(params);
      const locationpoint = tryGet(res?.data[0], "locationpoint") || [];
      locationpoint?.length &&
        this.flyTo(
          {
            lng: locationpoint[0],
            lat: locationpoint[1],
            alt: appStore.devicePerspectiveVisible ? 800 : 100,
            pitch: -90,
          },
          viewer,
        );
    } catch (error) {}
  };
  flyTo = async (views, viewer) => {
    if (!viewer) return;
    try {
      const cameraInfo = viewer ? await viewer.getCameraInfo() : {};
      viewer &&
        viewer.flyTo({
          ...cameraInfo,
          ...views,
        });
    } catch (error) {}
  };
  browserIsHide() {
    let fs = window["RequestFileSystem"] || window["webkitRequestFileSystem"];
    if (!fs) {
      console.log("check failed?");
    } else {
      fs(
        window["TEMPORARY"],
        100,
        function () {
          console.log("非无痕模式");
        },
        function () {
          alert("您已开启无痕模式，为了不影响正常功能使用，请立即关闭！");
        },
      );
    }
  }
  //是否是无痕模式
  isIncognito() {
    return new Promise((resolve) => {
      const fs =
        window["RequestFileSystem"] || window["webkitRequestFileSystem"];
      if (!fs) {
        resolve(false); // 不是无痕模式
      } else {
        fs(
          window["TEMPORARY"],
          100,
          () => resolve(false),
          () => resolve(true),
        );
      }
    });
  }
  openVideoList = async () => {
    try {
      if (!window.globalConfig["newPageVideo"]) {
        return;
      }
      const isExtended = window.screen["isExtended"] || false;
      const routeUrl = getRouteUrl();
      const windowArray = [];
      const window1 = {
        windowId: "video-list",
        windowState: { state: "fullscreen" },
        isPrimary: !isExtended,
        isSubWindow: true,
        name: "视频调阅",
        params: {
          url: `${routeUrl}#/video_list`,
          left: 0,
          top: 0,
          type: "popup",
        },
      };
      this.window1 = window1;
      windowArray.push(window1);
      const winParams = {
        action: "openWindows",
        appId: "1111",
        windowArray: windowArray,
      };
      this.winParams = winParams;
      const event = document.createEvent("CustomEvent");
      event.initCustomEvent("openWindows", false, false, winParams);
      document.dispatchEvent(event);
      // setTimeout(() => {
      //   window.open(
      //     `${routeUrl}#/video_list`,
      //     "视频调阅",
      //     "directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=1920, height=980"
      //   );
      // }, 3000);
    } catch (error) {
      console.log(error);
    }
  };
  closePage = (id) => {
    try {
      // 科达多屏扩展插件打开多屏扩展
      let event = document.createEvent("CustomEvent");
      // debugger
      event.initCustomEvent("closeWindow", false, false, {
        action: "closeWindow",
        appId: "1111",
        closeWindowId: id,
      });
      document.dispatchEvent(event);
    } catch (error) {}
  };
  getLayerBusinessQuery = async (options) => {
    try {
      const {
        pageNo = 0,
        pageSize = 2000,
        deviceStatus = [],
        location = this.ueConfig.location,
        deviceName = "",
        cameraForms,
        noLocation = false,
      } = options || {};
      let { deviceTypes = [] } = options || {};
      deviceTypes = deviceTypes.filter(
        (item) => !["IPC_1", "IPC_3"].includes(item),
      );
      const terms = [];
      if (deviceTypes?.length > 0 || cameraForms?.length > 0) {
        const deviceTypeTerms = [];
        if (deviceTypes?.length > 0) {
          deviceTypeTerms.push({
            column: "deviceType",
            termType: "in",
            type: "or",
            filterType: "1",
            value: deviceTypes,
          });
        }
        if (cameraForms?.length > 0) {
          deviceTypeTerms.push({
            type: "or",
            terms: [
              {
                column: "deviceAttr.ipc.cameraForm",
                termType: "in",
                type: "and",
                filterType: "1",
                value: cameraForms || [],
              },
              {
                column: "deviceType",
                termType: "eq",
                type: "and",
                filterType: "1",
                value: "IPC",
              },
            ],
          });
        }
        const term = {
          type: "and",
          terms: deviceTypeTerms,
        };
        terms.push(term);
      }

      if (deviceStatus?.length > 0) {
        terms.push({
          column: "status",
          value: deviceStatus,
          termType: "in",
          filterType: 1,
          type: "and",
        });
      }
      if (deviceName) {
        terms.push({
          column: "name",
          value: deviceName,
          termType: "like",
          filterType: 1,
          type: "and",
        });
      }

      const params: any = {
        appName: globalState.get("userInfo")?.userName,
        serviceNames: ["device_position_modify"],
        includes: [
          "id",
          "name",
          "deviceType",
          "gbid",
          "status",
          "groupId",
          "deviceAttr",
          "locationpoint",
        ],
        filterTerms: terms,
        pageNo: pageNo,
        pageSize: pageSize,
      };
      if (!noLocation) {
        params.location = location;
      }
      // 获取总条数
      const initialRes = await getLayerBusinessQuery(params);
      const totalPages = initialRes.totalPages;
      let allData = initialRes.data;
      // 创建所有分页请求的Promise

      const promises = [];

      for (let pageNo = 1; pageNo < totalPages; pageNo++) {
        const pageParams = { ...params, pageNo };

        promises.push(getLayerBusinessQuery(pageParams));
      }

      // 并行请求所有分页数据
      const results = await Promise.all(promises);

      results.forEach((res) => {
        allData = allData.concat(res.data);
      });
      console.log(allData, "allData");
      return allData;
    } catch (error) {}
  };
  /**
   * 改变属性状态
   *
   * @memberof AppStore
   */
  changeState = (state: any) => {
    Object.assign(this, state);
  };
}
export default new AppStore();
