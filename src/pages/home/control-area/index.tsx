/**
 * 防控区
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
import classNames from "classnames";
import { tryGet } from "@/kit";
import ResponseModal from "../component/responseModal";
import { debounce } from "lodash";

const ControlArea = () => {
  const { deviceOpen, threePageData, responsibilityData } = store;
  const [peopleTypeList, setPeopleTypeList] = useState([
    { label: "民警", value: "policeTotal" },
    { label: "辅警", value: "auxiliaryPoliceTotal" },
    { label: "援警", value: "policeAidTotal" },
    { label: "保安", value: "securityStaffTotal" },
  ]);
  const [hasWorkGroup, setHasWorkGroup] = useState(true);
  const [currentUnit, setCurrentUnit] = useState("");
  const [showBox, setShowBox] = useState(false);
  const [ids, setIds] = useState([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [hasDevice, setHasDevice] = useState(false);
  useEffect(() => {
    setCurrentUnit("");
    store.leftVisible = true;
    store.getRelationResponsibilityArea();
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
    } = store.threePageData;
    const totalPeople =
      policeTotal + auxiliaryPoliceTotal + policeAidTotal + securityStaffTotal;
    const { map, distinctList } = buildingFloorDeviceDTO || {};
    return (
      <div className="base-info-wrap public-scrollbar">
        {illustrate?.length > 0 && (
          <>
            <TitleBar isNew={true}>说明</TitleBar>
            {illustrate.map((item) => (
              <div className="base-info-con">{item}</div>
            ))}
          </>
        )}
        {type && (
          <>
            {unit?.length > 0 && (
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
  const changeResponsibility = (grouplds?) => {
    try {
      store.removeAllFeature();
      setVisible(false);
      if (grouplds) {
        store.wordGroupByGroupId(grouplds);
      } else {
        store.getThreePage();
      }
    } catch (error) {}
  };
  return (
    <div className="box-con control-area-wrap">
      {!currentUnit && showBox && (
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

      <div className="unit-list-wrap">
        {currentUnit && (
          <div
            className="unit-li"
            onClick={() => {
              setCurrentUnit("");
              changeResponsibility();
            }}
          >
            返回
          </div>
        )}
        {responsibilityData
          .filter((item) => item.responsibleUnitNames)
          .map((item) => (
            <div
              className={classNames(
                "unit-li",
                currentUnit === item.id && "active"
              )}
              key={item.id}
              onClick={debounce(() => {
                setCurrentUnit(item.id);
                if (item.type == "inherent") {
                  store.inherentIds = item.id;
                } else {
                  store.temporaryIds = item.id;
                }
                changeResponsibility(item.workGroup);
                const { switchAnimation, visualAngle } = item;
                if (switchAnimation && visualAngle) {
                  const duration =
                    JSON.parse(switchAnimation).animationType != "0"
                      ? JSON.parse(switchAnimation).animationTime * 1000
                      : 0;
                  const rotation = JSON.parse(visualAngle).rotation;
                  store.viewer.flyTo({ ...rotation, duration });
                }
                store.removeAllFeature();
                setTimeout(() => {
                  store.featureDiagram([item], true, (e) => {
                    setVisible(true);
                  });
                }, 600);
              }, 600)}
            >
              {item.responsibleUnitNames || "-"}
            </div>
          ))}
      </div>
      <ResponseModal
        visible={visible && store.wordGroupData.length > 0}
        data={store.wordGroupData}
        setVisible={setVisible}
      />
      {currentUnit && (
        <div style={{ position: "absolute", left: 0 }}>
          <PolicAndEquipment
            deviceEnable={deviceOpen}
            level={2}
            isAllSelect={true}
          />
        </div>
      )}
    </div>
  );
};
export default observer(ControlArea);
