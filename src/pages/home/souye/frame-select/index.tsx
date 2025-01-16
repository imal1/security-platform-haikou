import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store";
import classNames from "classnames";
import {
  Button,
  Input,
  Message,
  Tooltip,
  Checkbox,
} from "@arco-design/web-react";
import { IconDelete } from "@arco-design/web-react/icon";
import styles from "./index.module.less";
import Title from "../../component/title";
import { KArcoTree, FilterModal, TitleBar, NoData } from "@/components";
import deviceTypeUrl from "@/assets/img/place-manage/device-type.png";
import exclamationCircle from "@/assets/img/exclamationCircle.png";
import { debounce } from "lodash";
import { tryGet, deep } from "@/kit";
import appStore from "@/store";
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
const FrameSelect = (props) => {
  const [deviceTypeKeys, setDeviceTypeKeys] = useState([]);
  const [deviceStatusKeys, setDeviceStatusKeys] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [frameCheckedKeys, setFrameCheckedKeys] = useState([]);
  const [frameExpandedKeys, setFrameExpandedKeys] = useState([]);
  const [deviceTotal, setDeviceTotal] = useState(0);
  const [frameData, setFrameData] = useState([]);
  const { deviceTypes } = store;
  useEffect(() => {
    init();
    return () => {
      store.removeDeviceLayer("toolDevice");
      store.changeState({
        deviceVisible: false,
        deviceCurrent: null,
        location: null,
      });
      setFrameCheckedKeys([]);
    };
  }, []);
  const init = () => {
    setKeyword("");
    setDeviceStatusKeys(["0", "1", "2"]);
    setDeviceTotal(0);
    setFrameData([]);
    setTreeData([]);
    setFrameCheckedKeys([]);
  };
  useEffect(() => {
    const ids = deviceTypes.map((item) => item.value);
    setDeviceTypeKeys(ids);
  }, [store.deviceTypes]);
  const getTreeTitle = (row) => {
    return (
      <div className="device-tree-title-wrap2">
        {(row.title + (row.gbid || "")).length > 8 ? (
          <Tooltip
            content={
              <div style={{ wordBreak: "break-all" }}>
                {row.title}
                {row.gbid && (
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>
                    [{row.gbid}]
                  </span>
                )}
              </div>
            }
          >
            <div className="name text-overflow">
              {row.title}
              {row.gbid && (
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  [{row.gbid}]
                </span>
              )}
            </div>
          </Tooltip>
        ) : (
          <div className="name text-overflow">
            {row.title}
            {row.gbid && (
              <span style={{ color: "rgba(255,255,255,0.7)" }}>
                [{row.gbid}]
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const onOk = () => {
    if (frameCheckedKeys.length == 0) {
      Message.warning("请先选择设备！");
    } else if (frameCheckedKeys.length > 9) {
      Message.warning("最多同时9路视频通话");
    } else {
      store.addOrInvite = 0;
      store.selectedMembers = frameCheckedKeys;
      store.callTitle = "组群通话";
      store.memberType = 'device';
      // store.selectMemberDeviceVisible = true;
      store.changeState({
        deviceTreeData: treeData,
        deviceData: frameData,
      });
      
      store.callVisible = true;
      store.selectedMembers = frameData.filter(item=>frameCheckedKeys.includes(item.key));

    }
    // store.setFrameData(list);
  };
  const playVideo = () => {
    if (frameCheckedKeys.length == 0) {
      Message.warning("请先选择设备！");
    } else if (frameCheckedKeys.length > 9) {
      Message.warning("最多同时调阅9路视频");
    } else {
      const list = frameData.filter((item) =>
        frameCheckedKeys.includes(item.key)
      );
      store.changeState({
        deviceVisible: true,
        deviceCurrent: list,
      });
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      if (store.location) {
        getFrameSelectList({ keyword, deviceTypeKeys, deviceStatusKeys });
      }
    }, 200);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    keyword,
    deviceTypeKeys,
    deviceStatusKeys,
    store.location,
    store.polymerization,
    store.filterDeviceStatusKeys,
    store.filterDeviceTypeKeys,
    store.deviceNameVisible,
  ]);
  useEffect(() => {
    if (!store.location) {
      store.removeDeviceLayer("toolDevice");
      setFrameCheckedKeys([]);
      store.changeState({
        deviceVisible: false,
        deviceCurrent: null,
      });
      init();
    }
  }, [store.location]);
  const getFrameSelectList = async ({
    keyword,
    deviceTypeKeys,
    deviceStatusKeys,
  }) => {
    const data: any = {
      // withRole: false,
      deviceStatus: deviceStatusKeys,
      // tag: "",
      deviceName: keyword,
      deviceTypes: deviceTypeKeys,
      location: store.location,
    };
    if (deviceTypeKeys.includes("IPC_1") && !deviceTypeKeys.includes("IPC_3")) {
      data.cameraForms = ["1", "2"];
    } else if (
      !deviceTypeKeys.includes("IPC_1") &&
      deviceTypeKeys.includes("IPC_3")
    ) {
      data.cameraForms = ["3", "4"];
    } else if (
      deviceTypeKeys.includes("IPC_1") &&
      deviceTypeKeys.includes("IPC_3")
    ) {
      data.cameraForms = ["1", "2", "3", "4"];
    }

    const res = await appStore.getLayerBusinessQuery(data);
    const allIds = res.map((item) => item.gbid);

    const list =
      res.map((item) => {
        const deviceType = store.getDeviceType(item);
        const groupIds = item?.groupId?.split("|") || [];
        return {
          ...item,
          deviceType,
          deviceName: item.name,
          key: `${item.gbid}-${groupIds[0] ? groupIds[0] : ""}`,
          title: item.name,
        };
      }) || [];
    store.addDeviceLayer(allIds, list, "toolDevice");
    const deviceTypeList = store.deviceTypes.filter((item) =>
      deviceTypeKeys.includes(item.value)
    );
    const treeList = deviceTypeList
      .map((item) => {
        const children = list
          .filter((child) => child.deviceType == item.value)
          .map((child) => {
            return {
              ...child,
              key: child.key,
              title: child.name,
            };
          });
        return {
          ...item,
          title: `${item.label}（${children?.length || 0}）`,
          key: item.value,
          children,
          checkable: false,
          total: children?.length || 0,
        };
      })
      .filter((item) => item.children.length > 0);
    console.log(treeList, "treeListtreeListtreeList");

    const parentIds = treeList.map((item) => item.key);
    const ids = list.map((item) => item.key);
    console.log(parentIds, "parentIdsparentIds");
    setFrameExpandedKeys([parentIds[0]]);
    // setFrameCheckedKeys([...parentIds, ...ids]);
    setDeviceTotal(list.length);
    setFrameData(list);
    setTreeData(treeList);
  };
  const onSelect = (selectedKeys, node) => {
    const { gbid, deviceType, cameraForm } = node;
    let type = deviceType;
    if (deviceType === "IPC") {
      if (["1", "2"].includes(cameraForm)) {
        type = "IPC_1";
      } else {
        type = "IPC_3";
      }
    }
    appStore.getLayerServiceQuery(gbid, store.viewer);
    const layer = store.devicelayerObj["toolDevice"][type];
    const layerId = store.devicelayerIds["toolDevice"][type];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };
  return (
    <div
      className={classNames(styles["frame-select-wrap"])}
      id="frameSelectWrap"
      style={props.style}
    >
      <Title
        title={"图上框选"}
        after={
          <Button
            type="text"
            className={styles["clear-select"]}
            onClick={() => {
              store.location = null;
              // 隐藏掉警情标注和责任区信息
              store.homeSecurityInfoVisible = false;
              store.homePoliceRemarkVisible = false;
            }}
            icon={<IconDelete style={{ fontSize: 18 }} />}
          >
            清除框选
          </Button>
        }
        style={{ marginBottom: 14 }}
      />
      <div className="add-device-search">
        <Input.Search
          size="large"
          value={keyword}
          placeholder="请输入设备名称/分组名搜索"
          onChange={setKeyword}
          defaultValue=""
          allowClear
        />
        <div className="filter-box">
          <FilterModal
            title="设备筛选"
            triggerProps={{
              getPopupContainer: () =>
                document.querySelector("#frameSelectWrap"),
            }}
            height={265}
          >
            <TitleBar>设备类型</TitleBar>
            <CheckboxGroup
              value={deviceTypeKeys}
              options={deviceTypes}
              onChange={(val) => {
                setDeviceTypeKeys(val);
              }}
              className={"def-checkGroup2"}
            />
            <TitleBar>设备状态</TitleBar>
            <CheckboxGroup
              value={deviceStatusKeys}
              onChange={(val) => {
                setDeviceStatusKeys(val);
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
        </div>
      </div>

      <div className={styles.left_avar}>
        <img src={deviceTypeUrl} />
        <div className={styles.avar_title}>
          <p>设备总数:</p> <span>{deviceTotal}</span>
          <p>个</p>
        </div>
      </div>
      {treeData?.length > 0 ? (
        <>
          <div className={styles["live-show"]}>
            <KArcoTree
              treeData={treeData}
              blockNode
              onCheck={(value, extra) => {
                setFrameCheckedKeys(value);
              }}
              className={classNames(
                styles["organization-tree"],
                "expand-tree-select",
                "public-scrollbar"
              )}
              style={{ maxHeight: "100%", overflowX: "hidden" }}
              virtualListProps={{
                height: 800,
              }}
              // checkedStrategy={Tree.SHOW_CHILD}
              renderTitle={(options: any) => {
                return getTreeTitle(options);
              }}
              checkStrictly={true}
              checkedKeys={frameCheckedKeys}
              // selectedKeys={selectedKeys}
              expandedKeys={frameExpandedKeys}
              onSelect={(selectedKeys, { selected, selectedNodes, node }) => {
                onSelect(selectedKeys, node.props);
              }}
              checkable
              onExpand={(keys) => {
                setFrameExpandedKeys(keys);
              }}
              // setExpandedKeys={setExpandedKeys}
            ></KArcoTree>
          </div>

          <div className={styles.footer}>
            <Button
              type="secondary"
              style={{ marginLeft: 10 }}
              onClick={debounce(onOk, 600)}
            >
              组群通话
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 10 }}
              onClick={debounce(playVideo, 600)}
            >
              批量调阅
            </Button>
          </div>
          <div className={styles["model-opts"]}>
            <img src={exclamationCircle} />
            <label>提示：组群通话、批量调阅建议同时勾选不超过9路。</label>
          </div>
        </>
      ) : (
        <div className={styles["live-show"]}>
          <NoData
            isAnbo
            status={keyword ? true : false}
            image_width={"200px"}
          />
        </div>
      )}
    </div>
  );
};
export default observer(FrameSelect);
