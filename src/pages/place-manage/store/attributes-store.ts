import globalState from "@/globalState";
import { deep, getEventId, Trees } from "@/kit";
import appStore from "@/store";
import { debounce } from "lodash";
import { makeAutoObservable } from "mobx";
import indexStore from "./index";
import {
  getDeviceGroup,
  getdeviceGroupList,
  getDevicesStatistical,
  getDeviceStatistical,
  getDeviceTypes,
  getRbacDepartmentTree,
  getTagList,
  getWorkGroupList,
} from "./webapi";
const { generateListNew } = Trees;

class Store {
  checkedKeysArr: any;
  constructor() {
    makeAutoObservable(this);
  }
  dataSource: any = [];
  loading: boolean = true;
  dataStatus: boolean = false;
  pager: any = {
    pageSize: 20,
    current: 1,
    total: 0,
  };
  componentStore: any = null;
  modalVisible: boolean = false;
  filterVisible: boolean = false;
  securityTypeList: any = [
    {
      label: "疏导区",
      value: "DIVERSION",
    },
    {
      label: "核心区",
      value: "CORE",
    },
    {
      label: "控制区",
      value: "CONTROL",
    },
    {
      label: "其他",
      value: "OTHER",
    },
  ];
  securityTypeWallList: any = [
    {
      label: "疏导区",
      value: "DIVERSION",
    },
    {
      label: "核心区",
      value: "CORE",
    },
    {
      label: "控制区",
      value: "CONTROL",
    },
    {
      label: "警戒区",
      value: "ALERT",
    },
    {
      label: "其他",
      value: "OTHER",
    },
  ];
  routeTypeList: any = [
    {
      label: "领导参展路线",
      value: "LEADERSHIP_ROUTE",
    },
    {
      label: "其他",
      value: "OTHER",
    },
  ];

  deviceTypes: any = [];
  filterTypes: any = [];
  filterCodes: any = [];
  statusCodes: any = [];
  activeType: string;
  tagList: any = [];
  tagIds: any = [];
  departmentTree: any = [];
  devices: any = [];
  deviceGroupTree: any = [];
  grounpStatistical: any = [];
  totalStatistical: any = {};
  deviceFilterParams: any = {
    withRole: false,
    deviceStatus: "0,1,2",
    tag: "",
    deviceName: "",
    deviceTypes: "",
  };
  visualType: string = "0"; //视角类型
  animationType: string = "0"; //动画类型 1：飞行， 0：跳转
  viewer: any = null; //ue实例
  geometryObj: any = null; //当前操作实例
  gizmoControl: any = null; //gizmo
  attrForm: any = null;
  rotation: any = {}; //视图位置
  // indexStore: any = null;
  pickupOpen: boolean = false; //开启拾取
  detailData: any = null; //表单详情数据
  geometryUtilThree: any = null;
  position: Array<any> = [];
  iconPosition: any = {};
  modelAltitude: number = null;
  drawId: string = "";
  modalMap: boolean = false;
  attrType: number = 1;
  addElement: any = null;
  isAdd: boolean = false; //是否正在添加途经点
  add: any = null; //途经点添加方法
  elementType: string = "elementIcon";
  transformUe: any = null;
  rotationUe: any = null;
  positionFrame: any = null;
  devicelayerObj: any = {}; //设备图层
  devicelayerIds: any = {}; //设备图层id
  workGroupList: Array<any> = []; //工作组列表
  carDeviceList: Array<any> = []; //车载设备
  allDeviceList: Array<any> = []; //所有设备
  deviceGroup: any = [];
  addDeviceType: string = "0";
  location: any = null;
  frameSelectVisible: boolean = true;
  associateElement: string | number = "";
  sceneList: any = [
    {
      label: "A区",
      value: "ZRQ_1",
    },
    {
      label: "A区1层",
      value: "ZRQ_1_1F",
    },
    {
      label: "A区地下商业广场",
      value: "ZRQ_1_-1F",
    },
    {
      label: "B区楼顶安全警戒",
      value: "ZRQ_2",
    },
    {
      label: "B区金桂花厅2F",
      value: "ZRQ_2_2F_JinGuiHuaTing",
    },
    {
      label: "C区",
      value: "ZRQ_3",
    },
    {
      label: "D区",
      value: "ZRQ_4",
    },
    {
      label: "朱槿花厅",
      value: "ZRQ_4_ZhuJingHuaTing",
    },
    {
      label: "E区",
      value: "ZRQ_5",
    },
    {
      label: "E区1层",
      value: "ZRQ_5_1F",
    },
    {
      label: "会展中心北广场",
      value: "ZRQ_10",
    },
    {
      label: "C、D区、E区、朱槿花厅、会展广场及公共区域",
      value: "ZRQ_11",
    },
    {
      label: "广场中轴线往东至会展中心一支路1号口",
      value: "ZRQ_12",
    },
    {
      label: "会展中心一支路往南至方圆荟",
      value: "ZRQ_13",
    },
    {
      label: "方圆荟以北至会展广场中轴线西侧",
      value: "ZRQ_14",
    },
    {
      label: "会展路东侧山坡",
      value: "ZRQ_15",
    },
  ];

  filterLayerVisible: boolean = false;
  deviceNameVisible: boolean = false;
  filterDeviceTypeKeys: any = ["IPC_1", "IPC_3", "BWC", "PTT", "PAD", "MT"];
  filterDeviceStatusKeys: any = ["0", "1", "2"];
  polymerization: boolean = false;
  isCreateLayer: boolean = false;
  zrqgroup: Array<any> = [];
  nnzrg: any = null;
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
  flyTo = () => {
    try {
      if (this.viewer && this.rotation) {
        this.viewer.flyTo(this.rotation);
      }
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
        dataSource: [],
        loading: true,
        deviceTypes: [],
        filterTypes: [],
        dataStatus: false,
        modalVisible: false,
        filterVisible: false,
        statusCodes: [],
        visualType: "0",
        pickupOpen: false,
        rotation: {},
        deviceFilterParams: {
          withRole: false,
          deviceStatus: "0,1,2",
          tag: "",
          deviceName: "",
          deviceTypes: "",
        },
        pager: {
          pageSize: 20,
          current: 1,
          total: 0,
        },
        tagList: [],
        tagIds: [],
        departmentTree: [],
        devices: [],
        deviceGroupTree: [],
        grounpStatistical: [],
        totalStatistical: {},
        drawId: "",
        iconPosition: {},
        modalMap: false,
        addElement: null,
        modelAltitude: null,
        isAdd: false,
        transformUe: null,
        rotationUe: null,
        positionFrame: null,
        devicelayerObj: {},
        devicelayerIds: {},
        addDeviceType: "0",
        location: null,
        frameSelectVisible: true,
        ...params,
      });
    } catch (error) {}
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
      this.filterTypes = deep(res);
      this.filterCodes = res.map((item) => item.typeCode);
      this.deviceFilterParams = {
        ...this.deviceFilterParams,
        deviceTypes: res[0].typeCode,
      };
      this.activeType = res[0].typeCode;
    } catch (error) {}
  };
  getTagList = async () => {
    try {
      let res = await getTagList({});
      this.tagList = res;
    } catch (error) {}
  };
  getRbacDepartmentTree = async () => {
    try {
      let res = await getRbacDepartmentTree();
      this.departmentTree = res;
    } catch (error) {}
  };
  traverseAndModify = (tree) => {
    try {
      tree.forEach((node) => {
        // 修改当前节点
        node.nodeType = "group"; // 添加或修改节点属性
        node.key = node.id;
        node.title = node.groupName;
        node.statistical = this.grounpStatistical[node.id];
        // 如果存在子节点，递归遍历子节点
        if (node.children) {
          this.traverseAndModify(node.children);
        }
      });
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
      };
      let res = await getDeviceGroup(params);
      this.getDeviceStatistical();
      await this.getDevicesStatistical();
      this.traverseAndModify(res);
      this.deviceGroupTree = res;
      console.log(res, "this.deviceGroupTree");
    } catch (error) {}
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
      this.totalStatistical = res;
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
      };
      let res = await getdeviceGroupList(params, groupId);
      let data = res?.data?.map((item) => {
        return {
          ...item,
          title: item.deviceName,
          key: item.gbid,
          checkable: true,
          isLeaf: true,
          nodeType: "device",
        };
      });
      return data || [];
    } catch (error) {}
  };
  shuttleData = () => {
    try {
      let data = [];
      generateListNew(this.deviceGroupTree, data);
      return data;
    } catch (error) {}
  };
  setDevices = (data) => {
    // const gbids = this.devices.map((item) => item.gbid);
    // data = data
    //   .filter((item) => !gbids.includes(item.gbid))
    //   .map((item) => {
    //     return {
    //       ...item,
    //       deviceType:
    //         item.deviceType !== "IPC"
    //           ? item.deviceType
    //           : ["1", "2"].includes(item.cameraForm)
    //           ? "IPC_1"
    //           : "IPC_3",
    //     };
    //   });
    this.devices = data;
    // this.devices = objectArrUnique([...data], "gbid");

    console.log("this.devices", this.devices);
  };
  changeDevices = (row, type) => {
    if (!row.gbid) return;
    row = {
      ...row,
      deviceType:
        row.deviceType !== "IPC"
          ? row.deviceType
          : ["1", "2"].includes(row.cameraForm)
            ? "IPC_1"
            : "IPC_3",
    };
    if (type) {
      this.devices = [...this.devices, row];
    } else {
      const newData = deep(this.devices);
      const index = this.devices.findIndex((item) => item.gbid === row.gbid);
      newData.splice(index, 1);
      this.devices = newData;
    }
  };
  setFrameData = (data) => {
    const gbids = this.devices.map((item) => item.gbid);
    data = data
      .filter((item) => !gbids.includes(item.gbid))
      .map((item) => {
        return {
          ...item,
          deviceType:
            item.deviceType !== "IPC"
              ? item.deviceType
              : ["1", "2"].includes(item.cameraForm)
                ? "IPC_1"
                : "IPC_3",
        };
      });
    this.devices = [...this.devices, ...data];
  };
  isHasObj = (obj) => {
    try {
      if (!obj) return false;
      return this.geometryObj ? true : false;
    } catch (error) {
      return false;
    }
  };
  //更新实例
  elementUpdate = (options) => {
    if (!this.geometryObj) return;
    this.isHasObj(this.geometryObj) &&
      this.geometryObj.update &&
      this.geometryObj.update(options);
  };

  clearGizmoControl = () => {
    if (this.gizmoControl) {
      // this.gizmoControl.off("gizmotransform");
      this.gizmoControl.setActive(false);
      this.changeState({
        transformUe: null,
      });
    }
  };
  exchangePosition = (iconPosition) => {
    return {
      lng: iconPosition.position[0][0],
      lat: iconPosition.position[0][1],
      alt: iconPosition.height,
    };
  };

  setGizmoControlMode = () => {
    if (!this.gizmoControl) return;
    if (this.gizmoControl.getMode() == "translate") {
      this.gizmoControl.setMode("rotate");
    } else {
      this.gizmoControl.setMode("translate");
    }
  };
  createGizmoControl = () => {
    if (this.gizmoControl) return;
    const gizmoControl = new window["KMapUE"].GizmoControl({
      viewer: this.viewer,
      onComplete: (res) => {
        console.log(res, gizmoControl);
        if (gizmoControl) {
          this.changeState({
            gizmoControl,
          });
          gizmoControl.setFixedScale(true);
          gizmoControl.setSize(0.8);
          gizmoControl.setActive(false);
          // 事件监听
          gizmoControl.off("gizmotransform");
          gizmoControl.on(
            "gizmotransform",
            debounce((res) => {
              const { id, mode, transform, selected } = res;
              const row = this.geometryObj?.getData();
              const geometryId = row?.id;
              console.log(res, "gizmotransformgizmotransform");
              if (
                id == "1" ||
                ![`model${geometryId}`, geometryId].includes(id)
              ) {
                const { position } = transform;
                this.changeState({
                  positionFrame: position,
                });
              }
              if (mode === "rotate") {
                const { position } = transform;
                this.changeState({
                  rotationUe: position,
                });
                this.geometryObj &&
                  this.geometryObj.update({
                    rotation: position,
                  });
              }

              if (id == "undefined" && mode === "translate") {
                // 设备未传入id
                this.changeState({
                  transformUe: transform,
                });
              }

              if ([`model${geometryId}`, geometryId].includes(id)) {
                const values = this.attrForm.getFieldsValue();
                if (mode === "translate") {
                  this.changeState({
                    transformUe: transform,
                  });
                  const { position } = transform;

                  if (id.startsWith("model")) {
                    if (
                      this.position &&
                      this.position.length > 0 &&
                      this.position[0][0] == position.lng &&
                      this.position[0][1] == position.lat &&
                      this.modelAltitude == position.alt
                    )
                      return;
                    this.modelAltitude = position.alt;
                    this.position = [[position.lng, position.lat]];
                    this.geometryObj &&
                      this.geometryObj.update({
                        modelPosition: [[position.lng, position.lat]],
                        modelAltitude: position.alt,
                      });
                  } else {
                    console.log("0000000", this.iconPosition, position);

                    if (
                      this.iconPosition.position?.length > 0 &&
                      this.iconPosition.position[0][0] == position.lng &&
                      this.iconPosition.position[0][1] == position.lat &&
                      this.iconPosition.height == position.alt
                    )
                      return;
                    this.iconPosition = {
                      height: position.alt,
                      position: [[position.lng, position.lat]],
                    };
                    if ([7, 9].includes(this.attrType)) {
                      this.geometryObj &&
                        this.geometryObj.update({
                          position: this.exchangePosition(this.iconPosition),
                          text: values.aliasName,
                        });
                    } else {
                      this.geometryObj &&
                        this.geometryObj.update({
                          ...this.iconPosition,
                          selected,
                        });
                    }
                  }
                } else if (mode === "rotate") {
                  const { position } = transform;
                  this.changeState({
                    rotationUe: position,
                  });
                  // if (id.startsWith("model")) {
                  //   indexStore.geometryObj &&
                  //     this.geometryObj.update({
                  //       rotation
                  //     });
                  // }
                } else if (mode === "scale") {
                  const { scale } = transform;
                  this.attrForm.setFieldsValue({
                    x: scale.Z,
                    y: scale.Y,
                  });
                }
              }
            }, 600),
          );
        }
      },
    });
  };
  //开启关闭gizmoControl
  openGizmoControl = (type, callback?: () => void) => {
    if (!this.viewer || !this.gizmoControl) {
      return;
    }
    if (type) {
      this.gizmoControl &&
        this.gizmoControl.setActive(true, () => {
          this.gizmoControl && this.gizmoControl.setSpace("local");
          this.gizmoControl && this.gizmoControl.setFixedScale(true);
          this.gizmoControl && this.gizmoControl.setSize(0.8);
          setTimeout(() => {
            callback && callback();
          }, 600);
        });
    } else {
      this.gizmoControl.setActive(false);
    }
  };
  modelOpen = (type) => {
    if (!this.viewer) return;
    if (type) {
      if (!this.geometryUtilThree) {
        const geometryUtilThree = new window["KMapUE"].GeometryUtil({
          viewer: this.viewer,
        });
        this.geometryUtilThree = geometryUtilThree;
      }

      this.geometryUtilThree.draw({
        type: 8,
        onComplete: (res) => {
          // const geometry = res;
          console.log(res, "geometryUtilThree");
          const geometryData = res.getData();
          this.drawId = res.id;
          const geometrydataTransformToArray: (data: any) => number[][] = (
            data: any[],
          ) => {
            return data.map((item) => {
              return [item.Lng, item.Lat];
            });
          };
          const position = geometrydataTransformToArray(geometryData.Data);
          this.position = position;
          const values = this.attrForm.getFieldsValue();
          this.elementUpdate({
            type: "model",
            modelScale: values.modelScale,
            // position,
            modelPosition: position,
            modelWidth: values.modelWidth,
            modelHeight: values.modelHeight,
          });
        },
      });
    } else {
      if (this.geometryUtilThree) {
        this.drawId && this.geometryUtilThree.remove({ ids: [this.drawId] });
        if (this.position.length < 2) {
          this.geometryUtilThree.cancel();
        }
      }
      const values = this.attrForm.getFieldsValue();
      this.elementUpdate({
        type: "icon",
        scale: values.scale,
        ...this.iconPosition,
      });
      this.position = [];
      this.drawId = "";
    }
  };
  featureNameShowHide = () => {
    try {
      const values = this.attrForm.getFieldsValue();
      const { featureName, showName } = values;
    } catch (error) {}
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
      this.componentStore?.setDevicePerspective(val);
    } catch (error) {}
  };
  //删除设备图层
  removeDeviceLayer = () => {
    try {
      for (const key in this.devicelayerObj) {
        const item = this.devicelayerObj[key];
        if (item) {
          item.off("click");
          item.remove();
          this.devicelayerObj[key] = null;
          this.devicelayerIds[key] = null;
        }
      }
    } catch (error) {}
  };
  //删除设备图层
  removeDeviceLayerByKey = (key: string) => {
    try {
      const item = this.devicelayerObj[key];
      if (item) {
        item.off("click");
        item.remove();
        this.devicelayerObj[key] = null;
        this.devicelayerIds[key] = null;
      }
    } catch (error) {}
  };
  //工作组列表
  getWorkGroupList = async () => {
    try {
      const res = await getWorkGroupList(getEventId());
      this.workGroupList = res.map((item) => {
        return {
          ...item,
          label: item.groupName,
          value: String(item.groupId),
        };
      });
    } catch (error) {}
  };
  //车载设备
  getCarDeviceList = async () => {
    try {
      const params: any = {
        withRole: false,
        deviceTypes: ["BWC"],
        noLocation: true,
      };
      const res = await appStore.getLayerBusinessQuery(params);
      console.log(res);
      const resultDevice = res || [];
      this.carDeviceList = resultDevice.map((item) => {
        return {
          ...item,
          value: item.gbid,
          label: `${item.name}（${item.gbid}）`,
        };
      });
    } catch (error) {}
  };
  getAllDevice = async () => {
    try {
      const params: any = {
        withRole: false,
        location: globalState.get("location"),
      };
      const res = (await appStore.getLayerBusinessQuery(params)) || [];
      const arr = res.reduce((prev, item) => {
        const groupIds = item?.groupId?.split("|") || [];
        const keys = groupIds.map((groupId) => `${item.gbid}-${groupId}`);
        return [...prev, ...keys];
      }, []);
      this.deviceGroup = arr;
    } catch (error) {
      console.log(error);
    }
  };
  updateDeviceChecks = () => {
    if (this.deviceGroup.length > 0) {
      const gbids = this.devices.map((item) => item.gbid);
      const keys = this.deviceGroup.filter((item) =>
        gbids.includes(item?.split("-")[0]),
      );
      indexStore.checkedKeys = keys;
    }
  };
  addNnzrg = (zrqgroup) => {
    try {
      // debugger
      if (zrqgroup.length > 0) {
        const addList = zrqgroup.filter(
          (item) =>
            this.zrqgroup.filter((item1) => item1.uid == item.uid).length == 0,
        );
        const removeList = this.zrqgroup.filter(
          (item) =>
            zrqgroup.filter((item1) => item1.uid == item.uid).length == 0,
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
  destroyAllNnzrg = () => {
    try {
      if (!this.nnzrg) return;
      this.nnzrg.destroyAll();
      this.nnzrg = null;
      this.zrqgroup = [];
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
