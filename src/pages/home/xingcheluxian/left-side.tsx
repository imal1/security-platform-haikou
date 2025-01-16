import React, { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import indexStore from "../store";
import store from "../store/xclx.store";
import { debounce } from "lodash";
import { Grid, Switch, Checkbox, Input, Form, Button, Message } from "@arco-design/web-react";
import { TitleBar } from "@/components";
import Title from "../component/title";
import IPC_3Url from "@/assets/img/home/IPC_3.png";
import IPC_1Url from "@/assets/img/home/IPC_1.png";
import BWCUrl from "@/assets/img/home/BWC.png";
import PADUrl from "@/assets/img/home/PAD.png";
import PTTUrl from "@/assets/img/home/PTT.png";
import { hasValue } from "@/kit";
import DeviceIcon from "../component/device-icon"
import { IconPauseCircle, IconPlayCircle } from "@arco-design/web-react/icon"
// import { IconIconSuspend, IconIconPlay } from "@arco-iconbox/react-hkzbh"
import PolicAndEquipment from '../police-and-equipment'
import globalState from "../../../globalState";
const InputSearch = Input.Search;
const FormItem = Form.Item;
const deviceImg = {
  IPC_3: IPC_3Url,
  IPC_1: IPC_1Url,
  BWC: BWCUrl,
  // TOLLGATE: TOLLGATEUrl,
  PAD: PADUrl,
  PTT: PTTUrl,
};
const deviceStatusList = [
  {
    label: "在线",
    value: "0",
    num: 118,
  },
  {
    label: "离线",
    value: "1",
    num: 18,
  },
  {
    label: "故障",
    value: "2",
    num: 28,
  },
];
const LeftSide = () => {
  const [form] = Form.useForm();
  const [searchStatus, setSearchStatus] = useState(null);
  // const { deviceTypes } = indexStore;
  const { routerDevices, deviceOpen, isReserveMode } = store;
  const { isPlay } = indexStore;
  // const { currentGbid, carDevice } = store;

  useEffect(() => {
    return () => {
      store.realTrack && store.realTrack.remove()
      store.realRouteTrack && store.realRouteTrack.remove()
      indexStore.changeState({
        deviceVisible: false,
        deviceCurrent: null,
      });
    };
  }, []);
  useEffect(() => {
    const { routeTrackMap, currentIndex } = store;
    const current = routeTrackMap.get(currentIndex);
    if (current) {
      if (isPlay) {
        store.resetSplitBuildGroup();
        store.routeTrackEvent(indexStore.follow);
      } else {
        current.pause();
        current.clearLabel();
        store.currentIndex = 0;
        indexStore.follow = false;
        store.follow = false;
        store.flyToRouteView();
        store.initRoute();
      }
      routeTrackMap.get(currentIndex)?.follow(store.currentRoute?.carType == 9 ? true : indexStore.follow);
    }
  }, [isPlay, store.routeTrackMap]);
  // 切换路线模式
  useEffect(() => {
    const { routeTrackMap, currentIndex } = store;
    store.initPlayDeviceList(true);
    if (store.isReserveMode) {
      // 预案推演模式
      setTimeout(() => {
        store.realTackPanelVisble = false;
      }, 1000);

      // if (store.routeTrackMap.size == 0) {
      //   store.initRoute();
      // }

      store.initRoute();
      store.realTrack && store.realTrack.remove()
      store.realRouteTrack && store.realRouteTrack.remove()
      store.changeState({
        realTrack: null,
        realRouteTrack: null
      })
      indexStore.isReal = false;
      indexStore.rightVisible = true;
      setTimeout(() => {
        store.flyToRouteView();
      }, 1000);
      // store.carDevice = "";
    } else {
      store.setRealModeRoute(true);

    }
  }, [store.isReserveMode])

  const getDeviceStatusNum = (type) => {
    const { routerDevices = {} } = store;
    const { device = [] } = routerDevices || {};
    if (device?.length) {
      const arr = device.filter((item) => item.status == type);
      return arr.length;
    } else {
      return 0;
    }
  };
  const formChange = () => {
    const values = form.getFieldsValue();
    const { name, status, type } = values;
    const params = {
      name,
      status: status ? status.join() : "",
      type: type ? type.join() : "",
    };
    setSearchStatus(hasValue(params));
    store.getDeviceRoute(params);
  };
  const onDetail = (row) => {
    indexStore.changeState({
      deviceVisible: true,
      deviceCurrent: row,
    });
  };
  return (
    <div className="box-con">
      <Title
        title={store.currentRoute?.featureName || "路线"}
        after={
          <Button
            // <IconIconPlay />
            icon={isPlay ? <IconPauseCircle /> : <IconPlayCircle />}
            style={{ display: isReserveMode ? "block" : "none" }}
            type="secondary"
            size="small"
            onClick={() => {
              indexStore.isPlay = !isPlay;
              if (isPlay) {
                const { routeTrackMap, currentIndex } = store;
                setTimeout(() => {
                  // routeTrackMap.get(currentIndex).follow(store.currentRoute?.carType == 9);
                  store.flyToRouteView();
                  // store.viewer.flyTo({
                  //   lng: 108.37876383814013,
                  //   lat: 22.816159150464543,
                  //   alt: 255.64391462068983,
                  //   x: -2119.0985304709234,
                  //   y: -2944.9604158572874,
                  //   z: 25564.391462068983,
                  //   pitch: -25.085721969604492,
                  //   heading: 207.6167449951172,
                  //   roll: 0,
                  //   duration: 2000,
                  // });
                }, 1000);
              }
            }}
          >
            {isPlay ? (store.currentRoute?.carType == 9 ? "结束行走" : "结束行驶") : (store.currentRoute?.carType == 9 ? "开始行走" : "车辆行驶")}
          </Button>
        } />
      <div className="device-attr-wrap">
        <TitleBar isNew={true}>
          <div className="tit-con">
            <label htmlFor="">预案推演模式</label>
            <Switch
              size="small"
              checked={isReserveMode}
              onChange={(val) => {
                store.isReserveMode = val;
              }}
            />
          </div>
        </TitleBar>
        {store.securityInstruction && (
          <>
            <TitleBar isNew={true}>
              <div className="tit-con">
                <label htmlFor="">路线说明</label>
              </div>
            </TitleBar>

            <div className="tit-desc">
              {store.securityInstruction || "无内容"}
            </div>
          </>)}
        <TitleBar isNew={true}>
          <div className="tit-con">
            <label htmlFor="">关联设备</label>
            <Switch
              size="small"
              checked={deviceOpen}
              onChange={(val) => {
                store.deviceOpen = val;
              }}
            />
          </div>
        </TitleBar>
        <div className="link-device-list">
          {
            store.routerDevices && Object.keys(store.routerDevices.deviceNum).map((key) => {
              return (
                <>
                  <div className="link-device-item">
                    <DeviceIcon type={key} num={store.routerDevices.deviceNum[key]} />
                  </div>
                </>
              )
            })
          }
        </div>
      </div>
      <PolicAndEquipment deviceEnable={deviceOpen} isGroupCall={false} />
      {/* <Form
        layout="vertical"
        form={form}
        style={{ padding: "0 10px 14px" }}
        onChange={debounce(formChange, 600)}
      >
        <Title
          title="领导参展路线"
          // after={
          //   <div className="device-switch">
          //     <label htmlFor="">设备上图</label>
          //     <Switch
          //       size="small"
          //       checked={deviceOpen}
          //       onChange={(val) => {
          //         store.deviceOpen = val;
          //       }}
          //     />
          //   </div>
          // }
        />
        <div className="device-attr-wrap">
          <TitleBar>
            <div className="tit-con">
              <label htmlFor="">设备类型</label>
            </div>
          </TitleBar>
          <FormItem
            field="type"
            style={{ marginBottom: 0 }}
            initialValue={deviceTypes.map((item) => item.value)}
          >
            <Checkbox.Group className={"device-type-wrap"}>
              {deviceTypes.map((item) => {
                return (
                  <Checkbox key={item.value} value={item.value}>
                    {({ checked }) => {
                      return (
                        <div
                          className={classNames(
                            "device-type-item",
                            checked && "checked"
                          )}
                        >
                          <div className="device-pic">
                            <img src={deviceImg[item.value]} />
                          </div>
                          <div className="device-con">
                            <Checkbox value={checked}>{item.label}</Checkbox>
                            <div className="device-num">
                              {routerDevices?.deviceNum[item.value] || 0}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </FormItem>

          <TitleBar>
            <div className="tit-con">
              <label htmlFor="">设备状态</label>
              <div
                className="oper"
                onClick={() => {
                  formChange();
                }}
              >
                <span>刷新</span>
                <div className="refresh"></div>
              </div>
            </div>
          </TitleBar>
          <FormItem
            field="status"
            style={{ marginBottom: 0 }}
            initialValue={deviceStatusList.map((item) => item.value)}
          >
            <Checkbox.Group className={"device-status-wrap"}>
              {deviceStatusList.map((item) => {
                return (
                  <Checkbox key={item.value} value={item.value}>
                    {({ checked }) => {
                      return (
                        <div
                          className={classNames(
                            "device-status-item",
                            checked && "checked",
                            item.value === "1" && "offline",
                            item.value === "2" && "fault"
                          )}
                        >
                          <div className="device-label">{item.label}</div>
                          <div className="device-con">
                            <Checkbox value={checked}>
                              <span>{getDeviceStatusNum(item.value)}</span>
                            </Checkbox>
                          </div>
                        </div>
                      );
                    }}
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </FormItem>
        </div>

        <div style={{ display: "flex" }}>
          <FormItem field="name" style={{ marginBottom: 0 }}>
            <InputSearch
              autoComplete="off"
              allowClear
              placeholder="请输入设备名称搜索"
              size="large"
              onSearch={(val) => {
                formChange();
              }}
            />
          </FormItem>
        </div>
      </Form>
      <DeviceList
        dataSourse={routerDevices?.device || []}
        loading={false}
        searchStatus={searchStatus}
        onDetail={onDetail}
      /> */}
    </div>
  );
};
const ObserverLeftSide = observer(LeftSide);
export default ObserverLeftSide;
