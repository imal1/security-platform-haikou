import { makeAutoObservable, runInAction } from "mobx";
import { Message } from "@arco-design/web-react";
import indexStore from "../store";
import {
  getLeadershipRoute,
  getDeviceRoute,
  getInherentLeadershipRoute,
  getInherentDeviceRoute,
} from "./webapi";
import * as turf from "@turf/turf";
import { debounce, throttle } from "lodash";
import appStore from "@/store";
import { deep } from "@/kit";

class Store {
  constructor() {
    makeAutoObservable(this);
  }
  routeTrackMap: Map<any, any> = new Map();
  /**行车路线 */
  follow: boolean = false;
  currentIndex: number = 0;
  viewer: any = null;
  routeTrackData: Array<any> = [];
  routeList: Array<any> = [];
  currentBuild: any = [];
  currentRoute: any = {};
  routerDevices: any = null;
  deviceOpen: boolean = true;
  isReserveMode: boolean = false;
  pliceOpen: boolean = true;
  currentGbid: number | string = "";
  securityInstruction: string = "";
  // 实时轨迹
  realTrack: any = null;
  // 实时轨迹变形
  realRouteTrack: any = null;
  carDevice: string = null;
  carDeviceTemp: string = null;
  // 关联设备图层
  linkDeviceLayer: any = null;
  // 路线视频追踪参数
  videoTrack: boolean = true;
  videoDirection: string = "0";
  videoCount: number = 4;
  // 单屏时 右侧播放列表
  linkVideoList: any = [];
  featureInfo: any = null;
  // 追踪视频视频
  trackVideoIndex: number = 0;
  //
  realTackPanelVisble: boolean = false;
  realRouteTotal: number;
  realRouteProgress: number;
  realRouteSpeed: number;
  carDeviceMap: Array<any> = [];
  carDeviceVisible: boolean = false;
  /**
   *初始化数据
   *
   * @memberof Store
   */
  initialData = async (params?) => {
    try {
      this.initialVariable(params);
    } catch (error) {}
  };

  /**
   * 初始化变量
   *
   * @memberof Store
   */
  initialVariable = (params?) => {
    try {
      this.changeState({
        currentIndex: 0,
        routeTrackMap: new Map(),
        follow: false,
        routeTrackData: [],
        routeList: [],
        currentBuild: [],
        currentRoute: [],
        routerDevices: null,
        deviceOpen: true,
        isReserveMode: false,
        pliceOpen: true,
        currentGbid: "",
        trackVideoIndex: 0,
        securityInstruction: "",
        realTrack: null,
        carDevice: "",
        linkDeviceLayer: null,
        featureInfo: null,
        carDeviceMap: [],
        carDeviceVisible: false,
        carDeviceTemp: null,
        // videoTrack: true,
        // videoDirection: "0",
        ...params,
      });
    } catch (error) {}
  };
  //获取行车路线
  getLeadershipRoute = async (id: any) => {
    try {
      const geometryUtil = new window["KMapUE"].GeometryUtil({
        viewer: this.viewer,
      });
      await geometryUtil.removeAll();
      this.trackVideoIndex = 0;
      indexStore.leftVisible = true;
      indexStore.temporaryIds = "";
      indexStore.inherentIds = "";
      this.featureInfo = indexStore.featureInfoInherentVOList.filter(
        (item) => id == item.id
      )[0];
      if (!this.featureInfo) return;
      let res =
        this.featureInfo.type == "inherent"
          ? await getInherentLeadershipRoute(id)
          : await getLeadershipRoute(id);
      res = res.map((item) => {
        return {
          ...item,
          featureStyle: JSON.parse(item.featureStyle),
          geometry: JSON.parse(item.geometry),
          switchAnimation: JSON.parse(item.switchAnimation),
          visualAngle: JSON.parse(item.visualAngle),
        };
      });
      this.routeList = res;
      this.currentRoute = res[0];
      if (this.featureInfo.type === "inherent") {
        indexStore.inherentIds = res[0].id;
      } else {
        indexStore.temporaryIds = res[0].id;
      }

      const { geometry, securityInstruction, carDevice, carDeviceMap } =
        this.currentRoute;
      this.securityInstruction = securityInstruction;
      const carDeviceArr = carDevice.split(",");
      this.carDevice = carDeviceArr ? carDeviceArr[0] : "";
      this.carDeviceMap = carDeviceMap ? JSON.parse(carDeviceMap) : [];
      if (this.carDeviceMap?.length > 0) {
        this.carDeviceVisible = true;
        this.carDeviceTemp = this.carDevice;
      }
      const { passingPoints, time, routeTime } = this.currentRoute.featureStyle;
      const routeLine = turf.lineString(geometry?.geometry?.coordinates[0]);
      const routeLength = turf.length(routeLine, { units: "meters" });
      let totalTime;
      if (routeTime == "1") {
        totalTime = time;
      } else {
        totalTime = routeLength / time;
      }

      const routeData = this.viewer.segmentRoute({
        coordinates: geometry,
        segmentPoints: passingPoints,
        totalTime,
      });
      this.routeTrackData = routeData;
      // debugger
      this.getDeviceRoute();
      // this.initRoute();
      this.splitRouteBuild();
      if (this.isReserveMode) {
        this.initRoute();
      } else {
        this.setRealModeRoute();
      }
    } catch (error) {
      console.log(error, "xxx");
    }
  };

  setRealModeRoute = (init = false) => {
    if (
      !this.currentRoute ||
      JSON.stringify(this.currentRoute) == "{}" ||
      JSON.stringify(this.currentRoute) == "[]"
    )
      return;
    // TODO 暂时将右侧弹窗关闭
    !window.globalConfig["newPageVideo"] && (indexStore.rightVisible = true);
    this.resetSplitBuildGroup();
    indexStore.isPlay = false;
    indexStore.follow = false;
    indexStore.leftVisible = false;
    if (this.currentRoute.carType != 9) {
      // 室外车辆
      if (!this.carDevice && !init) {
        // 未绑定车载设备
        Message.warning("请先在管理平台绑定路线车辆/车载设备信息！");
      }
      // const current = routeTrackMap.get(currentIndex);
      // current.reset();
      // current.update({carsize: 5});
      // 实时轨迹模式
      // if (!this.carDevice) return;
      this.removeRoute();
      // this.initRealTimeTrack();
      this.initRealRouteTrack();
      indexStore.isReal = true;
    } else {
      // 室内车辆
      this.removeRoute();
      setTimeout(() => {
        if (this.routeTrackMap.size == 0) {
          this.initRoute();
          // this.initPlayDeviceList();
        }
      }, 1000);
    }
  };

  flyToRouteView = () => {
    const { switchAnimation, visualAngle } = this.currentRoute;
    if (switchAnimation && visualAngle) {
      const duration =
        switchAnimation.animationType != "0"
          ? switchAnimation.animationTime * 1000
          : 0;
      const rotation = visualAngle.rotation;
      this.viewer.flyTo({ ...rotation, duration });
    }
  };
  splitRouteBuild = () => {
    const { buildingFloor } = this.currentRoute;
    console.log("leadership floor", buildingFloor);
    try {
      if (buildingFloor.length == 0) return;
      const buildingFloors = JSON.parse(buildingFloor[0].content) || [];
      const distinctList = buildingFloors.filter(
        (item) => item.buildingId != "outdoor"
      );
      const buildIds = distinctList.map((item) => {
        return {
          buildId: item.buildingId,
          floor: item.floor,
        };
      });
      this.currentBuild = buildIds;
      indexStore.splitBuildGroup(buildIds);
    } catch (error) {}
  };

  resetSplitBuildGroup = () => {
    try {
      const buildIds = this.currentBuild.map((item) => item.buildId);
      if (buildIds?.length == 0) return;
      const build = new window["KMapUE"].SplitBuilding(this.viewer);
      setTimeout(() => {
        build.resetSplitBuildGroup(buildIds);
      }, 1000);
    } catch (error) {}
  };

  initRoute = () => {
    try {
      this.removeRoute();
      setTimeout(() => {
        const { routeColor, opacity, routeTime, routeWidth, time, cartType } =
          this.currentRoute.featureStyle;
        this.flyToRouteView();

        for (let index = 0; index < this.routeTrackData.length; index++) {
          const item = this.routeTrackData[index];
          // debugger
          const routetrack = new window["KMapUE"].RouteTrackOverview({
            viewer: this.viewer,
            options: {
              cartype: this.currentRoute.carType || 2,
              carsize: 1,
              type: this.currentRoute.carType == 9 ? "inner" : "outer",
              ...item,
              routeWidth,
              color: routeColor || "#EA930FFF",
              onComplete: (res) => {
                console.log("======createRouteTrack=======", res);
                if (this.currentRoute.carType == 9 && !this.isReserveMode) {
                  // this.linkVideoList = [];
                  this.currentGbid = "";
                  this.trackVideoIndex = 0;
                  // 室内路线在非预案模式下监听progress事件
                  // routetrack.off("progress");
                  routetrack.on(
                    "progress",
                    throttle((progress: any) => {
                      const { position } = progress;
                      this.getPlayDeviceList([position?.lng, position?.lat]);
                    }, 1000)
                  );
                  routetrack.on("RouteTrackOverviewFinished", () => {
                    this.initRoute();

                    // debugger
                    setTimeout(() => {
                      appStore.sendMessage(Array(9).fill({}));
                      this.currentGbid = "";
                      this.trackVideoIndex = 0;
                      this.initPlayDeviceList();
                    }, 2000);
                  });
                } else if (this.isReserveMode) {
                  this.currentGbid = "";
                  this.trackVideoIndex = 0;
                  // 轨迹路线在预案模式下监听progress事件
                  routetrack.on(
                    "progress",
                    throttle((progress: any) => {
                      const { position } = progress;
                      this.getPlayDeviceList([position?.lng, position?.lat]);
                    }, 1000)
                  );
                }
              },
              onError: (err) => {
                console.error("======createRouteTrack=======", err);
              },
            },
          });
          routetrack.update({ carsize: 0 });
          this.routeTrackMap.set(index, routetrack);
        }
      }, 100);
    } catch (error) {}
  };
  removeRoute = () => {
    this.routeTrackMap.forEach((trackItem) => {
      trackItem.removeAll();
    });
    this.routeTrackMap.clear();
  };
  // 创建实时轨迹
  initRealTimeTrack = () => {
    this.realTrack = new window["KMapUE"].RealTimeTrack({
      viewer: this.viewer,
      options: {
        gbid: this.carDevice,
        onComplete: (res) => {
          // this.linkVideoList = [];
          console.log("======RealTimeTrack=======", res);
          // 监听progress事件获取车辆实时位置
          this.realTrack.off("progress");
          this.realTrack.on(
            "progress",
            throttle((progress: any) => {
              const { position } = progress;
              this.getPlayDeviceList([position?.lng, position?.lat]);
            }, 2000)
          );
        },
        onError: (err) => {
          console.log("======RealTimeTrack=======", err);
        },
      },
    });
  };

  initRealRouteTrack = () => {
    if (
      !this.currentRoute ||
      JSON.stringify(this.currentRoute) == "{}" ||
      !this.currentRoute.featureStyle
    )
      return;
    const { routeColor, routeWidth } = this.currentRoute.featureStyle;
    this.realRouteTrack = new window["KMapUE"].RouteTrackOverview({
      viewer: this.viewer,
      options: {
        cartype: this.currentRoute?.carType || 2,
        carsize: 6,
        type: "real",
        gbid: this.carDevice,
        // gbid: "3205846000132208337",
        time: 100,
        coordinates: this.currentRoute.geometry.geometry.coordinates[0],
        routeWidth,
        color: routeColor || "#EA930FFF",
        onComplete: (res) => {
          console.log("======createRouteTrack=======", res);
          appStore.sendMessage(Array(9).fill({}));
          this.currentGbid = "";
          this.trackVideoIndex = 0;
          this.initPlayDeviceList();
          // 室内路线在非预案模式下监听progress事件
          // routetrack.off("progress");
          this.realRouteTrack.on("speed", (val: any) => {
            this.realRouteSpeed = Number(((val.speed / 100) * 3.6).toFixed(2));
          });
          this.realRouteTrack.on(
            "progress",
            throttle((val: any) => {
              if (this.isReserveMode) return;
              this.realTackPanelVisble = true;
              const { position, total, progress } = val;
              this.realRouteTotal = Number(total);
              // const diffValue = progress - this.realRouteProgress;
              // this.realRouteSpeed = Number(((diffValue / 200) * 3.6).toFixed(2))
              // this.realRouteSpeed = 40;
              this.realRouteProgress = Number(progress);
              this.getPlayDeviceList([position?.lng, position?.lat]);
            }, 2000)
          );
          this.realRouteTrack.on("RouteTrackOverviewFinished", () => {
            // this.initRoute();
            // 路线结束后停止订阅
            this.realRouteTrack?.unSubscribe();
            setTimeout(() => {
              appStore.sendMessage(Array(9).fill({}));
              this.currentGbid = "";
              this.trackVideoIndex = 0;
              this.initPlayDeviceList();
            }, 2000);
          });
        },
        onError: (err) => {
          console.error("======createRouteTrack=======", err);
        },
      },
    });
  };
  //

  //获取行车路线设备
  getDeviceRoute = async (values = {}) => {
    try {
      if (!this.currentRoute.id) return;
      const params = {
        ids: this.currentRoute.id,
        ...values,
      };
      const res =
        this.featureInfo.type == "inherent"
          ? await getInherentDeviceRoute(params)
          : await getDeviceRoute(params);
      this.routerDevices = res;
      if (this.linkVideoList?.length == 0) {
        this.initPlayDeviceList();
      }
    } catch (error) {}
  };
  routeTrackEvent = (follow) => {
    try {
      if (!indexStore.isPlay) return;
      const current = this.routeTrackMap.get(this.currentIndex);
      if (current) {
        current.play(this.currentRoute?.carType == 9 ? true : this.follow);
        current.update({ carsize: this.currentRoute?.carType == 7 ? 4 : 5 });
        // current.on(
        //   "TrackTimeCallback",
        //   throttle((res) => {
        //     const { lng, lat, alt } = res;
        //     indexStore.isPlay &&
        //       this.getPlayGbid(this.routerDevices?.device, [lng, lat]);
        //   }, 2000)
        // );
        current.on("RouteTrackOverviewFinished", () => {
          current.setLabel({
            visibility: true,
            content: "停靠点",
          });
          current.off("RouteTrackOverviewFinished");
          current.off("TrackTimeCallback");
          setTimeout(() => {
            current.setLabel({
              visibility: false,
            });
            current.clearLabel();
          }, 2000);

          if (this.currentIndex < this.routeTrackData.length - 1) {
            this.currentIndex = this.currentIndex + 1;
            setTimeout(() => {
              this.routeTrackEvent(this.follow);
            }, 2000);
          } else {
            current.pause();
            current.clearLabel();
            indexStore.isPlay = false;
            this.currentIndex = 0;
            this.currentGbid = "";
            this.trackVideoIndex = 0;
            setTimeout(() => {
              appStore.sendMessage(Array(9).fill({}));
              this.currentGbid = "";
              this.trackVideoIndex = 0;
              this.initPlayDeviceList();
            }, 2000);
          }

          if (this.currentRoute && this.currentRoute.carType == 9) {
            this.removeRoute();
            setTimeout(() => {
              if (this.routeTrackMap.size == 0) {
                this.initRoute();
              }
            }, 1000);
          }
        });
      }
    } catch (error) {}
  };
  remove = () => {
    this.routeTrackMap.forEach((value) => {
      value.remove();
    });
    this.realTrack && this.realTrack.remove();
    this.realTrack = null;
    this.realRouteTrack && this.realRouteTrack.remove();
    this.realRouteTrack = null;
    this.currentIndex = 0;
  };
  initPlayDeviceList = (init = false) => {
    if (!this.routerDevices || this.routerDevices?.device?.length == 0) {
      if (!init) {
        // Message.warning("请在管理平台关联路线设备！");
      }
      return;
    } else {
      const nIndex = 0;
      const devices = this.routerDevices?.device;
      const routeDevicesLength = devices.length;
      if (window.globalConfig["newPageVideo"]) {
        // 双屏
        if (!this.videoTrack) return;
        if (routeDevicesLength <= this.videoCount - 1) {
          // 如果关联设备小于等于8台的话直接返回
          this.linkVideoList = devices;
        } else {
          if (nIndex == 0) {
            this.linkVideoList = devices.slice(0, this.videoCount);
            // this.linkVideoList.push(devices[0]);
          }
        }

        if (
          (!this.isInnerRoute() && routeDevicesLength <= this.videoCount - 1) ||
          (this.isInnerRoute() && routeDevicesLength <= this.videoCount)
        ) {
          // 如果关联设备小于等于8台的话直接返回
          this.linkVideoList = devices;
        } else {
          if (this.isInnerRoute()) {
            if (this.videoCount == 1) {
              this.linkVideoList = [devices[nIndex]];
            } else {
              if (nIndex == 0) {
                this.linkVideoList = [];
                devices
                  .slice(1, this.videoCount)
                  .reverse()
                  .map((item) =>
                    this.linkVideoList.push({ ...item, prefix: "即将经过 " })
                  );
                this.linkVideoList.push({ ...devices[0], prefix: "正在经过 " });
              }
            }
          } else {
            if (this.videoCount == 1) {
              this.linkVideoList = [devices[nIndex]];
            } else {
              if (nIndex == 0) {
                this.linkVideoList = [];
                devices
                  .slice(1, this.videoCount - 1)
                  .reverse()
                  .map((item) =>
                    this.linkVideoList.push({ ...item, prefix: "即将经过 " })
                  );
                this.linkVideoList.push({ ...devices[0], prefix: "正在经过 " });
              }
            }
          }
        }

        if (this.videoCount == 1) {
          appStore.sendMessage(this.linkVideoList);
          return;
        }
        if (this.videoDirection == "1") {
          // 正序
          const msgData: any = [];
          if (!this.isInnerRoute()) {
            msgData.push({ gbid: this.carDevice, deviceName: "车载设备" });
          }
          this.linkVideoList.map((item) => {
            const {
              gbid,
              status,
              title,
              name,
              deviceType,
              deviceName,
              prefix,
            } = item;
            msgData.push({
              gbid,
              status,
              title,
              deviceType,
              name,
              deviceName,
              prefix,
            });
          });
          console.log("222linkVideoList", msgData);
          appStore.sendMessage(msgData);
        }
        // else {
        //   // 倒序
        //   const msgData: any = [];
        //   if(!this.isInnerRoute()) {
        //     msgData.push({ gbid: this.carDevice, deviceName: "车载设备" });
        //   }
        //   const videoListCopy = deep(this.linkVideoList);
        //   videoListCopy.reverse().map((item) => {
        //     const { gbid, status, title, name, deviceType, deviceName, prefix } = item;
        //     msgData.push({
        //       gbid,
        //       status,
        //       title,
        //       deviceType,
        //       name,
        //       deviceName,
        //       prefix
        //     });
        //   })
        //   console.log("333linkVideoList", msgData);
        //   appStore.sendMessage(msgData);
        // }
      } else {
        // 单屏、
        this.handleVideoList(devices, nIndex);
      }
    }
  };

  handleVideoList = (devices, nIndex) => {
    const isInnerRoute = this.isInnerRoute();
    const routeDevicesLength = devices.length;
    const maxDevices = isInnerRoute ? 4 : 3;

    if (routeDevicesLength <= maxDevices && routeDevicesLength > 0) {
      this.linkVideoList = this.createDeviceList(devices, maxDevices);
    } else if (routeDevicesLength > maxDevices && nIndex === 0) {
      const slicedDevices = devices.slice(0, maxDevices);
      this.linkVideoList = this.createDeviceList(slicedDevices, maxDevices);
    }
  };

  createDeviceList = (devices, maxDevices) => {
    return devices
      .map((device, index) => ({
        ...device,
        prefix: index === 0 ? "正在经过 " : "即将经过 ",
      }))
      .reverse();
  };

  isInnerRoute = () => {
    if (this.currentRoute?.carType == 9) {
      return true;
    }

    return false;
  };

  getPlayDeviceList = (point) => {
    if (!this.routerDevices || this.routerDevices?.device?.length == 0) return;

    const nearestDevice = this.isInnerRoute()
      ? this.getClosestThreePoints(this.routerDevices?.device, point)
      : this.getPlayDevice(this.routerDevices?.device, point);

    if (!nearestDevice) return;
    const nIndex = nearestDevice.index;
    console.log("nearestDevice", nearestDevice, nIndex);
    const devices = this.routerDevices?.device;
    this.trackVideoIndex = nIndex;

    if (window.globalConfig["newPageVideo"]) {
      this.handleDualScreenMode(nearestDevice, nIndex, devices);
    } else {
      this.handleSingleScreenMode(nearestDevice, nIndex, devices);
    }
  };

  handleDualScreenMode = (nearestDevice, nIndex, devices) => {
    if (!this.videoTrack || this.currentGbid == nearestDevice.gbid) return;

    const routeDevicesLength = devices.length;
    this.linkVideoList = this.getDualScreenVideoList(
      nIndex,
      devices,
      routeDevicesLength
    );

    if (this.videoCount == 1) {
      appStore.sendMessage(this.linkVideoList);
      return;
    }

    if (this.videoDirection == "1") {
      this.sendOrderedVideoMessage(devices);
    }
  };

  getDualScreenVideoList = (nIndex, devices, routeDevicesLength) => {
    if (
      (!this.isInnerRoute() && routeDevicesLength <= this.videoCount - 1) ||
      (this.isInnerRoute() && routeDevicesLength <= this.videoCount)
    ) {
      return devices;
    }

    if (this.isInnerRoute()) {
      return this.getInnerRouteVideoList(nIndex, devices, routeDevicesLength);
    } else {
      return this.getOuterRouteVideoList(nIndex, devices, routeDevicesLength);
    }
  };

  getInnerRouteVideoList = (nIndex, devices, routeDevicesLength) => {
    if (this.videoCount == 1) return [devices[nIndex]];

    if (nIndex < routeDevicesLength - (this.videoCount - 2) / 2 + 1) {
      return this.getEarlyStageVideoList(nIndex, devices);
    } else {
      return this.getLateStageVideoList(
        nIndex,
        devices,
        this.videoCount == 4 ? 2 : 4
      );
    }
  };

  getOuterRouteVideoList = (nIndex, devices, routeDevicesLength) => {
    if (this.videoCount == 1) return [devices[nIndex]];

    if (nIndex < routeDevicesLength - (this.videoCount - 2) / 2) {
      return this.getEarlyStageVideoList(nIndex, devices);
    } else {
      return this.getLateStageVideoList(
        nIndex,
        devices,
        this.videoCount == 4 ? 1 : 3
      );
    }
  };

  getEarlyStageVideoList = (nIndex, devices) => {
    const list = [];
    devices
      .slice(nIndex + 1, nIndex + 2 + Math.floor((this.videoCount - 2) / 2))
      .reverse()
      .forEach((item) => list.push({ ...item, prefix: "即将经过 " }));
    list.push({ ...devices[nIndex], prefix: "正在经过 " });
    devices
      .slice(nIndex - 4 < 0 ? 0 : nIndex - 4, nIndex)
      .reverse()
      .forEach((item) => list.push({ ...item, prefix: "已经经过 " }));
    return list;
  };

  getLateStageVideoList = (nIndex, devices, routeDevicesLength = 1) => {
    const list = [];
    devices
      .slice(nIndex, nIndex + routeDevicesLength)
      .reverse()
      .forEach((item) => list.push({ ...item, prefix: "即将经过 " }));
    list.push({ ...devices[nIndex], prefix: "正在经过 " });
    devices
      .slice(this.videoCount - routeDevicesLength, nIndex)
      .reverse()
      .forEach((item) => list.push({ ...item, prefix: "已经经过 " }));
    return list;
  };

  sendOrderedVideoMessage = (devices) => {
    const msgData = [];
    if (!this.isInnerRoute()) {
      msgData.push({ gbid: this.carDevice, deviceName: "车载设备" });
    }
    this.linkVideoList.forEach((item) => {
      const { gbid, status, title, name, deviceType, deviceName, prefix } =
        item;
      msgData.push({
        gbid,
        status,
        title,
        deviceType,
        name,
        deviceName,
        prefix,
      });
    });
    appStore.sendMessage(msgData);
  };

  handleSingleScreenMode = (nearestDevice, nIndex, devices) => {
    if (this.currentGbid == nearestDevice.gbid) return;

    const routeDevicesLength = devices.length;
    this.linkVideoList = this.isInnerRoute()
      ? this.getSingleScreenInnerRouteList(nIndex, devices, routeDevicesLength)
      : this.getSingleScreenOuterRouteList(nIndex, devices, routeDevicesLength);

    this.currentGbid = nearestDevice.gbid;
  };

  getSingleScreenInnerRouteList = (nIndex, devices, routeDevicesLength) => {
    if (routeDevicesLength <= 4) {
      const result = [...devices].reverse();
      result.forEach((item, index) => {
        if (index === result.length - 1) {
          item.prefix = "正在经过 ";
        } else {
          item.prefix = "即将经过 ";
        }
      });
      return result;
    }

    if (nIndex < routeDevicesLength - 1) {
      return nIndex == 0
        ? this.getLateStageVideoList(0, devices.slice(0, 4), 2)
        : devices
            .slice(nIndex - 1, nIndex + 3)
            .reverse()
            .map((device, index) => {
              if (index === 2) {
                return { ...device, prefix: "正在经过 " };
              } else if (index < 2) {
                return { ...device, prefix: "即将经过 " };
              } else {
                return { ...device, prefix: "已经经过 " };
              }
            });
    } else {
      return devices
        .slice(routeDevicesLength - 4)
        ?.reverse()
        .map((device, index) => {
          if (index < 2) {
            return { ...device, prefix: "即将经过 " };
          } else if (index === 2) {
            return { ...device, prefix: "正在经过 " };
          } else {
            return { ...device, prefix: "已经经过 " };
          }
        });
    }
  };

  getSingleScreenOuterRouteList = (nIndex, devices, routeDevicesLength) => {
    if (routeDevicesLength <= 3) {
      const result = [...devices].reverse();
      result.forEach((item, index) => {
        if (index === result.length - 1) {
          item.prefix = "正在经过 ";
        } else {
          item.prefix = "即将经过 ";
        }
      });
      return result;
    }

    if (nIndex < routeDevicesLength - 1) {
      return nIndex == 0
        ? this.getLateStageVideoList(0, devices.slice(0, 3))
        : devices
            .slice(nIndex - 1, nIndex + 2)
            .reverse()
            .map((device, index) => {
              if (index === 1) {
                return { ...device, prefix: "正在经过 " };
              } else if (index < 1) {
                return { ...device, prefix: "即将经过 " };
              } else {
                return { ...device, prefix: "已经经过 " };
              }
            });
    } else {
      return devices
        .slice(routeDevicesLength - 3)
        ?.reverse()
        .map((device, index) => {
          if (index < 2) {
            return { ...device, prefix: "即将经过 " };
          } else if (index === 2) {
            return { ...device, prefix: "正在经过 " };
          } else {
            return { ...device, prefix: "已经经过 " };
          }
        });
    }
  };
  /**
   * 获取距离路线实时点位最近播放的设备的详细信息
   */
  getPlayDevice = (data, point, range = 10) => {
    try {
      if (data.length == 0) return null;
      const list = data
        .map((item, index) => {
          const distance = this.getDistance(point, item.locationpoint);
          return {
            ...item,
            distance,
            index,
          };
        })
        .sort((a, b) => a.distance - b.distance);
      // this.currentGbid = list[0].gbid;
      return list[0];
    } catch (error) {}
  };

  getClosestThreePoints = (data, point) => {
    try {
      if (data.length === 0 || this.trackVideoIndex === undefined) return null;

      const currentIndex = this.trackVideoIndex;
      const prevIndex = Math.max(0, currentIndex - 1);
      const nextIndex = Math.min(data.length - 1, currentIndex + 1);

      const pointsToCheck = [
        { ...data[prevIndex], originalIndex: prevIndex },
        { ...data[currentIndex], originalIndex: currentIndex },
        { ...data[nextIndex], originalIndex: nextIndex },
      ];

      const closestPoint = pointsToCheck
        .map((item) => ({
          ...item,
          distance: this.getDistance(point, item.locationpoint),
        }))
        .sort((a, b) => a.distance - b.distance)[0];
      if (
        this.trackVideoIndex == closestPoint.originalIndex &&
        closestPoint.distance > (window.globalConfig["trackVideoRange"] || 30)
      ) {
        this.trackVideoIndex = nextIndex;
        return this.getClosestThreePoints(data, point);
      }
      return {
        ...closestPoint,
        index: closestPoint.originalIndex,
      };
    } catch (error) {
      console.error("Error in getClosestThreePoints:", error);
      return null;
    }
  };
  /**
   * 获取播放的gbid
   * @param data 设备列表
   * @param point  当前行车点位
   * @param range  行车点位范围
   */
  getPlayGbid = (data, point, range = 10) => {
    try {
      const list = data
        .map((item) => {
          const distance = this.getDistance(point, item.locationpoint);
          return {
            ...item,
            distance,
          };
        })
        .sort((a, b) => a.distance - b.distance);
      if (list.length && list[0]?.distance <= range) {
        this.currentGbid = list[0].gbid;
      }
    } catch (error) {}
  };
  //计算两点之间距离
  getDistance = (point1, point2) => {
    try {
      const from = turf.point(point1);
      const to = turf.point(point2);
      const options: any = { units: "meters" };
      const distance = turf.rhumbDistance(from, to, options);
      return distance;
    } catch (error) {}
  };
  /**
   * 改变属性状态
   *
   * @memberof Store
   */
  changeState = (state) => {
    Object.assign(this, state);
  };
}

export default new Store();
