/**
 * 反恐防范
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

const excludeCode = [
  "SPECIAL_POLICE_PATROL_VEHICLE",
  "POLICE_FORCE_CRASH_PREVENTION",
];
const AntiTerrorismPrevention = () => {
  const { deviceOpen, threePageData } = store;
  const [hasWorkGroup, setHasWorkGroup] = useState(true);
  const [peopleTypeList, setPeopleTypeList] = useState([
    { label: "民警", value: "policeTotal", num: "" },
    { label: "辅警", value: "auxiliaryPoliceTotal", num: "" },
    { label: "援警", value: "policeAidTotal", num: "" },
    { label: "保安", value: "securityStaffTotal", num: "" },
  ]);
  const [taskInfoList, setTaskInfoList] = useState<Array<string>>([]);
  const [showBox, setShowBox] = useState(false);
  const [ids, setIds] = useState([]);
  const [hasDevice, setHasDevice] = useState(false);

  useEffect(() => {
    store.leftVisible = true;
  }, [store.childTab]);
  useEffect(() => {
    if (!threePageData) return;
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
    } else if (excludeCode.includes(store.childTab) && !type) {
      setShowBox(false);
    } else {
      setShowBox(true);
    }
    setHasWorkGroup(type);
    peopleTypeList.map((item) => {
      if (threePageData[item.value]) {
        item.num = threePageData[item.value];
      }
    });
    // 暂无任务数据，后续修改
    setTaskInfoList(threePageData.illustrate || []);
  }, [threePageData]);
  const workGroupDom = (type = true) => {
    const {
      buildingFloorDeviceDTO,
      unit = [],
      workGroupDTOS = [],
    } = store.threePageData;
    const { map, distinctList } = buildingFloorDeviceDTO || {};
    return (
      <div className="base-info-wrap public-scrollbar">
        {(type || excludeCode.includes(store.childTab)) && (
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

            {peopleTypeList.some((item) => {
              return item.num;
            }) && (
              <>
                <TitleBar isNew={true}>警力部署(人)</TitleBar>
                <div className="base-info-con">
                  {peopleTypeList.map(
                    (item) =>
                      item.num && (
                        <div className="police-depoly-li" key={item.value}>
                          <div className="police-depoly-li-label">
                            {item.label}
                          </div>
                          <div className="police-depoly-li-value">
                            {item.num}
                          </div>
                        </div>
                      )
                  )}
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
          {hasWorkGroup &&
            hasDevice &&
            !excludeCode.includes(store.childTab) && (
              <PolicAndEquipment
                deviceEnable={deviceOpen}
                level={2}
                isAllSelect={true}
              />
            )}
          {!hasWorkGroup &&
            hasDevice &&
            !excludeCode.includes(store.childTab) && (
              <div className="arrange-wrap">
                <PerceptionDevice
                  arrangeValue={"gzsb"}
                  deviceEnable={deviceOpen}
                />
              </div>
            )}
          {hasWorkGroup &&
            (!hasDevice || excludeCode.includes(store.childTab)) && (
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
export default observer(AntiTerrorismPrevention);
