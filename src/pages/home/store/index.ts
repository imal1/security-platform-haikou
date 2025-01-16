import { makeAutoObservable } from "mobx";
import { Message, Modal } from "@arco-design/web-react";
import {
  getPlanId,
  getEventId,
  getVenueId,
  Trees,
  formatDate,
  tryGet,
  objectArrUnique,
  deep,
  getFeatureTreeData,
  unique,
} from "@/kit";
import * as webapi from "./webapi";
import { icons } from "@/pages/place-manage/component/ele-store/const";
import { deviceIcons } from "@/pages/constant/index";
import { codeMap } from "../../constant/index";
import { PeopleTypeEnum } from "@/pages/home/souye/people-type-enum";
import globalState from "@/globalState";
import appStore from "@/store";
const { generateListNew } = Trees;

class Store {
  constructor() {
    makeAutoObservable(this);
  }
  firstMenuList: any = {};
  childMenuList: any = [];
  leftVisible: boolean = false;
  rightVisible: boolean = false;
  // 左侧整体不可见
  leftPanelVisible: boolean = true;
  // 底部菜单整体不可见
  navPanelVisible: boolean = true;
  // 底部菜单折叠
  navPanelCollapse: boolean = false;
  viewer: any = null;
  wfStatisticsData: any = [];
  deviceAtatisticsData: any = [];
  workGroupData: any = {};
  deviceTree: any = [];
  eventId: string = "eventId"; //活动id
  venueId: string = "venueId"; //场所id
  planId: number | string = "planId"; //方案id
  icons: any = icons;
  wfInherentTree: any = [];
  wfTemporaryTree: any = [];
  wfInherentData: any = []; //物防数组
  wfTemporaryData: any = [];
  deviceInherentTree: any = [];
  deviceTemporaryTree: any = [];
  deviceInherentData: any = [];
  deviceTemporaryData: any = [];
  drawCodes: any = ["AREA", "ROUTE", "AOR", "WALL"];
  featureTypes: any = {
    AREA: "区域",
    ROUTE: "路线",
    AOR: "责任区",
    WALL: "墙",
  };
  deviceTypes: any = []; //设备类型列表
  deviceTypeKeys: any = [];
  deviceStatusKeys: any = ["0", "1", "2"];
  tab: string = "sy";
  childTab: string = "";
  devicelayerObj: any = {
    inherent: {},
    temporary: {},
  }; //设备图层
  devicelayerIds: any = {
    inherent: {},
    temporary: {},
  }; //设备图层id
  policeStatistic: any = null; //设备统计
  policeTree: any = []; //警务树
  policeData: any = [];

  policeModalVisiable: boolean = false;
  policeModalPosition: any = { x: 0, y: 0 };
  policeInfo: any = {
    deviceType: "",
    deviceName: "",
    gbid: "",
    groupId: "",
    status: 0,
    location: [],
    situation: "",
    _showName: "",
    _zrdw: "",
  };

  deviceTab: string = "";
  deviceCurrent: any = null;
  deviceVisible: boolean = false;
  activeData: any = {};
  onlyPlay: boolean = false;
  //行车路线
  isPlay: boolean = false;
  isReal: boolean = false;
  follow: boolean = false;
  geometryDataMapStore = null;
  frameUeIds = {};
  deviceFilterKeys = {};
  //组群通话
  callVisible: boolean = false;
  callTitle: string = "通话组会";
  addOrInvite: number = 0;
  selectMemberVisible: boolean = false;
  selectedMembers: Array<any> = [];
  addSelectedMemberKeys: Array<any> = [];
  featureInfoInherentVOList: Array<any> = []; //总览要素列表
  // 鹰眼地图显示
  linkMapVisible: boolean = true;
  linkMapDisable: boolean = false;
  deviceList: any;
  buildingId: string = "";
  showKey: any = {
    inherent: [],
    temporary: [],
  };
  hideKey: any = {
    inherent: [],
    temporary: [],
  };
  //二级菜单
  deviceOpen: boolean = true; //关联设备上图
  currentData: any = null;
  //三级数据
  threePageData: any = null;
  responsibilityData: any = null;
  wordGroupData: any = null;
  buildArea: any = {
    Area_A: ["1", "-1"],
    Area_B: ["1", "2"],
    Area_D: ["1", "2"],
    Area_E: ["1"],
  };
  buildList1: any = [];
  buildList2: any = [];
  currentBuild: any = [];
  currentKey: string = "1";
  floorOneList: any = [];
  floorTwoList: any = [];
  delStatus: boolean = false;
  inherentIds: string = "";
  temporaryIds: string = "";
  trackType: string = "";
  realTimetrack: any = null;
  historytrack: any = null;
  speedRate: number = 1;
  policeTypes: any = {
    警组: "JZ",
    组长: "ZZ",
    民警: "MJ",
    辅警: "FJ",
    交警: "JJ",
    武警: "WJ",
    特警: "TJ",
  };
  historyVisible: boolean = false;
  historyParams: any = null;
  trackVisible: boolean = false;
  historyTrackTimes: any = {};
  historyProgress: number = 0;
  dragEndData: any = { lastX: 0, lastY: 0 };

  componentFrameVisible: boolean = false;
  currentFrameStyle: any = {};
  location: any = null;
  frameSelectVisible: boolean = false;
  toolActive: string = "";
  deviceTreeData: any = [];
  deviceData: any = [];
  selectMemberDeviceVisible: boolean = false;
  memberType: string = "";

  homeSecurityInfoVisible: boolean = false; //首页安保信息弹窗

  homePoliceRemarkVisible: boolean = false; //首页增加/编辑警情标注弹窗
  policeRemarkRefresh: boolean = false; // 警情列表刷新处理
  policeRemarkTypeEnum: any = []; // 警情标注类型枚举
  policeRemarkStatusEnum: any = [
    {
      label: "未处理",
      value: "0",
    },
    {
      label: "处理中",
      value: "1",
    },
    {
      label: "已处理",
      value: "2",
    },
  ]; // 警情标注状态枚举
  policeRemarkStatusNameEnum: any = {
    "0": "未处理",
    "1": "处理中",
    "2": "已处理",
  }; //警情标注状态直接匹配名字枚举
  homeLeftSideActive: string = "0"; // 首页左侧的tab
  toolPoliceRemarkClickTime: string = ""; //重复点击警情标注
  policeMarkLinkFeatures: any = null;

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
  selectedPoliceRemark: any = {}; //点击选择的警情标注
  latestSavedPoliceRemark: any = {}; //最新保存的一条警情标注点数据
  homePopSecurityAreaInfo: any = []; //画出来的责任区数据
  isAllDevice: boolean = false;
  filterLayerVisible: boolean = false;
  allDeviceVisible: boolean = false;
  deviceNameVisible: boolean = false;
  filterDeviceTypeKeys: any = [];
  filterDeviceStatusKeys: any = ["0", "1", "2"];
  polymerization: boolean = false;
  isCreateLayer: boolean = false;
  zrqgroup: Array<any> = [];
  nnzrg: any = null;

  // 批量创建参数
  batchData: Array<any> = [];
  signpostBatchData: Array<any> = [];
  labelBatchData: Array<any> = [];
  areaBatchData: Array<any> = [];
  batchRemoveData: Array<any> = [];
  batchRemoveAreaData: any = { ids: [], wallIds: [], routeIds: [] };
  batchIdMap: Map<string, string> = new Map();
  batchPropertyMap: Map<string, any> = new Map();
  allDeviceData: any = [];
  allGbid: any = [];
  deviceTypesTemp: any = [];
  isMenu: boolean = false;
  menuPoint: { x: number; y: number } = { x: 0, y: 0 };
  currentDevice: any = null;
  track: boolean = false;
  /**
   *初始化数据
   *
   * @memberof Store
   */
  initialData = async (params?) => {
    try {
      console.log(icons, "icons");
      this.initialVariable(params);
      const planId = await getPlanId();
      this.planId = planId;
      this.eventId = getEventId();
      this.venueId = getVenueId();
      this.deviceActivity();
      this.getPhysicalDefenseDataStatistics();
      this.getDeviceDataStatistics();
      this.getWfTree();
      this.getDeviceTree();
      this.getDeviceTypes();
      this.getWorkGroup();
      this.workGroupStatics();
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
        leftVisible: false,
        rightVisible: false,
        wfStatisticsData: [],
        deviceAtatisticsData: [],
        tab: "sy",
        childTab: "",
        isPlay: false,
        follow: false,
        devicelayerObj: {
          inherent: {},
          temporary: {},
          xclx: {},
          police: {},
          devices: {},
          toolDevice: {},
          deviceList: {},
        },
        devicelayerIds: {
          inherent: {},
          temporary: {},
          xclx: {},
          police: {},
          devices: {},
          toolDevice: {},
          deviceList: {},
        },
        policeData: [],
        policeTree: [],
        policeStatistic: null,
        deviceTab: "",
        deviceCurrent: null,
        deviceVisible: false,
        geometryDataMapStore: {},
        frameUeIds: {},
        deviceFilterKeys: {},
        callVisible: false,
        callTitle: "",
        addOrInvite: 0,
        selectMemberVisible: false,
        selectedMembers: [],
        addSelectedMemberKeys: [],
        linkMapVisible: true,
        linkMapDisable: false,
        childMenuList: [],
        featureInfoInherentVOList: [],
        deviceList: null,
        workGroupData: {},
        onlyPlay: false,
        buildingId: "",
        deviceOpen: true,
        currentData: { id: 1000 },
        threePageData: null,
        responsibilityData: [],
        buildList1: [],
        buildList2: [],
        currentBuild: [],
        currentKey: "1",
        floorOneList: [],
        floorTwoList: [],
        delStatus: false,
        inherentIds: "",
        temporaryIds: "",
        trackType: "",
        realTimetrack: null,
        historytrack: null,
        speedRate: 1,
        historyVisible: false,
        historyParams: null,
        trackVisible: false,
        policeModalVisiable: false,
        componentFrameVisible: false,
        currentFrameStyle: {},
        location: null,
        frameSelectVisible: false,
        deviceTreeData: [],
        deviceData: [],
        selectMemberDeviceVisible: false,
        memberType: "",
        homeSecurityInfoVisible: false,
        homePoliceRemarkVisible: false,
        selectedPoliceRemark: {}, // 当前选中的警情标注
        latestSavedPoliceRemark: {}, //最新保存的警情标注点数据
        homePopSecurityAreaInfo: [],
        toolPoliceRemarkClickTime: "", //当前点击警情标注按钮
        filterLayerVisible: false,
        allDeviceVisible: false,
        deviceNameVisible: false,
        polymerization: false,
        isCreateLayer: false,
        filterDeviceStatusKeys: ["0", "1", "2"],
        zrqgroup: [],
        nnzrg: null,
        navPanelVisible: true,
        track: false,
        ...params,
      });
    } catch (error) {}
  };
  deviceActivity = async () => {
    try {
      let res = await webapi.deviceActivity(
        this.eventId === "eventId" ? 90 : this.eventId
      );
      this.activeData = res[0] || {};
    } catch (error) {}
  };
  setDeviceVisible = (value) => {
    this.deviceVisible = value;
  };
  //物防数据统计
  getPhysicalDefenseDataStatistics = async () => {
    try {
      const res = await webapi.getPhysicalDefenseDataStatistics(
        this.eventId,
        this.venueId
      );
      this.wfStatisticsData = res.sort((a, b) => b.count - a.count);
    } catch (error) {}
  };
  //设备统计
  getDeviceDataStatistics = async () => {
    try {
      const res = await webapi.getDeviceDataStatistics(
        this.eventId,
        this.venueId
      );
      this.deviceAtatisticsData = res;
    } catch (error) {}
  };
  //获取物防树
  getWfTree = () => {
    try {
      const promiseList: any = Promise.all([
        webapi.getInherentTree(this.venueId),
        webapi.getTemporaryTree(this.planId),
      ]);
      return promiseList.then((resultList) => {
        const [inherentTree, temporaryTree] = resultList;
        this.wfInherentTree = [
          {
            featureName: "固有资源",
            id: "-1",
            children: getFeatureTreeData(inherentTree),
          },
        ];
        this.wfTemporaryTree = [
          {
            featureName: "临时资源",
            id: "-1",
            children: getFeatureTreeData(temporaryTree),
          },
        ];
        const wfInherentData = [];
        generateListNew(this.wfInherentTree, wfInherentData);
        this.wfInherentData = wfInherentData;
        const wfTemporaryData = [];
        generateListNew(this.wfTemporaryTree, wfTemporaryData);
        this.wfTemporaryData = wfTemporaryData;
      });
    } catch (error) {}
  };
  //获取设备树
  getDeviceTree = () => {
    try {
      let params = {
        deviceTypes: this.deviceTypeKeys.join(),
        status: this.deviceStatusKeys.join(),
      };
      const promiseList: any = Promise.all([
        webapi.getInherentTreeWithDevices(this.venueId, params),
        webapi.getTemporaryTreeWithDevices(this.planId, params),
      ]);
      return promiseList.then((resultList) => {
        let [inherentTree, temporaryTree] = resultList;
        inherentTree = getFeatureTreeData(inherentTree);
        temporaryTree = getFeatureTreeData(temporaryTree);
        this.handleDeviceTree(inherentTree);
        this.handleDeviceTree(temporaryTree, "temporary");
        this.deviceInherentTree = [
          {
            featureName: "固有资源",
            id: "inherent",
            children: inherentTree,
          },
          {
            featureName: "临时资源",
            id: "temporary",
            children: temporaryTree,
          },
        ];
        // this.deviceTemporaryTree = [
        //   {
        //     featureName: "临时资源",
        //     id: "temporary",
        //     children: temporaryTree,
        //   },
        // ];
        const deviceInherentData = [];
        generateListNew(this.deviceInherentTree, deviceInherentData);
        this.deviceInherentData = deviceInherentData;
        // const deviceTemporaryData = [];
        // generateListNew(this.deviceTemporaryTree, deviceTemporaryData);
        // this.deviceTemporaryData = deviceTemporaryData;
      });
    } catch (error) {}
  };
  /**
   * 获取场景相机位置
   */
  getCameraInfo() {
    this.viewer &&
      this.viewer.getCameraInfo().then((info: any) => {
        console.log("===========getCameraInfo==============", info);
        const { lng, lat, alt, pitch, heading } = info;
        this.viewer.flyTo({
          lng: 108.38212208192343,
          lat: 22.82029211406505,
          alt: 66.1891401,
          pitch: 0,
          heading: 206.64529418945312,
        });
      });
  }
  getDeviceTypes = async () => {
    try {
      let res = await webapi.getDeviceTypes();
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
      this.filterDeviceTypeKeys = this.deviceTypeKeys;
      this.deviceTypesTemp = deep(this.deviceTypeKeys);
    } catch (error) {}
  };
  handleDeviceTree = (data, type = "inherent") => {
    data.map((node, index) => {
      node.type = type;
      if (node.children?.length) {
        node.id = `${node.id}-${type}`;
        this.handleDeviceTree(node.children, type);
      } else {
        if (node.devices) {
          node.children = [
            ...objectArrUnique(node.devices, "gbid").map((item) => {
              return {
                ...item,
                id: `${item.gbid}-${node.id}-${type}`,
                featureName: item.deviceName,
                isLeaf: true,
              };
            }),
          ];
        }
      }
    });
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
  //删除设备图层
  removeDeviceLayer = (type = "inherent") => {
    for (const key in this.devicelayerObj[type]) {
      const item = this.devicelayerObj[type][key];
      if (item) {
        item.off("click");
        item.remove();
        this.devicelayerObj[type][key] = null;
        this.devicelayerIds[type][key] = null;
      }
    }
  };

  removeDeviceLayerByKey = (key: string, type = "inherent") => {
    const item = this.devicelayerObj[type][key];
    if (item) {
      item.off("dblclick");
      item.remove();
      this.devicelayerObj[type][key] = null;
      this.devicelayerIds[type][key] = null;
    }
  };
  //添加设备图层
  addDeviceLayer = async (keys = [], data = [], type = "inherent") => {
    let polymerization = false;
    let deviceTypes = deep(this.deviceTypesTemp);
    let deviceStatusKeys = ["0", "1", "2"];
    const isFilter = ["devices", "toolDevice", "deviceList"].includes(type);
    if (isFilter) {
      deviceStatusKeys = deep(this.filterDeviceStatusKeys);
      polymerization = this.polymerization;
      deviceTypes = this.filterDeviceTypeKeys;
    }
    if (this.isCreateLayer) {
      this.removeDeviceLayer(type);
      setTimeout(() => {
        this.isCreateLayer = false;
      }, 600);
    }
    if (deviceTypes.length == 0 || deviceStatusKeys.length == 0) {
      this.removeDeviceLayer(type);
      return;
    }
    // this.removeDeviceLayer(type);
    const viewer = this.viewer;
    keys = keys.map((item) => (item ? String(item).split("-")[0] : item));
    // const { deviceStatusKeys, clustered, deviceTypeKeys } =
    //   this.deviceFilterKeys;
    const getGbids = (deviceType) => {
      // 警员
      if (deviceType === "police") {
        return data
          .filter((item) => {
            return keys.includes(item._gbid);
          })
          .map((item) => {
            return item._gbid;
          });
      }

      if (type === "police") {
        return [];
      }
      // 设备
      const gbids = data
        .filter(
          (item) =>
            this.getDeviceType(item) === deviceType && keys.includes(item.gbid)
        )
        .map((item) => item.gbid);
      return unique(gbids);
    };
    const filterTerms =
      type == "police"
        ? {
            police: [
              {
                column: "gbid",
                value: getGbids("police"),
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "status",
                value: deviceStatusKeys.map((item) => Number(item)),
                termType: "in",
                filterType: 1,
                type: "and",
              },
            ],
          }
        : {
            IPC_1: [
              {
                column: "deviceType",
                value: ["IPC"],
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "deviceAttr.ipc.cameraForm",
                value: ["1", "2"],
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "gbid",
                value: getGbids("IPC_1"),
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "status",
                value: deviceStatusKeys.map((item) => Number(item)),
                termType: "in",
                filterType: 1,
                type: "and",
              },
            ],
            IPC_3: [
              {
                column: "deviceType",
                value: ["IPC"],
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "deviceAttr.ipc.cameraForm",
                value: ["3", "4"],
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "gbid",
                value: getGbids("IPC_3"),
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "status",
                value: deviceStatusKeys.map((item) => Number(item)),
                termType: "in",
                filterType: 1,
                type: "and",
              },
            ],
            BWC: [
              {
                column: "deviceType",
                value: ["BWC"],
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "gbid",
                value: getGbids("BWC"),
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "status",
                value: deviceStatusKeys.map((item) => Number(item)),
                termType: "in",
                filterType: 1,
                type: "and",
              },
            ],
            PTT: [
              {
                column: "deviceType",
                value: ["PTT"],
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "gbid",
                value: getGbids("PTT"),
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "status",
                value: deviceStatusKeys.map((item) => Number(item)),
                termType: "in",
                filterType: 1,
                type: "and",
              },
            ],
            PAD: [
              {
                column: "deviceType",
                value: ["PAD"],
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "gbid",
                value: getGbids("PAD"),
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "status",
                value: deviceStatusKeys.map((item) => Number(item)),
                termType: "in",
                filterType: 1,
                type: "and",
              },
            ],
            MT: [
              {
                column: "deviceType",
                value: ["MT"],
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "gbid",
                value: getGbids("MT"),
                termType: "in",
                filterType: 1,
                type: "and",
              },
              {
                column: "status",
                value: deviceStatusKeys.map((item) => Number(item)),
                termType: "in",
                filterType: 1,
                type: "and",
              },
            ],
          };

    Object.keys(filterTerms).forEach((k) => {
      if (
        (getGbids(k).length > 0 || type == "devices") &&
        (deviceTypes.includes(k) || k == "police")
      ) {
        if (this.devicelayerObj[type][k]) {
          this.devicelayerObj[type][k].filter({ filterTerms: filterTerms[k] });
        } else {
          const options = {
            // labelField: type == "police" ? "private_mainDeptName" : "name",
            labelField: "name",
            icons: deviceIcons[k],
            iconGroup: type == "police" ? "Person" : "Device",
            filterTerms: filterTerms[k],
            isCluster: polymerization,
            deviceLabelMode: this.deviceNameVisible ? "None" : "hover",
            range: 1000,
            compressionZoom: globalState.get("compressionZoom") || 17,
            location: globalState.get("location"),
            datasetName: ["device_position_modify"],
            renderSpace: appStore.devicePerspectiveVisible ? "Screen" : "World",
            worldSpaceScale: appStore.ueConfig?.worldSpaceScale, //世界空间缩放比例，默认30
            worldSpaceIndoorScale: appStore.ueConfig?.worldSpaceIndoorScale, //世界空间室内缩放比例，默认10
            cameraBuffer: appStore.ueConfig?.cameraBuffer, //相机缓冲区域查询条件
            onComplete: (res) => {
              console.log("=======onComplete===========", res);
              this.devicelayerIds[type][k] = res;
            },
            onError: (err) => {
              console.error("=======onError===========", err);
            },
          };
          try {
            const devicelayer = new window["KMapUE"].DeviceLayer({
              viewer,
              options,
            });
            this.devicelayerObj[type][k] = devicelayer;
            setTimeout(() => {
              devicelayer.on("dblclick", async (res) => {
                const properties = tryGet(res.data, "payload.properties");
                if (type == "police") {
                  // 过滤聚合点位
                  if (properties.gbid) {
                    // 去前端数据可能不一致
                    // 标记是否查找到，没查找到不显示
                    if (this.trackType) {
                      return;
                    }
                    let hasProperties = false;
                    this.trackType = "";
                    for (
                      let index = 0;
                      index < this.policeData.length;
                      index++
                    ) {
                      if (this.policeData[index].gbid === properties.gbid) {
                        const item: any = this.policeData[index];
                        item.picUrl = await this.userProfile(item.name);
                        this.policeInfo = item;
                        hasProperties = true;
                        break;
                      }
                    }
                    if (hasProperties) {
                      this.policeModalPosition = {
                        x: res?.screenPosition?.x || 0,
                        y: res?.screenPosition?.y || 0,
                      };
                      this.policeModalVisiable = false;
                      setTimeout(() => {
                        this.policeModalVisiable = true;
                      }, 300);
                    }
                  }
                } else {
                  properties.deviceName =
                    properties.deviceName || properties.name;
                  this.deviceTab = type;
                  this.deviceCurrent = { ...properties, layerType: type };
                  setTimeout(() => {
                    this.deviceVisible = true;
                  }, 500);
                }
                devicelayer.select({
                  layerId: res.data.layerId,
                  gbid: properties.gbid,
                });
              });
              devicelayer.on("contextmenu", (res) => {
                if (type == "police") return;
                // if (["BWC", "PTT", "PAD"].includes(k)) return;
                console.log(res, "contextmenucontextmenucontextmenu");
                // setIsMenu(true);

                const properties = tryGet(res.data, "payload.properties");
                this.changeState({
                  isMenu: true,
                  currentDevice: properties,
                  menuPoint: res.screenPosition,
                });
              });
            }, 1000);
          } catch (error) {}
        }
      } else {
        this.removeDeviceLayerByKey(k, type);
      }
    });
  };
  /**
   * 图层图标选中
   * @param layerType
   * @param deviceType
   * @param gbid
   */
  layerSelect = (layerType, deviceType, gbid = "") => {
    try {
      const layer = this.devicelayerObj[layerType][deviceType];
      const layerId = this.devicelayerIds[layerType][deviceType];
      if (layer && layerId) {
        layer.select({
          layerId,
          gbid: gbid,
        });
      }
    } catch (error) {}
  };
  getWorkGroup = async (groupIds?) => {
    try {
      let res = await webapi.getWorkGroup(
        this.eventId === "eventId" ? 90 : this.eventId,
        { groupIds }
      );
      const { statistic, dept } = res;
      this.policeStatistic = statistic || {};
      this.handlePoliceTree(dept);
      // this.handlePoliceTree(dept);
      this.policeTree = dept;
      const policeData = [];
      generateListNew(this.policeTree, policeData);
      this.policeData = policeData;
    } catch (error) {}
  };
  handlePoliceTree = (data) => {
    // 提取人员警种
    const parsePoliceTypeByOrgCode = (orgCode) => {
      if (/^45010043/.test(orgCode)) {
        return "交警";
      }
      if (/^45010050/.test(orgCode)) {
        return "特巡警";
      }
      return "民警";
    };

    try {
      data.map((node, index) => {
        // 列表显示名称
        node.name = node.name || node.groupName;
        node._showName = node.name;
        // 人员类型
        if (node._peopleType === undefined) {
          node._peopleType = PeopleTypeEnum.None;
        }

        if (node.children?.length) {
          if (!node.parentId) {
            node.key = node.id;
            node.title = node.name;
          }
          if (node.workGroupDTOS) {
            node.children = [
              ...node.workGroupDTOS.map((item) => {
                return {
                  ...item,
                  id: item.id,
                  key: item.id,
                  name: item.groupName,
                  title: item.groupName,
                  // 列表显示名称
                  _showName: item.groupName,
                  _zrdw: node.name,
                  // 人员类型：警组
                  _peopleType: PeopleTypeEnum.Group,
                };
              }),
              ...node.children,
            ];
            // this.handlePoliceTree(node.children);
          }
          this.handlePoliceTree(node.children);
        } else {
          node.key = node.id;
          node.title = node.name;
          if (node.workGroupDTOS) {
            node.children = [
              ...node.children,
              ...node.workGroupDTOS.map((item) => {
                return {
                  ...item,
                  id: item.id,
                  key: item.id,
                  name: item.groupName,
                  title: item.groupName,
                  // 列表显示名称
                  _showName: item.groupName,
                  _zrdw: node.name,
                  // 人员类型：警组
                  _peopleType: PeopleTypeEnum.Group,
                };
              }),
            ];
            this.handlePoliceTree(node.children);
          }

          if (node.memberList) {
            node.children = node.children || [];
            node.memberList.forEach((item, index) => {
              // 判断是否是组长
              const isGroupLeader = node.groupLeaderName === item.name;

              // 警种
              const policeType = parsePoliceTypeByOrgCode(node.orgCode);
              const element = {
                ...item,
                id: `${item.gbid}-${node.id}-${index}`,
                key: `${item.gbid}-${node.id}-${index}`,
                name: item.name,
                title: item.name,
                isLeaf: true,
                // deviceType: "BWC",
                disableCheckbox: item.status != 0,
                // 列表显示名称
                _showName: item.name,
                // 列表显示的标签文本
                _showTagName: isGroupLeader ? "组长" : policeType,
                // 是否是组长
                _isGroupLeader: isGroupLeader,
                // 设备类型
                _deviceType: item.deviceType,
                // 设备 gbid
                _gbid: item.gbid,
                // 标识人员
                _isMember: true,
                // 责任单位？
                _zrdw: node._zrdw,
                // 人员类型：组长 / 警员
                _peopleType: isGroupLeader
                  ? PeopleTypeEnum.GroupLeader
                  : PeopleTypeEnum.GroupMember,
                type: "memberList",
              };

              if (isGroupLeader) {
                node.children.unshift(element);
              } else {
                node.children.push(element);
              }
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  getFirstMenu = async () => {
    try {
      const res = await webapi.getFirstMenu();
      this.firstMenuList = res;
    } catch (error) {}
  };
  getChildMenu = async (code) => {
    const res = await webapi.getSecondMenu(code, this.planId);
    this.featureInfoInherentVOList = res?.featureInfoInherentVOList || [];
    this.childMenuList = Object.entries(res?.secondMenuMap || {}).map(
      ([key, value]) => {
        return { label: value, value: key };
      }
    );
  };
  //删除所有要素
  removeAllFeature = () => {
    try {
      const { viewer } = this;
      if (viewer) {
        this.delStatus = true;
        try {
          const geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });
          geometryUtil.removeAll();
        } catch (error) {}
        try {
          const element = new window["KMapUE"].SecurityElementBatch({
            viewer,
          });
          element.removeAll();
        } catch (error) {}
        try {
          const SIGNPOST = new window["KMapUE"].RoadLabelBatch({
            viewer,
          });
          SIGNPOST.removeAll();
        } catch (error) {}
        try {
          const TEXT = new window["KMapUE"].LabelBatch({
            viewer,
          });
          TEXT.removeAll();
        } catch (error) {}
        try {
          this.closeComponentFrame(this.currentFrameStyle?.uid);
        } catch (error) {}
        try {
          this.destroyAllNnzrg();
        } catch (error) {}
        this.geometryDataMapStore = {};
      }
    } catch (error) {
      console.log(error);
    }
  };
  //物防上图
  featureDiagram = (data = [], checked = true, callback?) => {
    try {
      // this.destroyAllNnzrg();
      this.delStatus = false;
      const { viewer } = this;
      this.batchData = [];
      this.signpostBatchData = [];
      this.labelBatchData = [];
      this.areaBatchData = [];
      this.batchRemoveData = [];
      this.batchRemoveAreaData = { ids: [], wallIds: [], routeIds: [] };
      this.batchIdMap = new Map();
      this.batchPropertyMap = new Map();

      const zrqgroup = data
        .filter((item) => item.sceneId)
        .map((row) => {
          const featureStyle = JSON.parse(row.featureStyle || "{}");
          return {
            id: row.sceneId,
            color: featureStyle.fillColor,
            uid: row.type + row.id,
          };
        });
      if (checked) {
        this.addNnzrg(zrqgroup);
      } else {
        const removeZrqId: Array<any> = [];
        zrqgroup.length &&
          zrqgroup.map((item) => {
            removeZrqId.push(item.id);
          });
        this.removeNnzrg(removeZrqId.join());
      }

      data
        .filter((item) => item.featureCode)
        .forEach((item) => {
          const {
            id,
            featureType,
            featureCode,
            featureName,
            aliasName,
            showName = false,
            type,
            sceneId,
          } = item;
          if (this.delStatus) return;
          const uid = type + id;
          if (
            (this.geometryDataMapStore[uid] && checked) ||
            (!this.geometryDataMapStore[uid] && !checked)
          ) {
            return;
          }
          // redrawData 回显对象  场地是几何信息 其他的是id
          const redrawData = item.geometry || "{}";

          const featureStyle = JSON.parse(item.featureStyle || "{}");
          const iconPosition = JSON.parse(item.iconPosition || "{}");
          const textParams = {
            featureName,
            ...featureStyle,
          };
          try {
            // 区域上图和隐藏
            if (featureType === "SITE_DRAWING") {
              const redrawData = JSON.parse(item.geometry || "{}");

              try {
                const geometryStyle: any = {};
                featureStyle &&
                  featureStyle.fillColor &&
                  (geometryStyle.fillColor = sceneId
                    ? "#00000000"
                    : featureStyle.fillColor);
                featureStyle &&
                  featureStyle.outlineColor &&
                  (geometryStyle.outlineColor = sceneId
                    ? "#00000000"
                    : featureStyle.outlineColor);
                featureStyle &&
                  featureStyle.outlineWidth &&
                  (geometryStyle.outlineWidth = featureStyle.outlineWidth);
                redrawData.Style = geometryStyle;
                if (featureCode === "WALL") {
                  const closureStyle: any = {};
                  closureStyle.type = "2";
                  featureStyle &&
                    featureStyle.scale &&
                    (closureStyle.scale = featureStyle.scale);
                  featureStyle &&
                    featureStyle.brightness &&
                    (closureStyle.brightness = featureStyle.brightness);
                  featureStyle &&
                    featureStyle.fillColor &&
                    (closureStyle.fillColor = featureStyle.fillColor);
                  redrawData.closureStyle = closureStyle;
                }
                if (featureCode === "ROUTE") {
                  const routeStyle: any = {};
                  featureStyle &&
                    featureStyle.routeColor &&
                    (routeStyle.routeColor = featureStyle.routeColor);
                  featureStyle &&
                    featureStyle.routeWidth &&
                    (routeStyle.routeWidth = featureStyle.routeWidth);
                  featureStyle &&
                    featureStyle.opacity &&
                    (routeStyle.routeOpacity = featureStyle.opacity / 100);
                  redrawData.routeStyle = routeStyle;
                }

                // 区域回显
                if (checked) {
                  redrawData.Id && this.areaBatchData.push(redrawData);
                  this.batchIdMap.set(redrawData.Id, uid);
                  this.batchPropertyMap.set(redrawData.Id, {
                    showName,
                    textParams,
                    type,
                  });
                } else {
                  const geometryUtil = new window["KMapUE"].GeometryUtil({
                    viewer: this.viewer,
                  });
                  this.closeComponentFrame(uid);
                  this.setFeatureNameShowHide(
                    this.geometryDataMapStore[uid],
                    false
                  );
                  if (featureCode === "WALL") {
                    console.log("redrawData", redrawData);
                    // store.batchRemoveAreaData.ids.push(redrawData?.Id);
                    // store.batchRemoveAreaData.wallIds.push(redrawData?.wallId);
                    geometryUtil.remove({
                      ids: [redrawData?.Id],
                      wallIds: [redrawData?.wallId],
                    });
                  } else if (featureCode === "ROUTE") {
                    // store.batchRemoveAreaData.ids.push(redrawData?.Id);
                    // store.batchRemoveAreaData.routeIds.push(redrawData?.routeId);
                    geometryUtil.remove({
                      ids: [redrawData?.Id],
                      routeIds: [redrawData?.routeId],
                    });
                  } else {
                    // debugger
                    // redrawData?.Id && store.batchRemoveAreaData.ids.push(redrawData?.Id);
                    redrawData?.Id &&
                      geometryUtil.remove({ ids: [redrawData?.Id] });
                  }
                  this.geometryDataMapStore = {
                    ...this.geometryDataMapStore,
                    [uid]: null,
                  };
                }
              } catch (error) {}
            }
          } catch (error) {}

          try {
            // WuFang 上图
            if (checked && featureType === "PHYSICAL_DEFENSE") {
              const { showModel, position, iconPosition } = item;
              const modelStyle = JSON.parse(item.modelStyle || "{}");
              this.batchIdMap.set(redrawData, uid);
              this.batchPropertyMap.set(redrawData, { type });
              this.batchData.push({
                id: redrawData,
                featureStyle,
                color: codeMap[featureCode],
                height: JSON.parse(iconPosition).height,
                scale: featureStyle.scale,
                modelScale: modelStyle.modelScale,
                modelAltitude: modelStyle.modelAltitude,
                modelPosition: position
                  ? JSON.parse(position)
                  : JSON.parse(iconPosition).position,
                type: showModel ? "model" : "icon",
                elementType: featureCode,
                modelWidth: modelStyle.modelWidth,
                modelHeight: modelStyle.modelHeight,
                rotation: modelStyle.rotation,
                position: JSON.parse(iconPosition).position,
                name: featureName,
                nameShow: showName,
                nameAnchor: featureStyle.fontAnchor,
                fontColor: featureStyle.fontColor,
                fontSize: featureStyle.fontSize,
              });
            } else if (!checked && featureType === "PHYSICAL_DEFENSE") {
              this.batchRemoveData.push(redrawData);
              this.batchIdMap.set(redrawData, uid);
            }
          } catch (error) {}
          try {
            // 设施 上图
            if (checked && featureType === "VENUE_FACILITY") {
              // 文本
              this.batchPropertyMap.set(redrawData, { type });
              if (featureCode === "TEXT") {
                const fontStyle: any = {};
                featureStyle &&
                  featureStyle.fontColor &&
                  (fontStyle.fontColor = featureStyle.fontColor);
                featureStyle &&
                  featureStyle.fontSize &&
                  (fontStyle.fontSize = featureStyle.fontSize);
                featureStyle &&
                  featureStyle.backgroundColor &&
                  (fontStyle.backgroundColor = featureStyle.backgroundColor);

                this.batchIdMap.set(redrawData, uid);
                this.labelBatchData.push({
                  id: redrawData,
                  text: featureName,
                  color: codeMap[featureCode],
                  position: this.exchangePosition(iconPosition, true),
                  style: fontStyle,
                });
              } else if (featureCode === "SIGNPOST") {
                console.log(
                  iconPosition,
                  redrawData,
                  "iconPos666itioniconPosition"
                );
                this.batchIdMap.set(redrawData, uid);
                this.signpostBatchData.push({
                  id: redrawData,
                  text: aliasName,
                  position: this.exchangePosition(iconPosition),
                });
              } else {
                const { showModel, position, iconPosition } = item;
                this.batchIdMap.set(redrawData, uid);
                this.batchData.push({
                  id: redrawData,
                  height: JSON.parse(iconPosition).height,
                  type: "icon",
                  scale: featureStyle.scale,
                  elementType: featureCode,
                  position: showModel
                    ? JSON.parse(position)
                    : JSON.parse(iconPosition).position,
                  color: codeMap[featureCode],
                  name: featureName,
                  nameShow: showName,
                  nameAnchor: featureStyle.fontAnchor,
                  fontColor: featureStyle.fontColor,
                  fontSize: featureStyle.fontSize,
                });
              }
            } else if (!checked && featureType === "VENUE_FACILITY") {
              if (featureCode === "TEXT") {
                const TEXT = new window["KMapUE"].LabelBatch({
                  viewer: this.viewer,
                });
                redrawData && TEXT.removeById(redrawData);
                this.geometryDataMapStore?.[uid].remove &&
                  this.geometryDataMapStore?.[uid]?.remove();
                this.geometryDataMapStore = {
                  ...this.geometryDataMapStore,
                  [uid]: null,
                };
                this.closeComponentFrame(uid);
              }
              if (featureCode === "SIGNPOST") {
                const SIGNPOST = new window["KMapUE"].RoadLabelBatch({
                  viewer: this.viewer,
                });
                redrawData && SIGNPOST.removeById(redrawData);
                this.geometryDataMapStore = {
                  ...this.geometryDataMapStore,
                  [uid]: null,
                };
                this.closeComponentFrame(uid);
              } else {
                this.batchRemoveData.push(redrawData);
                this.batchIdMap.set(redrawData, uid);
              }
            }
          } catch (error) {}
        });
      try {
        const geometryUtil = new window["KMapUE"].GeometryUtil({
          viewer: this.viewer,
        });
        this.areaBatchData?.length > 0 &&
          geometryUtil.redraw(
            {
              data: this.areaBatchData,
              onComplete: (areaMap: any) => {
                console.warn("areaMap", areaMap, areaMap.size);

                areaMap.forEach((item: any, index: string) => {
                  console.log(
                    "areaMap foreach: ",
                    item,
                    index,
                    this.batchIdMap.get(index)
                  );

                  this.geometryDataMapStore = {
                    ...this.geometryDataMapStore,
                    [this.batchIdMap.get(index)]: item,
                  };
                  this.setFeatureNameShowHide(
                    item,
                    this.batchPropertyMap.get(index).showName,
                    this.batchPropertyMap.get(index).textParams
                  );
                  item?.on("click", (v) =>
                    this.areaFeatureEvent(
                      v,
                      this.batchPropertyMap.get(index).type
                    )
                  );
                });
              },
            },
            this.viewer
          );

        if (this.batchRemoveAreaData?.ids.length > 0) {
          geometryUtil.remove({
            ...this.batchRemoveAreaData,
          });
          this.batchRemoveAreaData?.ids.forEach((item: string) => {
            this.closeComponentFrame(this.batchIdMap.get(item));
            this.setFeatureNameShowHide(
              this.geometryDataMapStore[this.batchIdMap.get(item)],
              false
            );
            this.geometryDataMapStore = {
              ...this.geometryDataMapStore,
              [this.batchIdMap.get(item)]: null,
            };
          });
        }

        const elementBatch = new window["KMapUE"].SecurityElementBatch({
          viewer: this.viewer,
        });
        // debugger
        elementBatch.add({
          options: this.batchData,
          onComplete: (elementMap: any) => {
            console.log("elementMap: ", elementMap);
            elementMap.forEach((element, key) => {
              this.geometryDataMapStore = {
                ...this.geometryDataMapStore,
                [this.batchIdMap.get(key)]: element,
              };
              setTimeout(() => {
                element.on("click", (v) =>
                  this.featureEvent(v, this.batchPropertyMap.get(key).type)
                );
              }, 200);
            });
          },
        });

        if (this.batchRemoveData.length > 0) {
          elementBatch.removeIds(this.batchRemoveData);
          this.batchRemoveData.forEach((item: string) => {
            this.geometryDataMapStore = {
              ...this.geometryDataMapStore,
              [this.batchIdMap.get(item)]: null,
            };

            this.closeComponentFrame(this.batchIdMap.get(item));
          });
        }

        const signBatch = new window["KMapUE"].RoadLabelBatch({
          viewer: this.viewer,
        });
        signBatch.add({
          options: this.signpostBatchData,
          onComplete: (signMap: any) => {
            console.log("signMap: ", signMap);
            signMap.forEach((element, key) => {
              this.geometryDataMapStore = {
                ...this.geometryDataMapStore,
                [this.batchIdMap.get(key)]: element,
              };
              setTimeout(() => {
                element.on("click", (v) =>
                  this.featureEvent(v, this.batchPropertyMap.get(key).type)
                );
              }, 200);
            });
          },
        });

        const labelBatch = new window["KMapUE"].LabelBatch({
          viewer: this.viewer,
        });
        labelBatch.add({
          options: this.labelBatchData,
          onComplete: (labelMap: any) => {
            console.log("labelMap: ", labelMap);
            labelMap.forEach((element, key) => {
              this.geometryDataMapStore = {
                ...this.geometryDataMapStore,
                [this.batchIdMap.get(key)]: element,
              };

              setTimeout(() => {
                element.on("click", (v) =>
                  this.featureEvent(v, this.batchPropertyMap.get(key).type)
                );
              }, 200);
            });
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  areaFeatureEvent = (v, type, callback?) => {
    const obj = {};
    callback && callback(v);
    if (this.geometryDataMapStore) {
      for (const key in this.geometryDataMapStore) {
        const item = this.geometryDataMapStore[key];
        if (v.type == "encloure") {
          obj[key] = item && item.getData().wallId;
        } else if (v.type == "route") {
          obj[key] = item && item.getData().routeId;
        } else {
          obj[key] = item && item.getData().Id;
        }
      }
      const getKeyByValue = (obj, v) => {
        const keys = Object.keys(obj);
        const key = keys.find((key) => obj[key] === v.id);
        return key || null;
      };

      const res = getKeyByValue(obj, v);
      if (!res) return;
      const tempId = res;
      const acce =
        type === "inherent"
          ? res?.substring(8, res.length)
          : res?.substring(9, res.length);
      const getFunction =
        type === "inherent"
          ? webapi.getInherentFeatureDetail
          : webapi.getTemporaryFeatureDetail;
      console.log(acce, "obj, vobj, vobj, v");
      getFunction(acce).then((res) => {
        console.log(res, "res");
        const { switchAnimation, visualAngle } = res;
        if (switchAnimation && visualAngle) {
          const duration =
            JSON.parse(switchAnimation).animationType != "0"
              ? JSON.parse(switchAnimation).animationTime * 1000
              : 0;
          const rotation = JSON.parse(visualAngle).rotation;
          this.viewer.flyTo({ ...rotation, duration });
        }
        if (res.popFrameStyle) {
          const popFrameStyle = res?.popFrameStyle;
          const content = res?.popFrameStyle?.content
            ? JSON.parse(res?.popFrameStyle?.content)
            : [];
          if (popFrameStyle?.gizmoStatus == "true") {
            popFrameStyle.content = content;
            this.openComponentFrame({
              uid: type + res.id,
              ...popFrameStyle,
            });
          }
        }
      });
    }
  };
  featureEvent = (v, type, callback?) => {
    const obj = {};
    callback && callback(v);
    if (this.geometryDataMapStore) {
      for (const key in this.geometryDataMapStore) {
        const item = this.geometryDataMapStore[key];
        if (item) {
          obj[key] = item.getData ? item.getData().id : "";
        }
      }
      const getKeyByValue = (obj, v) => {
        const keys = Object.keys(obj);
        const key = keys.find((key) => obj[key] === v.id);
        return key || null;
      };

      const res = getKeyByValue(obj, v);
      if (!res) return;
      const tempId = res;
      const acce =
        type === "inherent"
          ? res?.substring(8, res.length)
          : res?.substring(9, res.length);
      const getFunction =
        type === "inherent"
          ? webapi.getInherentFeatureDetail
          : webapi.getTemporaryFeatureDetail;
      console.log(acce, "obj, vobj, vobj, v");
      getFunction(acce).then((res) => {
        console.log(res, "res");
        const { switchAnimation, visualAngle } = res;
        if (switchAnimation && visualAngle) {
          const duration =
            JSON.parse(switchAnimation).animationType != "0"
              ? JSON.parse(switchAnimation).animationTime * 1000
              : 0;
          const rotation = JSON.parse(visualAngle).rotation;
          this.viewer.flyTo({ ...rotation, duration });
        }
        if (res.popFrameStyle) {
          const popFrameStyle = res?.popFrameStyle;
          const content = res?.popFrameStyle?.content
            ? JSON.parse(res?.popFrameStyle?.content)
            : [];
          if (popFrameStyle?.gizmoStatus == "true") {
            popFrameStyle.content = content;
            this.openComponentFrame({
              uid: type + res.id,
              ...popFrameStyle,
            });
          }
        }
      });
    }
  };
  exchangePosition = (iconPosition, isText = false) => {
    return Array.isArray(iconPosition.position)
      ? {
          lng: iconPosition.position[0][0],
          lat: iconPosition.position[0][1],
          alt: isText ? iconPosition.height + 1 : iconPosition.height,
        }
      : iconPosition.position;
  };

  setFeatureNameShowHide = (geometryObj, val, values?) => {
    try {
      setTimeout(() => {
        if (val) {
          const { featureName, fontColor, fontSize, fontAnchor } = values;
          geometryObj.showLabel &&
            geometryObj.showLabel({
              text: featureName,
              style: {
                fontColor,
                fontSize,
                fontAnchor,
              },
            });
        } else {
          geometryObj.hideLabel && geometryObj.hideLabel();
        }
      }, 100);
    } catch (error) {}
  };
  //获取行车路线设备
  getDeviceRoute = async (values: any = {}) => {
    try {
      // if (values && !values.ids) return;
      const params = {
        // ids: this.currentRoute.id,
        ...values,
      };
      const res = await webapi.deviceRoute4Menu(params);
      this.deviceList = res;
    } catch (error) {}
  };
  workGroupStatics = async () => {
    try {
      const res = await webapi.workGroupStatics(
        this.eventId === "eventId" ? 90 : this.eventId
      );
      this.workGroupData = res;
    } catch (error) {}
  };
  getTabName = () => {
    const { childMenuList, childTab } = this;
    const row = childMenuList.find((item) => item.value == childTab);
    return row.label;
  };
  flyTo = async (views) => {
    const { viewer } = this;
    if (!viewer) return;
    const cameraInfo = viewer ? await viewer.getCameraInfo() : {};
    viewer &&
      viewer.flyTo({
        ...cameraInfo,
        ...views,
      });
  };
  getThreePage = async () => {
    try {
      this.threePageData = null;
      this.floorOneList = [];
      this.floorTwoList = [];
      const list = ["RESPONSIBILITY_AREA", "MOBILE_STANDBY"];
      const params: any = {
        firstType: this.tab,
        planId: this.planId,
        venueId: this.venueId,
      };
      if (list.includes(this.tab)) {
        params.id = this.childTab;
      } else {
        params.secondType = this.childTab;
      }
      const res = await webapi.getThreePage(params);
      if (res.workGroupDTOS?.length > 0) {
        try {
          for (let index = 0; index < res.workGroupDTOS.length; index++) {
            const item = res.workGroupDTOS[index];
            const taskInfo = await this.userInfoExtend(
              item.groupLeaderName,
              item.taskId
            );
            res.workGroupDTOS[index].picUrl = taskInfo.profilePhotoUrl;
            res.workGroupDTOS[index].taskContent = taskInfo.taskContent;
          }
          const groupIds = res.workGroupDTOS.map((item) => item.groupId);
          this.getWorkGroup(groupIds.join());
        } catch (error) {}
      } else {
        this.policeTree = [];
        this.policeData = [];
      }
      this.threePageData = res;
      const featureInfoInherentVOList = tryGet(
        res,
        "featureInfoInherentVOList"
      );

      if (["CHECKPOINT", "ANTI_TERRORISM_PREVENTION"].includes(this.tab)) {
        const navView = globalState.get("navView") || [];
        const row = navView.find((item) => item.value === this.tab);
        const view = row?.view || null;
        this.flyTo(view);
      }
      this.inherentIds = featureInfoInherentVOList
        .filter((item) => item.type == "inherent")
        .map((item) => item.id)
        ?.join();
      this.temporaryIds = featureInfoInherentVOList
        .filter((item) => item.type == "temporary")
        .map((item) => item.id)
        ?.join();
      if (featureInfoInherentVOList.length > 0) {
        const { switchAnimation, visualAngle } = featureInfoInherentVOList[0];
        if (
          switchAnimation &&
          visualAngle &&
          !["CHECKPOINT", "ANTI_TERRORISM_PREVENTION"].includes(this.tab)
        ) {
          const duration =
            JSON.parse(switchAnimation).animationType != "0"
              ? JSON.parse(switchAnimation).animationTime * 1000
              : 0;
          const rotation = JSON.parse(visualAngle).rotation;
          this.viewer.flyTo({ ...rotation, duration });
        }
        let distinctList = res?.buildingFloorDeviceDTO?.distinctList || [];
        distinctList = distinctList.filter(
          (item) => item.buildingId !== "outdoor"
        );
        if (this.currentBuild?.length > 0) {
          this.resetSplitBuildGroup();
        }
        if (distinctList.length > 0) {
          const buildList1 = [];
          const buildList2 = [];
          for (let index = 0; index < distinctList.length; index++) {
            const item = distinctList[index];
            if (
              buildList1.some(
                (row) =>
                  row.buildId == item.buildingId && row.floor != item.floor
              )
            ) {
              buildList2.push({
                buildId: item.buildingId,
                floor: item.floor,
              });
            } else {
              buildList1.push({
                buildId: item.buildingId,
                floor: item.floor,
              });
            }
          }
          this.buildList1 = buildList1;
          this.buildList2 = buildList2;
          if (buildList2?.length > 0) {
            const oneList = this.filterFloorList(
              featureInfoInherentVOList,
              buildList1
            );
            const twoList = this.filterFloorList(
              featureInfoInherentVOList,
              buildList2
            );
            const oneIds = oneList.map((item) => item.id);
            const twoIds = twoList.map((item) => item.id);
            this.floorOneList = featureInfoInherentVOList.filter(
              (item) => !twoIds.includes(item.id)
            );
            this.floorTwoList = featureInfoInherentVOList.filter(
              (item) => !oneIds.includes(item.id)
            );
          } else {
            this.floorOneList = featureInfoInherentVOList;
            this.floorTwoList = [];
          }
          setTimeout(() => {
            this.currentBuild = buildList1;
            this.currentKey = "1";
            this.splitBuildGroup(this.buildList1);
          }, 600);
        } else {
          this.floorOneList = featureInfoInherentVOList;
          this.floorTwoList = [];
        }
      } else {
        Message.warning("暂无数据！请先在管理平台创建数据！");
      }
      setTimeout(() => {
        this.featureDiagram(this.floorOneList);
      }, 800);
      if (!["CHECKPOINT", "ANTI_TERRORISM_PREVENTION"].includes(this.tab)) {
        this.openFirstFrame(this.floorOneList);
      }
    } catch (error) {}
  };
  openFirstFrame = (data) => {
    try {
      const res = data.find(
        (item) =>
          item.popFrameStyles && item.popFrameStyles[0]?.gizmoStatus == "true"
      );
      const popFrameStyle = res.popFrameStyles[0];

      if (res) {
        if (this.currentFrameStyle?.uid) {
          this.closeComponentFrame(this.currentFrameStyle?.uid);
        }
        if (popFrameStyle) {
          const content = popFrameStyle?.content
            ? JSON.parse(popFrameStyle?.content)
            : [];
          if (popFrameStyle?.gizmoStatus == "true") {
            popFrameStyle.content = content;
            this.openComponentFrame({
              uid: res.type + res.id,
              ...popFrameStyle,
            });
          }
        }
      }
    } catch (error) {}
  };
  /**
   * 过滤分层数据
   * @param featureInfoInherentVOList
   * @param buildList
   * @returns
   */
  filterFloorList = (featureInfoInherentVOList, buildList) => {
    return featureInfoInherentVOList.filter((item) => {
      const buildingFloor = item.buildingFloor;
      const isContain = buildList.some((child) => {
        return buildingFloor.some((row) => {
          return row.buildingId == child.buildId && row.floor == child.floor;
        });
      });
      return isContain;
    });
  };
  splitBuildGroup = (buildIds) => {
    try {
      if (buildIds?.length == 0) return;
      const build = new window["KMapUE"].SplitBuilding(this.viewer);
      build.splitBuildGroup({
        buildIds,
      });
    } catch (error) {}
  };
  resetSplitBuildGroup = () => {
    try {
      const buildIds = this.currentBuild.map((item) => item.buildId);
      if (buildIds?.length == 0) return;
      const build = new window["KMapUE"].SplitBuilding(this.viewer);
      build.resetSplitBuildGroup(buildIds);
    } catch (error) {}
  };
  //责任单位
  getRelationResponsibilityArea = async () => {
    try {
      const params: any = {
        firstType: this.tab,
        planId: this.planId,
        venueId: this.venueId,
      };
      const list = ["RESPONSIBILITY_AREA", "MOBILE_STANDBY"];
      if (list.includes(this.tab)) {
        params.id = this.childTab;
      } else {
        params.secondType = this.childTab;
      }
      const res = await webapi.getRelationResponsibilityArea(params);
      this.responsibilityData = res;
    } catch (error) {}
  };
  wordGroupByGroupId = async (groupIds) => {
    try {
      const res = await webapi.wordGroupByGroupId({ groupIds });
      try {
        for (let index = 0; index < res.length; index++) {
          const item = res[index];
          const taskInfo = await this.userInfoExtend(
            item.groupLeaderName,
            item.taskId
          );
          res[index].picUrl = taskInfo.profilePhotoUrl;
          res[index].taskContent = taskInfo.taskContent;
          if (item.deviceBwcCode) {
            res[index] = {
              ...item,
              deviceType: "BWC",
              gbid: item.deviceBwcCode,
              key: `${item.deviceBwcCode}-${item.groupId}-${index}`,
            };
          } else if (item.devicePttCode) {
            res[index] = {
              ...item,
              deviceType: "PTT",
              gbid: item.devicePttCode,
              key: `${item.devicePttCode}-${item.groupId}-${index}`,
            };
          } else if (item.devicePadCode) {
            res[index] = {
              ...item,
              deviceType: "PAD",
              gbid: item.devicePadCode,
              key: `${item.devicePadCode}-${item.groupId}-${index}`,
            };
          }
        }
        const groupIds = res.map((item) => item.groupId);
        this.getWorkGroup(groupIds.join());
      } catch (error) {}

      this.wordGroupData = res;
    } catch (error) {}
  };
  /**
   * 获取头像
   * @param userName
   * @returns
   */
  userInfoExtend = async (userName, taskId) => {
    try {
      const res = await webapi.userInfoExtend({ usernames: userName, taskId });
      const { taskDetails, userDetails } = res;
      return {
        taskContent: taskDetails?.taskContent,
        profilePhotoUrl: userDetails?.profilePhotoUrl,
      };
    } catch (error) {}
  };
  //只获取头像
  userProfile = async (userName) => {
    try {
      const res = await webapi.userProfile({ usernames: userName });
      return res[0]?.profilePhotoUrl || "";
    } catch (error) {
      console.log(error);
    }
  };
  getDeviceType = (data) => {
    if (data.deviceType === "IPC") {
      const cameraForm = tryGet(data, "deviceAttr.ipc.cameraForm");
      const deviceType = ["1", "2"].includes(cameraForm) ? "IPC_1" : "IPC_3";
      return deviceType;
    } else {
      return data.deviceType;
    }
  };

  addHistorytrack = (startTime, endTime) => {
    try {
      if (this.policeInfo.gbid) {
        this.historyProgress = 0;
        this.speedRate = 1;
        const historytrack = new window["KMapUE"].HistoryTrack({
          viewer: this.viewer,
          options: {
            startTime,
            endTime,
            gbid: this.policeInfo.gbid,
            follow: true,
            dataType: "icon",
            iconTitle: this.policeInfo.name,
            iconName: this.policeTypes[this.policeInfo._showTagName],
            onComplete: (res) => {
              const { startTimestamp, endTimestamp } = res;
              const totalTime = Number(endTimestamp) - Number(startTimestamp);
              const totalTimeStr = this.formatTimestamp(
                Number(endTimestamp) - Number(startTimestamp)
              );
              this.trackVisible = true;
              this.historyTrackTimes = {
                startTimestamp,
                endTimestamp,
                totalTime,
                totalTimeStr,
              };
              historytrack.on("progress", (data) => {
                // curTimestamp
                this.historyProgress = data?.curTimestamp - startTimestamp;
              });
              this.changeState({
                leftPanelVisible: false,
                navPanelVisible: false,
              });
              console.log("======createHistoryTrack=======", res);
            },
            onError: (err) => {
              Message.error(err.message);
              this.historyVisible = true;
              console.error("======createHistoryTrack=======", err);
            },
          },
        });
        this.historytrack = historytrack;
      }
    } catch (error) {}
  };
  removeHistorytrack = () => {
    try {
      if (this.historytrack) {
        this.historytrack.remove();
        this.historytrack = null;
      }
    } catch (error) {}
  };
  formatTimestamp = (timestamp) => {
    const days = Math.floor(timestamp / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timestamp % (1000 * 60)) / 1000);

    let result = "";
    if (days > 0) {
      result += days + "天";
    }
    if (hours > 0 || days > 0) {
      result += String(hours).padStart(2, "0") + "小时";
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      result += String(minutes).padStart(2, "0") + "分钟";
    }
    if (seconds > 0 || minutes > 0 || hours > 0 || days > 0) {
      result += String(seconds).padStart(2, "0") + "秒";
    }

    return result;
  };
  //添加实时轨迹
  addRealTimetrack = () => {
    try {
      this.removeRealTimetrack();
      if (this.policeInfo.gbid) {
        const realTimetrack = new window["KMapUE"].RealTimeTrack({
          viewer: this.viewer,
          options: {
            gbid: this.policeInfo.gbid,
            dataType: "icon",
            iconTitle: this.policeInfo.name,
            iconName: this.policeTypes[this.policeInfo._showTagName],
            onComplete: (res) => {
              console.log("======RealTimeTrack=======", res);
              this.changeState({
                leftPanelVisible: false,
                navPanelVisible: false,
              });
            },
            onError: (err) => {
              Message.error(err.message);
              console.error("======RealTimeTrack=======", err);
            },
          },
        });
        this.realTimetrack = realTimetrack;
      }
    } catch (error) {}
  };
  //移除实时轨迹
  removeRealTimetrack = () => {
    try {
      if (this.realTimetrack) {
        this.realTimetrack.remove();
        this.realTimetrack = null;
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
  addNnzrg = (zrqgroup) => {
    try {
      if (zrqgroup.length > 0) {
        const addList = zrqgroup.filter(
          (item) =>
            this.zrqgroup.filter((item1) => item1.uid == item.uid).length == 0
        );
        const removeList = this.zrqgroup.filter(
          (item) =>
            zrqgroup.filter((item1) => item1.uid == item.uid).length == 0
        );
        if (addList && addList.length > 0) {
          const nnzrq = new window["KMapUE"].Nnzrq({
            viewer: this.viewer,
            options: {
              zrqgroup: addList,
            },
          });
          this.nnzrg = nnzrq;
        }

        if (removeList && removeList.length > 0) {
          this.nnzrg.destroy(removeList.map((item) => item.id).join());
        }
        this.zrqgroup = zrqgroup;
      } else {
        this.destroyAllNnzrg();
      }
    } catch (error) {}
  };
  removeNnzrg = (zrqid?: string) => {
    try {
      if (!this.nnzrg || !zrqid) return;
      this.nnzrg.destroy(zrqid);
      // this.zrqgroup = this.zrqgroup.filter(item => item = zrqid)
    } catch (error) {}
  };
  destroyAllNnzrg = () => {
    try {
      if (!this.nnzrg) return;
      this.nnzrg.destroyAll();
      this.nnzrg = null;
      this.zrqgroup = [];
    } catch (error) {}
  };
  // fromSource来自哪边点击： footer、 toolbox、 sy
  verifyFrame = (callback, fromSource?: string) => {
    if (
      (this.tab == "sy" || fromSource === "footer") &&
      this.homePoliceRemarkVisible &&
      !this.selectedPoliceRemark.readOnly
    ) {
      Modal.confirm({
        title: "提示",
        content: `切换后，警情标注数据将被清除，确定继续切换？`,
        onOk: () => {
          this.location = null;
          this.homeSecurityInfoVisible = false;
          this.homePoliceRemarkVisible = false;
          callback && callback();
        },
      });
    } else if (
      this.tab == "sy" &&
      this.homeLeftSideActive == "3" &&
      this.location
    ) {
      Modal.confirm({
        title: "提示",
        content: "切换后，图上框选数据将被清除，确定继续切换？",
        onOk: () => {
          this.location = null;
          callback && callback();
        },
      });
    } else {
      callback && callback();
    }
  };
  verifyRemark = (callback) => {
    if (
      this.tab == "sy" &&
      this.homePoliceRemarkVisible &&
      !this.selectedPoliceRemark.readOnly
    ) {
      Modal.confirm({
        title: "提示",
        okText: "关闭",
        content: `是否关闭当前警情标注数据？
取消则留在当前页面，关闭则清除警情标注数据及详情弹窗`,
        onOk: () => {
          this.location = null;
          callback && callback();
        },
      });
    } else {
      callback && callback();
    }
  };
  getLayerBusinessQuery = async () => {
    try {
      const res = await appStore.getLayerBusinessQuery();
      const allIds = res.map((item) => item.gbid);
      this.allDeviceData = res;
      this.allGbid = allIds;
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

  // 删除警情标注绘制时带出来的责任区范围
  removeSecurityAreaFeature = () => {
    const { viewer } = this;
    if (viewer) {
      let ids = this.homePopSecurityAreaInfo?.map((i) => {
        const l = i.geometry && JSON.parse(i.geometry);
        return l.id || l.Id;
      });
      if (ids?.length) {
        try {
          const geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });
          geometryUtil?.remove({
            ids: ids,
          });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };
}

export default new Store();
