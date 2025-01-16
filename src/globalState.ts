import { makeAutoObservable, runInAction } from "mobx";
class GlobalState {
  state: any = {}; // 初始全局状态
  constructor() {
    makeAutoObservable(this);
  }
  solution: any = null;
  baseUrl: any = null;
  userInfo: any = null;
  serviceRoutes: any = null;
  systemSolutions: any = null;
  spriteType: string = "";
  globalViewer: any = null;
  mainView: any = null;
  buildingView: any = null;
  eventVenueInfo: any = {};
  dahuoUserInfo: any = {
    username: "gisTest",
  };
  location: any = {};
  ueConfig: any = {};
  compressionZoom: number = 17;
  // userInfo:any ={}
  /**
   *
   * @param key 需要获取的状态键名，不传则获取完整的状态
   */
  get = (key?: string) => {
    if (key) return this.state[key];
    return this.state;
  };
  /**
   *
   * @param newState 需要更新的状态，参数必须为一个对象，否则不生效
   */
  set = (newState: any) => {
    if (typeof newState === "object") {
      runInAction(() => {
        Object.assign(this.state, newState);
      });
    }
  };
}

let isSetState = false;
let globalState: any;
if (!isSetState) {
  globalState = new GlobalState();
  isSetState = true;
}

interface globalStateProps {
  state: any;
  get: any;
  set: any;
}

export const get = globalState.get;
export const set = globalState.set;
export const coverGlobalState = (newGlobalState: globalStateProps) => {
  Object.entries(newGlobalState).map((item) => {
    const [key, value] = item;
    globalState[key] = value;
  });
};
export default globalState;
