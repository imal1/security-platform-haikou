import { makeAutoObservable, runInAction } from "mobx";
import { Message } from "@arco-design/web-react";
import {
  getdeviceGroupList,
  getDeviceGroup,
  getDeviceStatistical,
  getDevicesStatistical,
} from "./webapi";
import { Trees, tryGet, getServerBaseUrl } from "@/kit";
import globalState from "../../../globalState";

const { generateListNew, getFirstChild, getParentKey } = Trees;
class Store {
  constructor() {
    makeAutoObservable(this);
  }
  firstKeys: any = [];
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
  deviceGroupData: any = [];

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
        subDeviceFlag: true,
        showThreeLevelChildDevice: true,
        emptyGroupFlag: true,
      };
      let res = await getDeviceGroup(params);
      this.getDeviceStatistical();
      await this.getDevicesStatistical();
      this.traverseAndModify(res);
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
      data = data.map((item) => {
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
      this.setCheckedKeys([]);
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
  getDeviceType = (data) => {
    if (data.deviceType === "IPC") {
      const cameraForm = tryGet(data, "deviceAttr.ipc.cameraForm");
      const deviceType = ["1", "2"].includes(cameraForm) ? "IPC_1" : "IPC_3";
      return deviceType;
    } else {
      return data.deviceType;
    }
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
