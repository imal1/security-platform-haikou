import { observer } from "mobx-react";

import SelectMemberDeviceView from "@/components/select-member/device";
import appStore from "@/store";
import { getSolution } from "kit";
import { useEffect, useRef, useState } from "react";
import {
  ComponentFrame,
  GroupCall,
  UePreview,
  VideoAssess,
} from "../../components";
import SelectMemberView from "../../components/select-member";
import globalState from "../../globalState";
import AntiTerrorismPrevention from "./anti-terrorism-prevention";
import Checkpoint from "./checkpoint";
import Footer from "./component/footer";
import HistoryTrack from "./component/history-track";
import HistoryTrackSetting from "./component/history-track-setting";
import Toolbox from "./component/toolbox";
import ControlArea from "./control-area";
import "./index.less";
import MobileStandby from "./mobile-standby";
import Overview from "./overview";
import ResponsibilityArea from "./responsibility-area";
import SouYe from "./souye";
import AddModifyPoliceRemark from "./souye/add-modify-police-remark";
import DrawPoliceRemark from "./souye/draw-police-remark";
import SecurityAreaInfo from "./souye/security-area-info";
import store from "./store";
import XingCheLuXian from "./xingcheluxian";
// import DeviceFilter from "../place-manage/component/ele-store/device-filter";

const list = [
  {
    label: "鹰眼地图",
    value: "viewChange",
  },
];
const Home = () => {
  // const [visible, setVisible] = useState(true);
  const newPageVideo = window.globalConfig["newPageVideo"];
  const [active, setActive] = useState("");
  const menuRef = useRef<HTMLDivElement>(null); // 创建引用
  useEffect(() => {
    store.initialData();
    store.getFirstMenu();
    appStore.sendMessage({ type: "non-route" });
    localStorage.removeItem("pageRoute");
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        store.changeState({
          isMenu: false,
          currentDevice: null,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (store.rightVisible) {
      setLinkMapVisible(false);
      setActive("");
    }
  }, [store.rightVisible]);
  useEffect(() => {
    if (active) {
      store.rightVisible = false;
    }
  }, [active]);
  useEffect(() => {
    if (!store.deviceVisible) {
      store.onlyPlay = false;
    }
  }, [store.deviceVisible]);
  useEffect(() => {
    if (store.track && tab === "VEHICLE_ROUTE" && childTab) return;
    if (store.deviceCurrent && store.deviceVisible) {
      let list = [];
      if (Array.isArray(store.deviceCurrent)) {
        list = store.deviceCurrent;
      } else {
        list = [store.deviceCurrent];
      }
      const playList = list.map((item) => {
        const { gbid, status, title, name, deviceType, deviceName } = item;
        return {
          gbid,
          status,
          title,
          deviceType,
          name,
          deviceName,
        };
      });
      appStore.sendMessage(playList);
    }
  }, [store.deviceCurrent, store.deviceVisible]);
  const onLoad = (result) => {
    console.log("result", result);
    store.changeState({
      viewer: result.ue,
    });

    globalState.set({ globalViewer: result.ue });
    console.log("globalState", globalState);
  };
  const {
    tab,
    deviceVisible,
    setDeviceVisible,
    deviceCurrent,
    rightVisible,
    callVisible,
    selectMemberVisible,
    selectMemberDeviceVisible,
    childTab,
    onlyPlay,
    buildList1,
    buildList2,
    currentBuild,
    currentKey,
    trackType,
    componentFrameVisible,
    homeSecurityInfoVisible,
    homePoliceRemarkVisible,
    currentFrameStyle,
    currentDevice,
  } = store;
  const setLinkMapVisible = (visible: boolean) => {
    store.changeState({
      linkMapVisible: visible,
    });
  };
  useEffect(() => {
    if (trackType) {
      store.changeState({
        linkMapDisable: true,
        linkMapVisible: false,
      });
    } else {
      store.changeState({
        linkMapDisable: false,
      });
    }
  }, [tab, trackType]);
  return (
    <div className="page-container home-wrap">
      <UePreview solution={getSolution()} onLoad={onLoad} />
      {tab === "sy" && <SouYe />}
      {tab !== "sy" && !childTab && <Overview />}
      {tab === "VEHICLE_ROUTE" && childTab && <XingCheLuXian />}
      {tab === "CONTROL_AREA" && childTab && <ControlArea />}
      {tab === "RESPONSIBILITY_AREA" && childTab && <ResponsibilityArea />}
      {tab === "CHECKPOINT" && childTab && <Checkpoint />}
      {tab === "MOBILE_STANDBY" && childTab && <MobileStandby />}
      {tab === "ANTI_TERRORISM_PREVENTION" && childTab && (
        <AntiTerrorismPrevention />
      )}
      {childTab && buildList2?.length > 0 && (
        <div className="change-build">
          {currentKey == "1" && (
            <div
              className="change-li"
              onClick={() => {
                store.removeAllFeature();
                store.resetSplitBuildGroup();
                setTimeout(() => {
                  store.featureDiagram(store.floorTwoList);
                  store.currentBuild = buildList2;
                  store.currentKey = "2";
                  store.splitBuildGroup(buildList2);
                }, 600);
              }}
            >
              查看其他楼层数据
            </div>
          )}
          {currentKey == "2" && (
            <div
              className="change-li"
              onClick={() => {
                store.removeAllFeature();
                store.resetSplitBuildGroup();
                setTimeout(() => {
                  store.featureDiagram(store.floorOneList);
                  store.currentBuild = buildList1;
                  store.currentKey = "1";
                  store.splitBuildGroup(buildList1);
                }, 600);
              }}
            >
              返回
            </div>
          )}
        </div>
      )}
      <Footer />
      {store.trackVisible && <HistoryTrack />}

      {store.historyVisible && <HistoryTrackSetting />}
      {callVisible && (
        <GroupCall
          visible={callVisible}
          params={{
            meetingMember: store.selectedMembers,
            addMeetingMember: store.addSelectedMemberKeys,
          }}
          title={store.callTitle}
          setVisible={(val) => {
            store.callVisible = val;
          }}
        />
      )}
      {selectMemberVisible && (
        <SelectMemberView
          visible={selectMemberVisible}
          selectedMemberKeys={store.selectedMembers}
          addOrInvite={store.addOrInvite}
          setSelectedMemberKeys={(keys) => {
            store.selectedMembers = keys;
          }}
          setAddSelectedMemberKeys={(keys) => {
            store.selectedMembers = keys;
          }}
          setVisible={(val) => {
            store.selectMemberVisible = val;
          }}
        />
      )}
      {selectMemberDeviceVisible && (
        <SelectMemberDeviceView
          visible={selectMemberDeviceVisible}
          selectedMemberKeys={store.selectedMembers}
          addOrInvite={store.addOrInvite}
          setSelectedMemberKeys={(keys) => {
            store.selectedMembers = keys;
          }}
          setAddSelectedMemberKeys={(keys) => {
            store.selectedMembers = keys;
          }}
          setVisible={(val) => {
            store.selectMemberDeviceVisible = val;
          }}
          isAllDevice={store.isAllDevice}
        />
      )}
      {/* <DevicePerspective onChange={store.setDevicePerspective} /> */}
      {!newPageVideo && (
        <VideoAssess
          data={deviceCurrent}
          visible={deviceVisible}
          setVisible={setDeviceVisible}
        />
      )}
      <ComponentFrame
        visible={componentFrameVisible}
        setVisible={(val) => {
          store.componentFrameVisible = val;
        }}
        popFrameStyle={currentFrameStyle}
      />
      <Toolbox />
      {
        // 安保信息弹框
        <SecurityAreaInfo
          visible={store.homeSecurityInfoVisible}
          setVisible={(val) => {
            store.homeSecurityInfoVisible = val;
          }}
        />
      }
      {
        // 新增编辑警情信息弹框
        <AddModifyPoliceRemark
          visible={store.homePoliceRemarkVisible}
          setVisible={(val) => {
            store.homePoliceRemarkVisible = val;
          }}
        />
      }
      {<DrawPoliceRemark />}
      {store.isMenu && (
        <div
          className={"menu-detail-wrap"}
          id="fixMenu"
          ref={menuRef}
          style={{
            left: store.menuPoint.x + 10,
            top: store.menuPoint.y + 10,
          }}
        >
          <div
            onClick={() => {
              store.callVisible = true;
              store.addOrInvite = 0;
              store.callTitle = "通话组会";
              store.selectedMembers = [
                { ...currentDevice, type: currentDevice.deviceType },
              ];
              store.changeState({
                isMenu: false,
                currentDevice: null,
              });
            }}
          >
            通话组会
          </div>
        </div>
      )}
    </div>
  );
};
const ObserverHome = observer(Home);
export default ObserverHome;
