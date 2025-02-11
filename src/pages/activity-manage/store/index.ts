import { hasValue } from "kit";
import { makeAutoObservable } from "mobx";
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
        modalVisible: false,
        dataSource: [{ id: "2" }],
        loading: true,
        pager: {
          pageSize: 10,
          current: 1,
          total: 0,
        },
        dataStatus: false,
        current: null,
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
        pageSize: this.pager.pageSize,
        pageNo: this.pager.current,
      };
      // let res = await roadPage(params);
      this.changeState({
        // pager: {
        //   ...this.pager,
        //   total: res.total,
        // },
        loading: false,
        // dataSource: res.data,
      });
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
