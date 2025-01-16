/**
 * 检查站
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

const Checkpoint = () => {
  const { deviceOpen, threePageData } = store;
  const [hasWorkGroup, setHasWorkGroup] = useState(true);
  const [peopleTypeList, setPeopleTypeList] = useState([
    { label: "民警", value: "policeTotal" },
    { label: "辅警", value: "auxiliaryPoliceTotal" },
    { label: "援警", value: "policeAidTotal" },
    { label: "保安", value: "securityStaffTotal" },
  ]);
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
      unit = [],
      responsibility,
      featureInfoInherentVOList,
      buildingFloorDeviceDTO,
      policeTotal = 0,
      auxiliaryPoliceTotal = 0,
      policeAidTotal = 0,
      securityStaffTotal = 0,
      workGroupDTOS = [],
    } = store.threePageData;
    const totalPeople =
      policeTotal + auxiliaryPoliceTotal + policeAidTotal + securityStaffTotal;
    const { map, distinctList } = buildingFloorDeviceDTO || {};
    return (
      <div className="base-info-wrap public-scrollbar">
        {type && (
          <>
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

            {unit.length > 0 && (
              <>
                <TitleBar isNew={true}>责任单位</TitleBar>
                <div className="base-info-con">{unit.join("、")}</div>
              </>
            )}
            {totalPeople && (
              <>
                <TitleBar isNew={true}>警力部署(人)</TitleBar>
                <div className="base-info-con">
                  {peopleTypeList.map((item) => (
                    <div
                      className="police-depoly-li"
                      style={{
                        display:
                          store.threePageData[item.value] > 0 ? "flex" : "none",
                      }}
                      key={item.value}
                    >
                      <div className="police-depoly-li-label">{item.label}</div>
                      <div className="police-depoly-li-value">
                        {store.threePageData[item.value]}
                      </div>
                    </div>
                  ))}
                </div>
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
export default observer(Checkpoint);
