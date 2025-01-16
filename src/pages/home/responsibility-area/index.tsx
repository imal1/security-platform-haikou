/**
 * 责任区
 */
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../store";
import LeftBox from "../component/left-box";
import { TitleBar } from "@/components";
import Title from "../component/title";
import { Switch } from "@arco-design/web-react";
import DeviceIcon from "../component/device-icon";
import PolicAndEquipment from "../police-and-equipment";
import PerceptionDevice from "../police-and-equipment/perception-device";
import PoliceDeployment from "../souye/police-deployment";
import policeUrl from "@/assets/img/home/police.png";
import { imgOnError } from "@/kit";
const ResponsibilityArea = () => {
  const { deviceOpen, threePageData } = store;
  const [hasWorkGroup, setHasWorkGroup] = useState(true);
  const [showBox, setShowBox] = useState(false);
  const [ids, setIds] = useState([]);
  const [hasDevice, setHasDevice] = useState(false);
  useEffect(() => {
    store.leftVisible = true;
  }, [store.childTab]);
  useEffect(() => {
    if (store.threePageData) {
      const {
        workGroupDTOS = [],
        buildingFloorDeviceDTO,
        featureInfoInherentVOList,
      } = store.threePageData;
      const { map } = buildingFloorDeviceDTO || {};
      const ids = featureInfoInherentVOList.map((item) => item.id);
      setIds(ids);
      const type = workGroupDTOS.length > 0;
      const hasDevice = Object.keys(map).length > 0;
      setHasDevice(hasDevice);
      if (!type && !hasDevice) {
        setShowBox(false);
      } else {
        setShowBox(true);
      }
      setHasWorkGroup(type);
    }
  }, [store.threePageData]);
  const workGroupDom = (type = true) => {
    const {
      illustrate = [],
      buildingFloorDeviceDTO,
      workGroupDTOS = [],
    } = store.threePageData;
    const { map } = buildingFloorDeviceDTO || {};
    return (
      <div className="base-info-wrap public-scrollbar">
        {type && (
          <>
            <TitleBar isNew={true}>人员信息</TitleBar>
            {workGroupDTOS.map((item) => (
              <div key={item.id}>
                <div className="base-info-con people-info-wrap">
                  <div className="people-pic">
                    <img
                      src={item.picUrl || policeUrl}
                      onError={(e) => imgOnError(e, policeUrl)}
                    />
                  </div>
                  <div className="people-info">
                    <div className="people-info-li">
                      <div className="people-info-li-label">责任单位</div>
                      <div className="people-info-li-value">
                        {item.orgCodeName || "-"}
                      </div>
                    </div>
                    <div className="people-info-li">
                      <div className="people-info-li-label">组长</div>
                      <div className="people-info-li-value">
                        {item.groupLeaderName || "-"}
                      </div>
                    </div>
                    <div className="people-info-li">
                      <div className="people-info-li-label">岗位</div>
                      <div className="people-info-li-value">
                        {item.situation || "-"}
                      </div>
                    </div>
                    <div className="people-info-li">
                      <div className="people-info-li-label">对讲机</div>
                      <div className="people-info-li-value">
                        {item.devicePttName || "无"}
                      </div>
                    </div>
                    <div className="people-info-li">
                      <div className="people-info-li-label">执法仪</div>
                      <div className="people-info-li-value">
                        {item.deviceBwcName || "无"}
                      </div>
                    </div>
                    <div className="people-info-li">
                      <div className="people-info-li-label">警务通</div>
                      <div className="people-info-li-value">
                        {item.devicePadName || "无"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {workGroupDTOS?.some((item) => item.taskContent) && (
              <TitleBar isNew={true}>任务内容</TitleBar>
            )}
            {workGroupDTOS
              ?.filter((item) => item.taskContent)
              .map((taskinfo) => {
                return (
                  <div className="base-info-con">{taskinfo.taskContent}</div>
                );
              })}
            {workGroupDTOS.some((item) => item.mainJob) && (
              <>
                <TitleBar isNew={true}>主要职责</TitleBar>
                {workGroupDTOS
                  .filter((item) => item.mainJob)
                  .map((item) => (
                    <div className="base-info-con">{item.mainJob}</div>
                  ))}
              </>
            )}
          </>
        )}
        {!type && (
          <>
            {illustrate?.length > 0 && (
              <>
                <TitleBar isNew={true}>说明</TitleBar>
                {illustrate.map((item) => (
                  <div className="base-info-con">{item}</div>
                ))}
              </>
            )}
          </>
        )}
        {Object.keys(map).length > 0 && (
          <>
            <TitleBar isNew={true}>感知设备(台)</TitleBar>
            <div className="link-device-list">
              {Object.keys(map).map((key) => {
                return (
                  <>
                    <div className="link-device-item">
                      <DeviceIcon type={key} num={map[key]} />
                    </div>
                  </>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };
  return (
    <div className="box-con control-area-wrap">
      {showBox && (
        <LeftBox>
          <Title
            title={store.getTabName()}
            after={
              hasDevice ? (
                <div className="after-con">
                  <div className="after-label">关联设备图层</div>
                  <Switch
                    size="small"
                    checked={deviceOpen}
                    onChange={(val) => {
                      store.deviceOpen = val;
                    }}
                  />
                </div>
              ) : (
                ""
              )
            }
          />
          {threePageData && workGroupDom(hasWorkGroup)}
          {hasWorkGroup && hasDevice && (
            <PolicAndEquipment
              deviceEnable={deviceOpen}
              level={2}
              isAllSelect={true}
            />
          )}
          {!hasWorkGroup && hasDevice && (
            <div className="arrange-wrap">
              <PerceptionDevice
                arrangeValue={"gzsb"}
                deviceEnable={deviceOpen}
              />
            </div>
          )}
          {hasWorkGroup && !hasDevice && (
            <PoliceDeployment
              arrangeValue={"jlbs"}
              level={2}
              isGroupCall={true}
              isAllSelect={true}
            />
          )}
        </LeftBox>
      )}
    </div>
  );
};
export default observer(ResponsibilityArea);
