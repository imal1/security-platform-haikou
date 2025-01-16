import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@arco-design/web-react";
import { IconClose, IconDelete } from "@arco-design/web-react/icon";
import exclamationCircle from "@/assets/img/exclamationCircle.png";
import globalState from "@/globalState";
import "./index.less";
import classNames from "classnames";

interface ChangeViewProps {
  viewer: any;
  geometryObj: any;
  visiable: boolean;
  className?: string;
  geometryPosition?: any;
  elementType?: string;
}
const ChangeView = (props: ChangeViewProps) => {
  const { viewer, geometryObj, visiable = false, className, geometryPosition, elementType } = props;
  const [isView, setIsView] = useState(true);
  const [changeStatus, setChangeStatus] = useState(false);
  const [isMain, setIsMain] = useState(true);
  const [mainViewObj, setMainViewObj]: any = useState(
    globalState.get("mainView")
  );
  useEffect(() => {
    setIsView(props.visiable);
    if (props.visiable) {
      setMainViewObj(globalState.get("mainView"));
    }
  }, [props.visiable]);
  /**
   * 切换视角
   * @param type 是否是主视角
   */
  const changeView = async (type) => {
    try {
      if (type) {
        viewer.flyTo(mainViewObj);
        setIsMain(true);
      } else {
        const cameraInfo = await viewer.getCameraInfo();
        if (isMain) {
          setMainViewObj(cameraInfo);
        }
        setIsMain(false);
        if (geometryObj) {
          let center;
          if (elementType && elementType == "model") {
            center = geometryObj.getCenter("model");
          } else {
            center = geometryObj.getCenter();
          }

          viewer.flyTo({
            ...cameraInfo,
            lng: center[0] || center.lng,
            lat: center[1] || center.lat,
            pitch: -90,
            alt: 200,
          });
        } else if (geometryPosition) {
          viewer.flyTo({
            ...cameraInfo,
            lng: geometryPosition.lng,
            lat: geometryPosition.lat,
            pitch: -90,
            alt: 200,
          });
        } else {
          viewer.flyTo({
            ...cameraInfo,
            pitch: -90,
            alt: 200,
          });
        }
      }
    } catch (error) { }
  };
  return (
    <div
      className={classNames("change-view-wrap", className)}
      style={{ display: isView ? "flex" : "none" }}
    >
      <img src={exclamationCircle} width={20} alt="" />
      {changeStatus ? (
        <div className="change-box">
          <label htmlFor="">当前查看视角：</label>
          <Button
            type="secondary"
            size="small"
            onClick={() => {
              changeView(false);
            }}
          >
            俯视角
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              changeView(true);
            }}
          >
            主视角
          </Button>
        </div>
      ) : (
        <div className="change-box">
          <label htmlFor="">编辑要素时，建议使用俯视视角。</label>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setChangeStatus(true);
            }}
          >
            切换视角
          </Button>
        </div>
      )}

      <IconClose
        onClick={() => {
          setIsView(false);
          setChangeStatus(false);
        }}
      />
    </div>
  );
};
export default ChangeView;
