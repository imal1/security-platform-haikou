import { hasValue } from "kit";
import { makeAutoObservable } from "mobx";
import * as webapi from "./webapi";

class Store {
  constructor() {
    makeAutoObservable(this);
  }
  tableForm: any = null;
  dataStatus: boolean = false;
  dataSource: any = [];
  activityTypes: any = [];
  /**
   *初始化数据
   *
   * @memberof Store
   */
  initialData = async (params?) => {
    try {
      this.initialVariable(params);
      this.getActivityTypes();
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
        dataStatus: false,
        dataSource: [],
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
        ...values.date,
      };
      delete params.date;
      let res = await webapi.getActivityList(params);
      this.dataSource = res;
    } catch (error) {}
  };
  //获取活动类型
  getActivityTypes = async () => {
    try {
      const res = await webapi.getActivityTypes();
      this.activityTypes = res;
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
