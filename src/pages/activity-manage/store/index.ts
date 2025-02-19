import { Message } from "@arco-design/web-react";
import { hasValue, Trees } from "kit";
import { makeAutoObservable } from "mobx";
import * as webapi from "./webapi";
const { convertTreeKeyToString, generateListNew } = Trees;
class Store {
  constructor() {
    makeAutoObservable(this);
  }
  modalVisible: boolean = false;
  dataSource: any = [];
  loading: boolean = true;
  tableForm: any = null;
  pager: any = {
    pageSize: 10,
    current: 1,
    total: 0,
  };
  dataStatus: boolean = false;
  current: any = null;
  modalInfoVisible: boolean = false;
  areaTree: Array<any> = []; //区域树
  departmentTree: Array<any> = []; //责任单位
  activityTypes: any = [];
  activityPersonSize: any = [];
  securityLevelData: any = [];
  organizerTypes: any = [];
  sceneList: any = [];
  departmentData: any = [];
  /**
   *初始化数据
   *
   * @memberof Store
   */
  initialData = async (params?) => {
    try {
      this.initialVariable(params);
      this.getRbacDepartmentTree();
      this.getActivityTypes();
      this.getActivityPersonSize();
      this.getActivitySecurityLevel();
      this.getActivityOrganizerTypes();
      this.getSceneList();
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
        modalVisible: false,
        // dataSource: [{ id: "2" }],
        loading: true,
        pager: {
          pageSize: 10,
          current: 1,
          total: 0,
        },
        dataStatus: false,
        current: null,
        modalInfoVisible: false,
        areaTree: [],
        departmentTree: [],
        ...params,
      });
    } catch (error) {}
  };

  getList = async () => {
    try {
      const values = this.tableForm.getFieldsValue();
      this.dataStatus = hasValue(values);
      let params = {
        ...values,
      };
      // let res = await roadPage(params);
    } catch (error) {}
  };
  pagerChange = (pageNumber, pageSize) => {
    this.changeState({
      pager: {
        ...this.pager,
        pageSize,
        current: pageNumber,
      },
    });
  };
  clearPager = () => {
    this.changeState({
      pager: {
        pageSize: 10,
        current: 1,
        total: 0,
      },
    });
  };
  //获取行政区域
  getRegionAndChildren = async () => {
    try {
      const res = await webapi.getRegionAndChildren({ regionId: "460100" });
      const data = convertTreeKeyToString([res], "id");
      this.areaTree = data;
    } catch (error) {}
  };
  //获取单位
  getRbacDepartmentTree = async () => {
    try {
      const res = await webapi.getRbacDepartmentTree();
      this.departmentTree = res;
      let departmentData = [];
      generateListNew(res, departmentData);
      this.departmentData = departmentData;
    } catch (error) {}
  };
  //获取活动类型
  getActivityTypes = async () => {
    try {
      const res = await webapi.getActivityTypes();
      this.activityTypes = res;
    } catch (error) {}
  };
  //获取活动人员规模
  getActivityPersonSize = async () => {
    try {
      const res = await webapi.getActivityPersonSize();
      this.activityPersonSize = res;
    } catch (error) {}
  };
  //获取活动安保等级
  getActivitySecurityLevel = async () => {
    try {
      const res = await webapi.getActivitySecurityLevel();
      this.securityLevelData = res;
    } catch (error) {}
  };
  //获取举办方类型
  getActivityOrganizerTypes = async () => {
    try {
      const res = await webapi.getActivityOrganizerTypes();
      this.organizerTypes = res;
    } catch (error) {}
  };
  //获取举办方类型
  addActivity = async (params) => {
    try {
      await webapi.addActivity(params);
      Message.success("新增成功");
    } catch (error) {}
  };
  getSceneList = async () => {
    try {
      const res = await webapi.getSceneList();
      this.sceneList = res;
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
