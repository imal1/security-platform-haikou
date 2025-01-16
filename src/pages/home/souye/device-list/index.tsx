import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import store from "../../store";
import deviceStore from "../../store/device-list";
import classNames from "classnames";
import {
  Button,
  Input,
  Message,
  Tooltip,
  Checkbox,
  Radio,
} from "@arco-design/web-react";
import { IconDelete } from "@arco-design/web-react/icon";
import styles from "./index.module.less";
import Title from "../../component/title";
import { KArcoTree, FilterModal, TitleBar, NoData } from "@/components";
import deviceTypeUrl from "@/assets/img/place-manage/device-type.png";
import exclamationCircle from "@/assets/img/exclamationCircle.png";
import iconRefreshUrl from "@/assets/img/icon-refresh.png";
import iconRefreshHoverUrl from "@/assets/img/icon-refresh-hover.png";
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
const DeviceList = (props) => {
  const [keyword, setKeyword] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState(["0", "1", "2"]);
  const [frameData, setFrameData] = useState([]);
  const [activeType, setActiveType] = useState("");

  const { deviceTypes, viewer } = store;
  const { checkedKeys, deviceCurrent, totalStatistical, deviceGroupTree } =
    deviceStore;

  const [stylename, setStylename] = useState("");

  useEffect(() => {
    handleSearch("");
    setActiveType(store.deviceTypes[0]?.value);
    store.isAllDevice = true;
    store.removeDeviceLayer("deviceList");
    return () => {
      store.isAllDevice = false;
      store.removeDeviceLayer("deviceList");
      setActiveType(store.deviceTypes[0]?.value);

      deviceStore.changeState({
        deviceFilterParams: {
          withRole: false,
          deviceStatus: "0,1,2",
          tag: "",
          deviceName: "",
          deviceTypes: deviceTypes[0]?.value,
        },
        checkedKeys: [],
      });
    };
  }, []);
  const handleSearch = (val) => {
    deviceStore.deviceFilterParams = {
      ...deviceStore.deviceFilterParams,
      deviceName: val,
    };
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      deviceStore.delayeringTree(
        deviceStore.deviceGroupTree,
        "deviceGroupData"
      );
      store.addDeviceLayer(
        checkedKeys,
        deviceStore.deviceGroupData,
        "deviceList"
      );
    }, 200);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    deviceStore.checkedKeys,
    store.polymerization,
    store.filterDeviceStatusKeys,
    store.filterDeviceTypeKeys,
    store.deviceNameVisible,
  ]);
  useEffect(() => {
    setExpandedKeys(deviceStore.firstKeys);
  }, [deviceStore.firstKeys]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // if (storeAttr.activeType != "0") return;
      // 在延迟时间结束后执行逻辑
      deviceStore.getDeviceGroup();
    }, 600);

    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [deviceStore.deviceFilterParams]);

  useEffect(() => {
    switch (activeType) {
      case "IPC_1":
        setStylename(styles.stylenametwo);
        break;
      case "IPC_3":
        setStylename(styles.stylenamethree);
        break;
      case "BWC":
        setStylename(styles.stylenamefour);
        break;
      case "PTT":
        setStylename(styles.stylenamefive);
        break;
      case "PAD":
        setStylename(styles.stylenamesix);
        break;
      case "MT":
        setStylename(styles.stylenameseven);
        break;
      default:
        break;
    }
  }, [activeType]);

  const loadMore = (treeNode) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (treeNode.props.nodeType === "group") {
          const data = await deviceStore.getdeviceGroupList(
            treeNode.props._key
          );
          treeNode.props.dataRef.children = data;
          //
          //
          resolve(true);
        } else {
          resolve(true);
        }
      }, 1000);
    });
  };
  const filterTree = (tree) => {
    return tree.reduce((acc, node) => {
      // 如果有子节点，递归过滤子节点
      if (node.children && node.children.length > 0) {
        const filteredChildren = filterTree(node.children);
        // 只有当过滤后的子节点数组非空时，才添加到结果中
        if (filteredChildren.length > 0) {
          acc.push({ ...node, children: filteredChildren });
        } else {
          // 如果子节点被全部过滤掉，添加没有children属性的节点
          const { children, ...rest } = node;
          acc.push(rest);
        }
      } else {
        // 如果没有子节点，直接添加这个节点
        acc.push(node);
      }

      return acc;
    }, []);
  };

  const onSelect = (selectedKeys, node) => {
    setSelectedKeys(selectedKeys);
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
    const layer = store.devicelayerObj["deviceList"][type];
    const layerId = store.devicelayerIds["deviceList"][type];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };

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
        {row.nodeType == "group" && (
          <div className="status-opts">
            <label htmlFor="">{tryGet(row, "statistical.total") || 0}</label>
            <div className="status">
              <div className="status-li">
                <span></span>(
                {tryGet(row, "statistical.items")
                  ? tryGet(row, "statistical.items")[0] || 0
                  : 0}
                )
              </div>
              <div className="status-li">
                <span></span>(
                {tryGet(row, "statistical.items")
                  ? tryGet(row, "statistical.items")[1] || 0
                  : 0}
                )
              </div>
              <div className="status-li">
                <span></span>(
                {tryGet(row, "statistical.items")
                  ? tryGet(row, "statistical.items")[2] || 0
                  : 0}
                )
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  const onOk = () => {
    if (checkedKeys.length == 0) {
      Message.warning("请先选择设备！");
    } else if (checkedKeys.length > 9) {
      Message.warning("最多同时9路视频通话");
    } else {
      store.addOrInvite = 0;
      store.selectedMembers = checkedKeys;
      store.callTitle = "组群通话";
      store.memberType = "device";
      // store.selectMemberDeviceVisible = true;
      store.changeState({
        deviceTreeData: deviceStore.deviceGroupTree,
        deviceData: deviceStore.deviceGroupData,
      });
    }
    store.callVisible = true;
    store.selectedMembers = deviceStore.deviceGroupData.filter((item) =>
      checkedKeys.includes(item.key)
    );
    // store.setFrameData(list);
  };
  const playVideo = () => {
    if (checkedKeys.length == 0) {
      Message.warning("请先选择设备！");
    } else if (checkedKeys.length > 9) {
      Message.warning("最多同时调阅9路视频");
    } else {
      const list = deviceStore.deviceGroupData.filter((item) =>
        checkedKeys.includes(item.key)
      );
      store.changeState({
        deviceVisible: true,
        deviceCurrent: list,
      });
    }
  };

  return (
    <div
      className={classNames(styles["device-list-wrap"])}
      id="DeviceListWrap"
      style={props.style}
    >
      <Title title={"设备列表"} style={{ marginBottom: 14 }} />
      <div className={styles["device-list-con"]}>
        <div className={styles.left_wrp}>
          <Radio.Group
            className={`${styles.radio_group_buttons} radio-group-buttons device-list-group`}
            value={activeType}
            onChange={(val) => {
              deviceStore.deviceFilterParams = {
                ...deviceStore.deviceFilterParams,
                deviceTypes: val,
              };
              setActiveType(val);
              setExpandedKeys([]);
            }}
            type="button"
          >
            {deviceTypes.map((item) => (
              <Radio
                key={item.value}
                value={item.value}
                className={styles.radio_img}
              >
                <div
                  className={`${styles.device_tab} ${
                    item.value == activeType ? styles.active : ""
                  }`}
                >
                  {item.label}
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <div className={styles.right_wrp}>
          <div className="add-device-search">
            <Input.Search
              size="large"
              defaultValue=""
              placeholder="请输入设备名称/GBID/分组名搜索"
              onChange={debounce(handleSearch, 600)}
              allowClear
              style={{ marginRight: 10 }}
            />
            <div
              className="filter-box"
              onClick={() => {
                deviceStore.getDeviceGroup();
              }}
            >
              <img src={iconRefreshUrl} className="pic" alt="" />
              <img src={iconRefreshHoverUrl} className="pic-hover" alt="" />
            </div>
          </div>

          <div className={styles.left_avar}>
            <div className={`${stylename} ${styles.avar_img}`}></div>
            <div className={styles.avar_title}>
              <p>设备总数:</p> <span>{totalStatistical?.total}</span>
              <p>个</p>
            </div>
          </div>
          <div>
            <CheckboxGroup
              value={deviceStatus}
              onChange={(val) => {
                setDeviceStatus(val);
                deviceStore.deviceFilterParams = {
                  ...deviceStore.deviceFilterParams,
                  deviceStatus: val.join(),
                };
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
                    <span>
                      {item.label}
                      {totalStatistical?.items && (
                        <>
                          ({" "}
                          <label>
                            {totalStatistical?.items[item.value] || 0}
                          </label>
                          )
                        </>
                      )}
                    </span>
                  </span>
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
          {deviceGroupTree?.length > 0 ? (
            <>
              <div className={classNames(styles["live-show"])}>
                <KArcoTree
                  treeData={deviceGroupTree}
                  blockNode
                  loadMore={loadMore}
                  onCheck={(value, extra) => {
                    deviceStore.setCheckedKeys(value);
                  }}
                  className={classNames(
                    styles["organization-tree"],
                    "expand-tree-select",
                    "public-scrollbar",
                    styles["device-list-tree"]
                  )}
                  style={{ maxHeight: "100%", overflow: "auto" }}
                  virtualListProps={{
                    height: 800,
                  }}
                  renderTitle={(options: any) => {
                    return getTreeTitle(options);
                  }}
                  checkStrictly={true}
                  checkedKeys={checkedKeys}
                  selectedKeys={selectedKeys}
                  expandedKeys={expandedKeys}
                  onSelect={(
                    selectedKeys,
                    { selected, selectedNodes, node }
                  ) => {
                    onSelect(selectedKeys, node.props);
                  }}
                  onExpand={(keys) => {
                    setExpandedKeys(keys);
                  }}
                  // setExpandedKeys={setExpandedKeys}
                ></KArcoTree>
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
    </div>
  );
};
export default observer(DeviceList);
