import { observer } from "mobx-react";
import store from "../store";
import { useEffect } from "react";
import { deep } from "@/kit";
import globalState from "@/globalState";
/**
 * 总览页面
 */
const Overview = () => {
  const navView = globalState.get("navView") || [];
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      if (store.viewer) {
        store.removeAllFeature();
        const mainView = globalState.get("mainView");
        const row = navView.find((item) => item.value === store.tab);
        const view = row?.view || null;
        if (store.featureInfoInherentVOList?.length > 0) {
          setTimeout(() => {
            store.featureDiagram(deep(store.featureInfoInherentVOList));
          }, 500);
        }
        if (view) {
          store.flyTo(view);
        } else {
          if (["RESPONSIBILITY_AREA", "MOBILE_STANDBY"].includes(store.tab)) {
            store.flyTo({
              ...mainView,
              pitch: -90,
              alt: 60,
            });
          } else {
            store.flyTo(view || mainView);
          }
        }
      }
    }, 200);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    store.featureInfoInherentVOList,
    store.tab,
    store.viewer,
    // store.buildingId,
  ]);
  useEffect(() => {
    return () => {
      store.removeAllFeature();
    };
  }, []);
  return <div className="overview-wrap"></div>;
};
export default observer(Overview);
