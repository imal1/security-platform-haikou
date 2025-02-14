import { getServerBaseUrl, Trees, tryGet } from "@/kit";
import { Message } from "@arco-design/web-react";
import { makeAutoObservable } from "mobx";
import globalState from "../../../globalState";
import storeAttr from "./attributes-store";
import {
  featureList,
  getDeviceGroup,
  getdeviceGroupList,
  getDevicesStatistical,
  getDeviceStatistical,
  getDeviceTypes,
  planList,
  updateDeviceBuildingInfo,
  updateLocation,
} from "./webapi";

const { generateListNew, getFirstChild, getParentKey } = Trees;
class Store {
  constructor() {
    makeAutoObservable(this);
  }
  viewer = null;
  actionType: string = "select";
  cTUserMngServer: string = getServerBaseUrl("CTUserMngServer");
  status: "readonly" | "editable" = "editable";

  pageType: string;

  // 是否唤起要素面板
  isAttributes: boolean = false;
  // 是否在纠偏状态
  isCorrect: boolean = false;
  //  纠偏物体经纬度位置
  correctLLA: any = { lng: 0, lat: 0, alt: 0 };
  correctCofirm: (coordinate: any) => void;
  //
  correctEleData: any = null;
  hasCorrectDetail: boolean = false;
  //xuanzhongzhi
  checkList: any[] = [];

  // 计划列表
  plans: PlanInfo[] = [];

  // 计划列表转options
  get plans2Options() {
    return this.plans.map((el) => {
      return { label: el.planName, value: el.id, enable: el.enable };
    });
  }

  // 当前选择计划
  selectedPlan: PlanInfo = null;
  getAllPlans = async (id = this.selectedPlan?.id) => {
    const res = await planList();
    this.plans = res || [];
    const currentPlan = res.find((v) => v.id === id);
    const enabledPlan = res.find((v) => v.enable === 1);
    this.selectedPlan = currentPlan || enabledPlan || res[0];
  };

  features: FeatureProps[] = [];
  selectedFeature: FeatureProps = null;
  getAllFeatures = async () => {
    const res = await featureList();
    this.features = res || [];
  };

  selectedDevice = {
    gbid: "164",
    deviceName: "卡口",
    deviceType: "zkwf7m",
  };

  selectedTreeNode = null;

  // 编辑要素绘制
  editFeature = null;

  // 新增要素绘制
  addFeatureStorage = null;

  // geometry编辑 新增对象
  geometryObj = null;

  // 设备纠偏 设备位置，计算俯视角
  geometryPosition = null;

  // 操作状态
  floatType = null;

  // 临时
  checkedKeysArr = [];

  // 固有
  checkedKeysInherentArr = [];

  isPlanSelect: boolean = true;

  geometryDataMapStore = null;

  frameUeIds = {};

  leftCollapsed = false;
  rightCollapsed = false;

  // 要素右击参数
  elementFeature = null;

  // 场景编辑 右键数据
  menuFeatureId = null;
  menuFeatureType = null;
  tempId = null;

  // 纠偏确认取消方法
  correctCancel = null;
  correctOk = null;

  // 物防技防状态区分 wf: 物防  jf: 技防
  defenseStatus: string = "";

  // 物防要素右击事件状态
  isMenu: boolean = false;
  menuPoint: { x: number; y: number } = { x: 0, y: 0 };
  toWfDetail = null;
  handleWfEditUe = null;
  handleWfCorrect = null;
  wfCorrectPoint: any = null;

  // 技防要素右击事件状态
  jfCurrent: any = { id: "", gbid: "" };
  jfCurrentCopy: any = null;
  toJfDetail = null;
  handleJfCorrect = null;
  jfCorrectPoint: any = null;
  jfGeometryDataMap: any = null;
  jfVideoVisible: boolean = false;

  //设备预览
  currentDevice: any = null;
  // 全部设备纠偏右击事件状态
  // toAllJfDetail = null;
  // handleAllJfCorrect = null;

  activeType: any = "IPC_1";
  deviceFilterParams: any = {
    withRole: false,
    deviceStatus: "0,1,2",
    tag: "",
    deviceTypes: "IPC_1",
    emptyGroupFlag: true,
    onlyDirectly: true,
    subDeviceFlag: true,
    showThreeLevelChildDevice: true,
  };
  filterTypes: any = [
    {
      label: "球机",
      value: "IPC_1",
    },
    {
      label: "枪机",
      value: "IPC_3",
    },
    {
      label: "执法记录仪",
      value: "BWC",
    },
    {
      label: "对讲机",
      value: "PTT",
    },
    {
      label: "警务通",
      value: "PAD",
    },
    {
      label: "会议终端",
      value: "MT",
    },
  ];
  deviceStatusList = [
    {
      label: "在线",
      value: "0",
      num: 118,
    },
    {
      label: "离线",
      value: "1",
      num: 18,
    },
  ];
  deviceGroupTree: any = [];
  totalStatistical: any = {};
  grounpStatistical: any = [];
  deviceCurrent: any = null;
  checkedKeys: any = [];
  // checkedKeys: any = ['32057100001127000019', '32057100001327000019'];
  // GeometryUtil = new window["KMapUE"].GeometryUtil({ viewer: this.viewer })
  rightVisible: boolean = false;
  visible: boolean = false;
  deviceTypes: any = []; //设备类型列表
  deviceTypeKeys: any = [];

  deviceStatusKeys: any = ["0"]; // 在线 离线状态参数
  deviceFilterKeys: any = ["0"];

  deviceJuhe: any = false; //聚合状态参数

  deviceStatus: string = "0";
  deviceLayerStatusKeys = ["0"];
  deviceLayerIsJuhe = false;
  deviceLayerType = "IPC_1,IPC_3,BWC,PTT,PAD";

  isView: boolean = false;
  jfInherentKeys: any = [];
  jfInherentData: any = [];
  jfTemporaryKeys: any = [];
  jfTemporaryData: any = [];
  wfInherentTreeData: any = [];
  wfTemporaryTreeData: any = [];
  buildingId: string = "";
  showKey: any = {
    inherent: [],
    temporary: [],
  };
  hideKey: any = {
    inherent: [],
    temporary: [],
  };
  firstKeys: any = [];
  devicelayerObj: any = {
    inherent: {},
    temporary: {},
  }; //设备图层
  devicelayerIds: any = {
    inherent: {},
    temporary: {},
  }; //设备图层id
  componentFrameVisible: boolean = false;
  currentFrameStyle: any = {};

  // 批量创建参数
  batchData: Array<any> = [];
  signpostBatchData: Array<any> = [];
  labelBatchData: Array<any> = [];
  areaBatchData: Array<any> = [];
  batchRemoveData: Array<any> = [];
  batchRemoveAreaData: any = { ids: [], wallIds: [], routeIds: [] };
  batchIdMap: Map<string, string> = new Map();
  batchPropertyMap: Map<string, any> = new Map();

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
        devicelayerObj: {
          inherent: {},
          temporary: {},
        },
        devicelayerIds: {
          inherent: {},
          temporary: {},
        },
        componentFrameVisible: false,
        currentFrameStyle: {},
        // handleAllJfCorrect: this.handleCorrectFunc,
        correctCancel: this.correctCancelFunc,
        correctOk: this.correctOkFunc,
        correctCofirm: this.manualCorrectFunc,
        pageType: "place_manage",
        ...params,
      });
      this.getDeviceTypes();
    } catch (error) {}
  };
  /**
   * 扁平化树数据
   * @param treeData
   * @param key
   */
  delayeringTree = (treeData, key) => {
    const data = [];
    generateListNew(treeData, data);
    this[key] = data;
  };
  getDeviceTypes = async () => {
    try {
      let res = await getDeviceTypes();
      res = res.map((item) => {
        return {
          ...item,
          value: item.typeCode,
          label: item.typeName,
        };
      });
      this.deviceTypes = res;
      console.log(this.deviceTypes);
      this.deviceTypeKeys = res.map((item) => item.value);
      this.filterTypes = res;
    } catch (error) {}
  };

  setCheckedList(arr) {
    this.checkList = arr;
  }
  traverseAndModify = async (tree) => {
    try {
      for (let index = 0; index < tree.length; index++) {
        const element = tree[index];
        // 修改当前节点
        tree[index].nodeType = "group"; // 添加或修改节点属性
        tree[index].key = tree[index].id;
        tree[index].title = tree[index].groupName;
        tree[index].statistical = this.grounpStatistical[tree[index].id];
        // 如果存在子节点，递归遍历子节点
        if (tree[index].children?.length > 0) {
          this.traverseAndModify(tree[index].children);
        } else {
          // try {
          //   const data = await this.getdeviceGroupList(tree[index].id);
          //   tree[index].children = data;
          // } catch (error) {
          //   tree[index].children = [];
          // }
        }
      }
      // tree.forEach(async (node) => {
      //   // 修改当前节点
      //   node.nodeType = "group"; // 添加或修改节点属性
      //   node.key = node.id;
      //   node.title = node.groupName;
      //   node.statistical = this.grounpStatistical[node.id];
      //   // 如果存在子节点，递归遍历子节点
      //   if (node.children) {
      //     this.traverseAndModify(node.children);
      //   } else {
      //     node.children = await this.getdeviceGroupList(node.id);
      //   }
      // });
    } catch (error) {}
  };
  //根据设备分组类型查询用户组树
  getDeviceGroup = async () => {
    try {
      const deviceTypes = this.deviceFilterParams.deviceTypes;
      const isIpc = ["IPC_1", "IPC_3"].includes(deviceTypes);
      const params = {
        ...this.deviceFilterParams,
        deviceTypes: isIpc ? "IPC" : deviceTypes,
        cameraForms: !isIpc ? "" : deviceTypes === "IPC_1" ? "1,2" : "3,4",
        subDeviceFlag: true,
        showThreeLevelChildDevice: true,
        emptyGroupFlag: true,
      };

      let res = await getDeviceGroup(params);
      this.getDeviceStatistical();
      await this.getDevicesStatistical();
      await this.traverseAndModify(res);
      const keys = await this.getFirstChild(res);
      this.deviceGroupTree = res;
      this.firstKeys = keys;
      console.log(res, "this.deviceGroupTree");
    } catch (error) {}
  };
  getFirstChild = async (array, field = "children", lastHas = true) => {
    let child = null;
    let keys = [];
    const loadMore = async (node) => {
      let data = await this.getdeviceGroupList(node.key);
      const gbids = storeAttr.devices.map((item) => item.gbid);
      data = data.map((item) => {
        const isCheck = gbids.includes(item.gbid);
        if (isCheck) {
          this.setCheckedKeys([...this.checkedKeys, item.key]);
        }
        return {
          ...item,
          // disableCheckbox: isCheck,
        };
      });
      return data;
    };
    const forFn = async (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!!node[field] && !!node[field].length) {
          keys.push(node.key);
          await forFn(node[field]);
        } else if (!child && lastHas && (!node[field] || !node[field].length)) {
          keys.push(node.key);
          const data = await loadMore(node);
          node.children = data;
          child = node;
        } else if (!child && !lastHas && !node[field]) {
          keys.push(node.key);
          const data = await loadMore(node);
          node.children = data;
          child = node;
        }
      }
    };
    await forFn(array);
    return keys;
  };
  //根据指定字段统计各分组设备数据
  getDevicesStatistical = async () => {
    try {
      const deviceTypes = this.deviceFilterParams.deviceTypes;
      const isIpc = ["IPC_1", "IPC_3"].includes(deviceTypes);
      const params = {
        ...this.deviceFilterParams,
        deviceTypes: isIpc ? "IPC" : deviceTypes,
        cameraForms: !isIpc ? "" : deviceTypes === "IPC_1" ? "1,2" : "3,4",
      };
      let res = await getDevicesStatistical(params);
      this.grounpStatistical = res;
    } catch (error) {}
  };
  //根据指定字段统计设备数据
  getDeviceStatistical = async () => {
    try {
      const deviceTypes = this.deviceFilterParams.deviceTypes;
      const isIpc = ["IPC_1", "IPC_3"].includes(deviceTypes);
      const params = {
        ...this.deviceFilterParams,
        deviceTypes: isIpc ? "IPC" : deviceTypes,
        cameraForms: !isIpc ? "" : deviceTypes === "IPC_1" ? "1,2" : "3,4",
      };
      let res = await getDeviceStatistical(params);
      console.log("res===>", res);
      this.totalStatistical = res;
    } catch (error) {}
  };
  shuttleData = () => {
    try {
      let data = [];
      generateListNew(this.deviceGroupTree, data);
      return data;
    } catch (error) {}
  };
  getdeviceGroupList = async (groupId) => {
    try {
      const deviceTypes = this.deviceFilterParams.deviceTypes;
      const isIpc = ["IPC_1", "IPC_3"].includes(deviceTypes);
      let params = {
        ...this.deviceFilterParams,
        deviceTypes: isIpc ? "IPC" : deviceTypes,
        cameraForms: !isIpc ? "" : deviceTypes === "IPC_1" ? "1,2" : "3,4",
        pageSize: 1000,
        emptyGroupFlag: true,
      };
      let res = await getdeviceGroupList(params, groupId);
      let data = res?.data?.map((item) => {
        return {
          ...item,
          title: item.deviceName,
          key: `${item.gbid}-${groupId}`,
          checkable: true,
          isLeaf: true,
          nodeType: "device",
        };
      });
      return data || [];
    } catch (error) {}
  };
  setCheckedKeys(arr) {
    console.log("arr", arr);
    this.checkedKeys = arr;
  }
  toggleLeftCollapsed() {
    this.leftCollapsed = !this.leftCollapsed;
  }
  toggleRightCollapsed(rightCollapsed?: boolean) {
    if (rightCollapsed) {
      this.rightCollapsed = !rightCollapsed;
    } else {
      this.rightCollapsed = !this.rightCollapsed;
    }
  }
  getDeviceType = (data) => {
    if (data.deviceType === "IPC") {
      const cameraForm = tryGet(data, "deviceAttr.ipc.cameraForm");
      const deviceType = ["1", "2"].includes(cameraForm) ? "IPC_1" : "IPC_3";
      return deviceType;
    } else {
      return data.deviceType;
    }
  };
  //设置设备透视
  setDevicePerspective = (val) => {
    try {
      for (const type in this.devicelayerObj) {
        const row = this.devicelayerObj[type];
        for (const key in row) {
          const item = row[key];
          if (item) {
            const renderSpace = val ? "Screen" : "World";
            item.setRenderSpace(renderSpace);
          }
        }
      }
    } catch (error) {}
  };
  //开启组件弹框
  openComponentFrame = (popFrameStyle) => {
    this.closeComponentFrame(popFrameStyle.uid);
    if (popFrameStyle?.content?.length > 0) {
      this.componentFrameVisible = true;
      this.currentFrameStyle = popFrameStyle;
    }
  };
  //关闭组件弹框
  closeComponentFrame = (id) => {
    if (!id) return;
    const { uid } = this.currentFrameStyle;
    if (id == uid) {
      this.componentFrameVisible = false;
      this.currentFrameStyle = {};
    }
  };

  // 保存室内室外
  saveIsOutDoor = (cTUserMngServer, location) => {
    // debugger
    const buildingEvent = new window["KMapUE"].BuildingEvent(this.viewer);
    const buildingInfo = buildingEvent.getInfo();
    const isOutDoor =
      !buildingInfo || (buildingInfo && buildingInfo.buildingId === "outdoor");
    const param = {
      appName: globalState.get("userInfo").userName,
      serviceName: "device_position_modify",
      esDataEntityList: location.map((i) => {
        return {
          dataId: i.id,
          appName: globalState.get("userInfo").userName,
          serviceName: "device_position_modify",
          keyValueMap: {
            // buildingId不是outdoor的话就是室内
            outdoor: isOutDoor + "",
          },
        };
      }),
    };
    updateDeviceBuildingInfo(cTUserMngServer, param);
  };

  correctOkFunc = async () => {
    if (!this.isCorrect) return;
    const transformUe = storeAttr.transformUe;
    console.log(
      this.jfGeometryDataMap,
      "geometryDataMapgeometryDataMap",
      transformUe,
    );
    if (transformUe) {
      const location = [
        {
          id: this.jfCurrent.id,
          gbid: this.jfCurrent.gbid,
          longitude: transformUe.position.lng,
          latitude: transformUe.position.lat,
          altitude: transformUe.position.alt,
        },
      ];
      console.log(this.cTUserMngServer, "cTUserMngServer");
      await updateLocation(getServerBaseUrl("CTUserMngServer"), location);
      this.saveIsOutDoor(getServerBaseUrl("CTUserMngServer"), location);

      Object.keys(storeAttr.devicelayerObj).forEach((k) => {
        // debugger
        storeAttr.devicelayerObj[k] &&
          storeAttr.devicelayerObj[k].flushDeviceLayer();
      });
    }

    Message.success("更新成功");
    localStorage.removeItem("ue-device-property");
    this.correctCancelFunc(false);
  };

  correctCancelFunc = (cancelOnly = true) => {
    if (!this.isCorrect) return;
    // setIsCorrent(false);
    this.changeState({
      isCorrect: false,
      isView: false,
      geometryPosition: null,
    });
    // setIsMenu(false);
    this.changeState({
      isMenu: false,
    });
    this.viewer.endTakePoint({
      onComplete: () => {
        this.viewer.off("take_point");
      },
    });
    storeAttr.clearGizmoControl();

    if (cancelOnly) {
      const point = localStorage.getItem("ue-device-property");
      const geometry = JSON.parse(point);
      const location = [
        {
          id: this.jfCurrent.id,
          gbid: this.jfCurrent.gbid,
          ...geometry,
        },
      ];
      console.log(this.cTUserMngServer, "cTUserMngServer");
      geometry &&
        updateLocation(getServerBaseUrl("CTUserMngServer"), location).then(
          () => {
            Object.keys(storeAttr.devicelayerObj).forEach((k) => {
              // debugger
              storeAttr.devicelayerObj[k] &&
                storeAttr.devicelayerObj[k].flushDeviceLayer();
            });
            localStorage.removeItem("ue-device-property");
            this.saveIsOutDoor(getServerBaseUrl("CTUserMngServer"), location);
          },
        );
    }
  };

  manualCorrectFunc = (coordinate: any) => {
    storeAttr.clearGizmoControl();
    const location = [
      {
        id: this.jfCurrent.id,
        gbid: this.jfCurrent.gbid,
        longitude: coordinate.lng,
        latitude: coordinate.lat,
        altitude: coordinate.alt,
      },
    ];
    updateLocation(getServerBaseUrl("CTUserMngServer"), location).then(() => {
      Object.keys(storeAttr.devicelayerObj).forEach((k) => {
        // debugger
        storeAttr.devicelayerObj[k] &&
          storeAttr.devicelayerObj[k].flushDeviceLayer();
      });
      this.saveIsOutDoor(getServerBaseUrl("CTUserMngServer"), location);
    });
    // geometryDataMap.map(layerItem => {
    //   layerItem.flushDeviceLayer()
    // });

    setTimeout(() => {
      storeAttr.openGizmoControl(true, () => {
        storeAttr.gizmoControl.attachElement({
          type: "device",
          id: this.jfCurrentCopy.gbid,
          layerId: this.jfCurrentCopy.id,
          onComplete: (res) => {},
          onError: (err) => {},
        });
        storeAttr.elementType = "device";
      });
    }, 200);
  };

  handleToDetailFunc = () => {
    this.changeState({
      isMenu: false,
      jfVideoVisible: true,
      currentDevice: this.jfCurrent,
    });
    const deviceType = this.getDeviceType(this.jfCurrent);
    const { gbid } = this.jfCurrent;
    const layer = storeAttr.devicelayerObj[deviceType];
    const layerId = storeAttr.devicelayerObj[deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };

  handleCorrectFunc = () => {
    this.changeState({
      isMenu: false,
    });
    this.changeState({
      correctCancel: this.correctCancelFunc,
      correctOk: this.correctOkFunc,
    });
    this.changeState({
      isCorrect: true,
      rightCollapsed: true,
      isView: true,
      geometryPosition: {
        lng: this.jfCurrent.longitude,
        lat: this.jfCurrent.latitude,
      },
    });
    this.viewer.startTakePoint({
      tip: "鼠标单击，重新选择设备摆放位置，esc键退出",
    });
    this.viewer.off("take_point");
    this.viewer.on("take_point", (res) => {
      const getToArr = (obj) => {
        return { position: [[obj.lng, obj.lat]], height: obj.alt + 1 };
      };
      // setCorrectPoint(res);
      this.changeState({
        jfCorrectPoint: res,
      });
      this.correctLLA = res;
      this.changeState({
        geometryPosition: res,
      });
      const Point = getToArr(res);
      console.log(res, "take_pointtake_pointv");

      const data = {
        id: this.menuFeatureId,
        iconPosition: Point,
      };
      const iconPosition = data?.iconPosition;
      const buildingEvent = new window["KMapUE"].BuildingEvent(this.viewer);
      const buildingInfo = buildingEvent.getInfo() || {
        buildingId: "outdoor",
        floor: "1",
      };
      const buildingData = {
        appName: globalState.get("userInfo").userName,
        serviceName: "device_position_modify	",
        esDataEntityList: [
          {
            dataId: this.jfCurrent.gbid,
            appName: globalState.get("userInfo").userName,
            serviceName: "device_position_modify	",
            keyValueMap: {
              buildingId: buildingInfo.buildingId,
              floor: buildingInfo.floor,
            },
          },
        ],
      };
      // updateDeviceBuildingInfo(cTUserMngServer, buildingData);
      const location = [
        {
          id: this.jfCurrent.id,
          gbid: this.jfCurrent.gbid,
          longitude: res.lng,
          latitude: res.lat,
          altitude: res.alt,
        },
      ];
      // console.log(this.cTUserMngServer, "cTUserMngServer");
      // updateLocation(cTUserMngServer, location).then(() => {
      //   Object.keys(store.jfGeometryDataMap).forEach((k) => {
      //     // debugger
      //     store.jfGeometryDataMap[k] && store.jfGeometryDataMap[k].flushDeviceLayer();
      //   });
      // });
      // this.saveIsOutDoor(getServerBaseUrl("CTUserMngServer"), location);
      // geometryDataMap.map(layerItem => {
      //   layerItem.flushDeviceLayer()
      // });

      // setTimeout(() => {
      //   storeAttr.openGizmoControl(true, () => {
      //     storeAttr.gizmoControl.attachElement({
      //       type: "device",
      //       id: store.jfCurrentCopy.gbid,
      //       layerId: store.jfCurrentCopy.id,
      //       onComplete: (res) => { },
      //       onError: (err) => { },
      //     });
      //   });
      // }, 200);
    });
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
