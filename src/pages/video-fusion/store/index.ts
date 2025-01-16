import { makeAutoObservable } from "mobx";
import globalState from "../../../globalState";
import { deep, delay } from "../../../kit";
import {
  getMediaAddress,
  getMediaAddressByTag,
  getMediaConfig,
  getNodeConfig,
  getVideoPageUrl,
  stopMediaPush,
} from "./webapi";

class Store {
  constructor() {
    makeAutoObservable(this);
    // this.initVariable();
  }

  viewer = null;
  leftVisible: boolean = true;
  leftPanelVisible: boolean = true;
  homeLeftSideActive: string = "0";
  isWandering: boolean = false;
  wanderOrder: number = 0;
  routePointsInfo: any = null;
  activePoint: string;
  activePoints: Array<string>;
  allPoints: Array<string> = [
    "videofusion_1",
    "videofusion_2",
    "videofusion_3_1",
    "videofusion_3_2",
    "videofusion_4",
    "videofusion_5",
    "videofusion_6",
  ];

  // 视频融合图层
  videoFusionLayer: any = null;

  initVariable = () => {
    this.routePointsInfo = deep(pointsInfo);
  };

  // 初始化视频融合图层
  initVideoFusionLayer = (options: any) => {
    const videoFusionTmp = new window["KMapUE"].VideoFusionTwinLayer({
      viewer: this.viewer,
      options,
    });
    this.changeState({
      videoFusionLayer: videoFusionTmp,
    });
  };

  // 处理视频融合列表点击事件
  handleCheckClick = async (checked: boolean, item: any) => {
    console.log("item click: ", item);
    if (checked) {
      this.activePoints.push(item.value);
      this.flyToView(item.cameraInfo);
      console.log("item.deviceId: ", item.deviceId);

      item.deviceId && (await getMediaAddress(item.deviceId));
      this.showVideoFusion([item.value]);
    } else {
      this.activePoints = this.activePoints.filter(
        (value) => value !== item.value
      );
      item.deviceId && (await stopMediaPush(item.deviceId));
      this.hideVideoFusion([item.value]);
    }
  };

  handlePointClick = async (item: any) => {
    this.flyToView(item?.cameraInfo);
    item.deviceId && (await getMediaAddress(item.deviceId));
    this.showVideoFusion([item.value]);
    if (this.activePoint) {
      const oldRow = this.routePointsInfo.find(
        (row) => row.value == this.activePoint
      );
      oldRow.deviceId && (await stopMediaPush(oldRow.deviceId));
      this.hideVideoFusion([oldRow.value]);
      this.activePoint = item.value;
    }
  };

  // 初始化数据
  initVideoFusion = async () => {
    await this.mergeAddressData();
    await this.mergeNodeData();
  };

  // 合并拉流地址数据
  mergeAddressData = async () => {
    // const response = await getMediaConfig();
    // console.log("data: ", response?.data);
    // const transformedData = Object.entries(response.data).map(([tag, rtsp]) => ({
    //     tag
    // })).filter(item => (item.tag != "videofusion_1" && item.tag != "videofusion_3_2"));
    // console.log("transformedData: ", transformedData); // 输出转换后的数据
    // this.initVideoFusionLayer({ tags: transformedData });
  };

  // 合并节点数据
  mergeNodeData = async () => {
    const nodeRes = await getNodeConfig();
    const nodeData = Object.entries(nodeRes.data).map(([tag, deviceId]) => ({
      tag,
      deviceId,
    }));
    const transformedData = Object.keys(nodeRes.data).filter(
      (item) => item != "videofusion_1" && item != "videofusion_3_2"
    );
    this.initVideoFusionLayer({ tags: transformedData });
    console.log("nodeData: ", nodeData);
    this.routePointsInfo.forEach((item) => {
      const nodeMatch = nodeData.find((data) => data.tag === item.value);
      console.log("nodeMatch: ", nodeMatch);
      if (nodeMatch) {
        item.deviceId = nodeMatch.deviceId;
      }
    });
    console.log("this.routePointsInfo: ", this.routePointsInfo);
  };

  showVideoFusionByIndex = (index: number) => {
    const currentItem = pointsInfo[index];
    const nextItem = pointsInfo[index + 1];

    const currentLabel = currentItem ? currentItem.value : null;
    const nextLabel = nextItem ? nextItem.value : null;

    const showArr = [];
    currentLabel && showArr.push(currentLabel);
    nextLabel && showArr.push(nextLabel);
    // 获取除了当前和下一个对象的其他对象的value值
    const otherValues = pointsInfo
      .filter((item, idx) => idx !== index && idx !== index + 1)
      .map((item) => item.value);
    otherValues.forEach((item) => {
      const point = this.routePointsInfo.find((data) => data.value === item);
      point && stopMediaPush(point.deviceId);
    });
    this.hideVideoFusion(otherValues);
    setTimeout(() => {
      this.showVideoFusion(showArr);
      currentLabel && getMediaAddressByTag(currentLabel);
      nextLabel && getMediaAddressByTag(nextLabel);
    }, 1000);
  };
  stopAllVideoFusion = (ids: Array<string>) => {
    try {
      ids.forEach((id) => {
        try {
          const matchNode = this.routePointsInfo.find(
            (item) => item.value == id
          );
          stopMediaPush(matchNode.deviceId);
        } catch (error) {}
      });
    } catch (error) {}
  };
  // 显示视频融合面板
  showVideoFusion = (ids: Array<string>) => {
    if (!this.videoFusionLayer) return;
    const showParams = [];
    ids.forEach((id) => {
      const matchNode = this.routePointsInfo.find((item) => item.value == id);
      if (matchNode) {
        const url = getVideoPageUrl(matchNode.deviceId, 1920, 1080);
        showParams.push({
          tag: id,
          videoUrl: url,
          width: 1920,
          height: 1080,
        });
      }
    });
    this.videoFusionLayer.show(showParams);
    // (this.videoFusionLayer && ids.length > 0) && this.videoFusionLayer.show(ids);
  };

  // 隐藏视频融合面板
  hideVideoFusion = (ids: Array<string>) => {
    if (!this.videoFusionLayer) return;
    const hideParams = [];
    ids.forEach((id) => {
      const matchNode = this.routePointsInfo.find((item) => item.value == id);
      if (matchNode) {
        hideParams.push({
          tag: id,
        });
      }
    });
    this.videoFusionLayer.hide(hideParams);
  };

  // 飞行接口转发
  flyToView = (view: any) => {
    this.viewer.flyTo(view);
  };

  wanderRouteTest = () => {
    const wanderOption = [
      {
        lng: 108.3811083508439,
        lat: 22.819155584974947,
        alt: 192.7844132212269,
        pitch: -12.542856216430664,
        heading: 208.01675415039062 - 90,
        time: 5,
      },
      {
        lng: 108.37029566010598,
        lat: 22.81503806110273,
        alt: 192.78482362803152,
        pitch: -17.714284896850586,
        heading: 137.78817749023438 - 90,
        time: 5,
      },
      {
        lng: 108.37149919939849,
        lat: 22.80444316169485,
        alt: 192.78477553840355,
        pitch: -24.28571319580078,
        heading: 32.216758728027344 - 90,
        time: 5,
      },
      {
        lng: 108.3800555358583,
        lat: 22.807105235252042,
        alt: 334.9515085478041,
        pitch: -30.114286422729492,
        heading: -56.98321533203125 - 90,
        time: 5,
      },
      {
        lng: 108.3811083508439,
        lat: 22.819155584974947,
        alt: 192.7844132212269,
        pitch: -12.542856216430664,
        heading: 208.01675415039062 - 90,
        time: 5,
      },
      {
        lng: 108.37029566010598,
        lat: 22.81503806110273,
        alt: 192.78482362803152,
        pitch: -17.714284896850586,
        heading: 137.78817749023438 - 90,
        time: 5,
      },
    ];

    this.viewer?.wander(wanderOption);

    this.viewer.off("wanderend");
    this.viewer.on("wanderend", (e) => {
      console.log("e", e);
    });
  };

  // 路线漫游
  wanderRoute = async () => {
    //
    if (!this.viewer) return;
    this.changeState({
      isWandering: true,
    });
    const wanderOption = [];

    for (let index = 0; index < pointsInfo.length; index++) {
      const item = pointsInfo[index];
      if (!item.cameraInfo) return;
      this.showVideoFusionByIndex(this.wanderOrder);
      this.flyToView({
        ...globalState.get("mainView"),
        ...item.cameraInfo,
        duration: 3000,
        animation: "Linear",
      });
      this.changeState({
        wanderOrder: index,
      });
      await delay(15000);
      if (index == pointsInfo.length - 1) {
        this.changeState({
          isWandering: false,
          wanderOrder: 0,
        });
        this.flyToView(globalState.get("mainView"));
      }
    }
    // pointsInfo.map((item) => {
    //     if (!item.cameraInfo) return;
    //     const { lng, lat, alt, pitch, heading } = item.cameraInfo;
    //     wanderOption.push({
    //         lng,
    //         lat,
    //         alt,
    //         pitch,
    //         heading: heading - 90,
    //         time: 10
    //     })
    // })
    // this.viewer?.wander(wanderOption);

    // this.viewer.off("wanderend");
    // this.viewer.on("wanderend", (e) => {
    //   console.log("e", e);
    //   if (e.order == pointsInfo.length - 1) {
    //     this.changeState({
    //       isWandering: false,
    //       wanderOrder: 0,
    //     });

    //     setTimeout(() => {
    //       this.flyToView({ ...globalState.get("mainView"), duration: 3000 });
    //     }, 3000);
    //   }
    //   this.changeState({
    //     wanderOrder: e.order + 1,
    //   });
    //   setTimeout(() => {
    //     this.showVideoFusionByIndex(this.wanderOrder);
    //   }, 2000);
    // });
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

export const pointsInfo = [
  {
    index: 0,
    label: "会展中心会标背后山坡",
    value: "videofusion_1",
    cameraInfo: {
      lng: 108.38014979991939,
      lat: 22.811458953490437,
      alt: 87.600000000000009,
      pitch: -8.2,
      heading: -141.800003 + 90,
      duration: 3000,
    },
  },
  {
    index: 1,
    label: "4号厅外侧",
    value: "videofusion_2",
    cameraInfo: {
      lng: 108.37643668597875,
      lat: 22.811500062489856,
      alt: 35.004177249999998,
      pitch: -20.799999,
      heading: -80.0 + 90,
      duration: 3000,
    },
  },
  {
    index: 2,
    label: "会议中心正门西",
    value: "videofusion_3_1",
    cameraInfo: {
      lng: 108.37600221666887,
      lat: 22.812697396925774,
      alt: 17.577989500000001,
      pitch: -1.0,
      heading: -66.283035 + 90,
      duration: 3000,
    },
  },
  // {
  //     index: 2,
  //     value: "videofusion_3_2",
  //     // cameraInfo: {
  //     //     lng: 108.37600221666887,
  //     //     lat: 22.812697396925774,
  //     //     alt: 17.577989500000001,
  //     //     pitch: -1.000000,
  //     //     heading: -66.283035 + 90,
  //     //     duration: 3000
  //     // }
  // },
  {
    index: 3,
    label: "D区15号馆外侧楼梯",
    value: "videofusion_4",
    cameraInfo: {
      lng: 108.37572841403023,
      lat: 22.811747914637561,
      alt: 40.271496579999997,
      pitch: -10.2,
      heading: -235.354721 + 90,
      duration: 3000,
    },
  },
  {
    index: 4,
    label: "11号展厅中部通道",
    value: "videofusion_6",
    cameraInfo: {
      lng: 108.37421512999867,
      lat: 22.809107906092635,
      alt: 46.712944340000007,
      pitch: -14.8,
      heading: -450.0 + 90,
      duration: 3000,
    },
  },
  {
    index: 5,
    label: "6号展厅西",
    value: "videofusion_5",
    cameraInfo: {
      lng: 108.37510786309555,
      lat: 22.810383678597045,
      alt: 48.821948240000005,
      pitch: -12.4065,
      heading: -385.200928 + 90,
      duration: 3000,
    },
  },
];
