import { makeAutoObservable, runInAction } from "mobx";
import { Message } from "@arco-design/web-react";
import { featureList, planList } from "./webapi";
import { Trees, tryGet } from "@/kit";

const { generateListNew } = Trees;

class Store {
  constructor() {
    makeAutoObservable(this);
  }
  viewer = null;
  status: "readonly" | "editable" = "editable";

  pageType: string = "inherent";

  // 是否唤起要素面板
  isAttributes: boolean = false;
  // 是否在纠偏
  isCorrect: boolean = false;
  //  纠偏物体经纬度位置
  correctLLA: any = { lng: 0, lat: 0, alt: 0 };
  correctCofirm: (coordinate: any) => void;
  //
  correctEleData: any = null;
  hasCorrectDetail: boolean = false;
  // 计划列表
  plans: PlanInfo[] = [];

  jfInherentKeys: any = [];
  jfInherentData: any = [];

  elementFeature = null;
  isView: boolean = false;
  // 计划列表转options
  get plans2Options() {
    return this.plans.map((el) => {
      return {
        label: el.planName,
        value: el.id,
      };
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

  selectedTreeNode = null;

  // 新增要素绘制
  addFeatureStorage = null;

  // 编辑要素绘制
  editFeature = null;

  // geometry编辑 新增对象
  geometryObj = null;

  // 设备纠偏 设备位置，计算俯视角
  geometryPosition = null;

  // 固有
  checkedKeysInherentArr = [];

  geometryDataMapStore = null;

  frameUeIds = {};
  // 场景编辑 右键数据
  menuFeatureId = null;
  menuFeatureType = null;
  tempId = null;
  wfInherentTreeData: any = [];
  devicelayerObj: any = {}; //设备图层
  devicelayerIds: any = {}; //设备图层id
  jfCheckedKeys: any = [];

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
  cTUserMngServer: string = "";

  // 批量创建参数
  batchData: Array<any> = [];
  signpostBatchData: Array<any> = [];
  labelBatchData: Array<any> = [];
  areaBatchData: Array<any> = [];
  batchRemoveData: Array<any> = [];
  batchRemoveAreaData: any = { ids: [], wallIds: [], routeIds: [] };
  batchIdMap: Map<string, string> = new Map();
  batchPropertyMap: Map<string, any> = new Map();
  //设备预览
  currentDevice: any = null;
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
        jfCheckedKeys: [],
        devicelayerObj: {},
        devicelayerIds: {},
        pageType: "inherent",
        ...params,
      });
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
        const item = this.devicelayerObj[type];
        if (item) {
          const renderSpace = val ? "Screen" : "World";
          item.setRenderSpace(renderSpace);
        }
      }
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
