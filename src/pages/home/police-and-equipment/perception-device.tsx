import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  Form,
  Input,
  Tag,
  Checkbox,
  Tooltip,
  Button,
} from "@arco-design/web-react";
import { IconFile } from "@arco-design/web-react/icon";
import { KArcoTree, NoData, FilterModal, TitleBar } from "@/components";
import { tryGet, Icons, deep, hasValue } from "@/kit";
import { observer } from "mobx-react";
import store from "../store";
import iconRefreshUrl from "@/assets/img/icon-refresh.png";
import iconRefreshHoverUrl from "@/assets/img/icon-refresh-hover.png";
import classNames from "classnames";
import { debounce } from "lodash";
import DeviceList from "./device-list";
const FormItem = Form.Item;
const InputSearch = Input.Search;
const { Row, Col } = Grid;
const deviceStatus = Icons.deviceStatus;
const CheckboxGroup = Checkbox.Group;
const deviceStatusList = [
  {
    label: "在线",
    value: "0",
  },
  {
    label: "离线",
    value: "1",
  },
  {
    label: "故障",
    value: "2",
  },
];

const PerceptionDevice = ({ arrangeValue, deviceEnable }) => {
  const [form] = Form.useForm();
  const [searchStatus, setSearchStatus] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const { deviceTypes, deviceTypeKeys, deviceStatusKeys, deviceList } = store;

  useEffect(() => {
    return () => {
      store.changeState({
        deviceList: null,
      });
    };
  }, []);
  useEffect(() => {
    formChange();
  }, [
    store.temporaryIds,
    store.inherentIds,
    inputValue,
    store.deviceStatusKeys,
    store.deviceTypeKeys,
  ]);
  const formChange = () => {
    if (!store.temporaryIds && !store.inherentIds) return;
    const params = {
      temporaryIds: Array.isArray(store.temporaryIds)
        ? store.temporaryIds.join()
        : store.temporaryIds,
      inherentIds: Array.isArray(store.inherentIds)
        ? store.inherentIds.join()
        : store.inherentIds,
      name: inputValue,
      status: store.deviceStatusKeys ? store.deviceStatusKeys.join() : "",
      type: store.deviceTypeKeys ? store.deviceTypeKeys.join() : "",
    };
    setSearchStatus(hasValue(params));
    store.getDeviceRoute(params);
  };
  const onDetail = (row) => {
    store.changeState({
      deviceVisible: true,
      deviceCurrent: row,
    });
    const { layerType, deviceType, gbid } = row;
    const layer = store.devicelayerObj[layerType][deviceType];
    const layerId = store.devicelayerIds[layerType][deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };
  return (
    <div
      className="police-deployment arrange-wrap perception-device"
      style={{ display: arrangeValue === "gzsb" ? "flex" : "none" }}
    >
      <Form layout="vertical" form={form} style={{ padding: "14px 10px" }}>
        <div style={{ display: "flex" }}>
          <FormItem field="keyword" style={{ marginBottom: 0, flex: 1 }}>
            <InputSearch
              autoComplete="off"
              allowClear
              placeholder="请输入关键字搜索设备名称"
              size="large"
              onSearch={(val) => {
                setInputValue(val);
              }}
              onChange={debounce((val) => {
                setInputValue(val);
              }, 600)}
            />
          </FormItem>
          <FormItem
            field=""
            style={{ marginBottom: 0, width: 42, marginLeft: 6 }}
            className={"filter-type-wrap"}
          >
            <FilterModal
              title="设备筛选"
              triggerProps={{
                getPopupContainer: () =>
                  document.querySelector(".perception-device"),
              }}
              height={240}
            >
              <TitleBar>设备类型</TitleBar>
              <CheckboxGroup
                value={deviceTypeKeys}
                options={deviceTypes}
                onChange={(val) => {
                  store.deviceTypeKeys = val;
                }}
                className={"def-checkGroup2"}
              />
              <TitleBar>设备状态</TitleBar>
              <CheckboxGroup
                value={deviceStatusKeys}
                // options={deviceStatusList}
                onChange={(val) => {
                  store.deviceStatusKeys = val;
                }}
                className={"def-checkGroup2"}
              >
                {deviceStatusList.map((item) => (
                  <Checkbox key={item.value} value={item.value}>
                    <span
                      className={classNames(
                        "check-item",
                        item.value === "1" && "offline",
                        item.value === "2" && "fault"
                      )}
                    >
                      <span className="dot"></span>
                      <span>{item.label}</span>
                    </span>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </FilterModal>
          </FormItem>
          <FormItem
            field=""
            style={{ marginBottom: 0, width: 42, marginLeft: 6 }}
          >
            <div
              className="filter-box"
              onClick={() => {
                store.getDeviceTree();
              }}
            >
              <img src={iconRefreshUrl} className="pic" alt="" />
              <img src={iconRefreshHoverUrl} className="pic-hover" alt="" />
            </div>
          </FormItem>
        </div>
      </Form>
      <div className="people-tree-wrap public-scrollbar">
        {deviceList?.length === 0 ? (
          <>
            <NoData
              isAnbo
              status={
                deviceTypeKeys.length === 0 ||
                deviceStatusKeys.length === 0 ||
                inputValue
                  ? true
                  : false
              }
              image_width={"200px"}
            />
          </>
        ) : (
          <>
            <DeviceList
              dataSourse={deviceList?.device || []}
              loading={false}
              searchStatus={searchStatus}
              onDetail={onDetail}
              deviceEnable={deviceEnable}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default observer(PerceptionDevice);
