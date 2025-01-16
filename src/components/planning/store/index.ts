import { makeAutoObservable, runInAction } from "mobx";
import { Message } from "@arco-design/web-react";

import { tryGet, deep } from "@/kit";

import { getJurisdictionArea } from "./webapi";
import homeStore from "../../../store";

class Store {
  constructor() {
    makeAutoObservable(this);
  }
  formObj: any = null;
  startPoint: any = {};
  endPoint: any = {};
  wayPoint: any[]; //途经点
  pointTemp: any = {
    name: "",
    point: null,
  };
  wayMaxNum: number = 6;
  addressList: any[] = []; //搜索地址列表
  currentKey: string = ""; //当前操作的表单项key
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
        startPoint: null,
        endPoint: null,
        wayPoint: [],
        addressList: [],
        ...params,
      });
    } catch (error) {}
  };
  //添加途经点
  addWayPoint = () => {
    let data = deep(this.wayPoint);
    data.push({ ...this.pointTemp, key: new Date().getTime() });
    this.wayPoint = data;
  };
  //删除途经点
  reduceWayPoint = (key) => {
    let data = deep(this.wayPoint);
    let index = data.findIndex((item) => item.key === key);
    if (index > -1) {
      this.formObj.setFieldValue(`way_${key}`, null);
      data.splice(index, 1);
      this.wayPoint = data;
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
