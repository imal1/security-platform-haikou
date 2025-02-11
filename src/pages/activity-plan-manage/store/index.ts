import { makeAutoObservable, runInAction } from "mobx";
import { Message } from "@arco-design/web-react";

import { tryGet } from "kit";

import { getParams } from "./webapi";

class Store {
  constructor() {
    makeAutoObservable(this);
  }
  tableForm: any = null;
  dataStatus: boolean = false;
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
        tableForm: null,
        dataStatus:false,
        ...params,
      });
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
