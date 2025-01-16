import styles from "./index.module.less";
import { useState, useEffect, memo } from "react";
import { observer } from "mobx-react";
import {
  Radio,
  Input,
  Message,
  Tooltip,
  Checkbox,
  Button,
} from "@arco-design/web-react";
import { IconDelete } from "@arco-design/web-react/icon";
import exh_center from "@/assets/img/place-manage/exh-center.png";
import store from "../../store/index";
import siteStore from "../../../site-manage/store/index";
import storeAttr from "../../store/attributes-store";
import FloatBox from "../FloatBox";
import { KArcoTree, DeviceDetail } from "@/components";
import { debounce, groupBy } from "lodash";
import { deviceIcons } from "../../../constant/index";
import { tryGet, deep } from "@/kit";
import classNames from "classnames";
import globalState from "@/globalState";
import appStore from "@/store";
import FrameSelect from "./frame-select";
import { useLocation } from "react-router-dom";
import ygl from "@/assets/img/ygl.svg";
import yglys from "@/assets/img/yglys.svg";
import jpSvg from "@/assets/img/device/icon-jiupian.svg";

const tabList = [
  {
    label: "设备筛选",
    value: "0",
  },
  {
    label: "框选设备",
    value: "1",
  },
];
const AddDevice = () => {
  const { activeType, filterTypes, checkedKeys, viewer, selectedPlan } = store;
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  const [deviceVisible, setDeviceVisible] = useState(false);
  const [stylename, setStylename] = useState("");
  const { deviceCurrent, totalStatistical } = store;
  const location = useLocation();
  const groupDevicesByTypeAndForm = (data) => {
    const filterTerms = {
      IPC_1: [
        {
          column: "deviceType",
          value: ["IPC"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "deviceAttr.ipc.cameraForm",
          value: ["1", "2"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "gbid",
          value: [],
          termType: "in",
          filterType: 1,
        },
      ],
      IPC_3: [
        {
          column: "deviceType",
          value: ["IPC"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "deviceAttr.ipc.cameraForm",
          value: ["3", "4"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "gbid",
          value: [],
          termType: "in",
          filterType: 1,
        },
      ],
      BWC: [
        {
          column: "deviceType",
          value: ["BWC"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "gbid",
          value: [],
          termType: "in",
          filterType: 1,
        },
      ],
      PTT: [
        {
          column: "deviceType",
          value: ["PTT"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "gbid",
          value: [],
          termType: "in",
          filterType: 1,
        },
      ],
      PAD: [
        {
          column: "deviceType",
          value: ["PAD"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "gbid",
          value: [],
          termType: "in",
          filterType: 1,
        },
      ],
      MT: [
        {
          column: "deviceType",
          value: ["MT"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "gbid",
          value: [],
          termType: "in",
          filterType: 1,
        },
      ],
    };
    data.forEach((item) => {
      const { deviceType, gbid, deviceAttr } = item;
      if (deviceType === "IPC") {
        let cameraForm = "";
        if (deviceAttr && deviceAttr.ipc && deviceAttr.ipc.cameraForm) {
          cameraForm = deviceAttr.ipc.cameraForm;
        }
        const key = `${deviceType}_${cameraForm}`;
        if (!filterTerms[key]) {
          filterTerms[key] = [
            {
              column: "deviceType",
              value: [deviceType],
              termType: "in",
              filterType: 1,
              type: "and",
            },
            {
              column: "deviceAttr.ipc.cameraForm",
              value: [cameraForm],
              termType: "in",
              filterType: 1,
              type: "and",
            },
            { column: "gbid", value: [], termType: "in", filterType: 1 },
          ];
        }
        filterTerms[key][2].value.push(gbid);
      } else if (
        deviceType === "BWC" ||
        deviceType === "PTT" ||
        deviceType === "PAD" ||
        deviceType === "MT"
      ) {
        filterTerms[deviceType][1].value.push(gbid);
      }
    });
    return filterTerms;
  };
  useEffect(() => {
    store.leftCollapsed = false;
    storeAttr.updateDeviceChecks();
    if (location.pathname == "/site_manage") {
      storeAttr.changeState({
        componentStore: siteStore,
      });
    } else {
      storeAttr.changeState({
        componentStore: store,
      });
    }
  }, []);
  useEffect(() => {
    if (storeAttr.addDeviceType == "0") {
      handleSearch("");
    }
  }, [storeAttr.addDeviceType]);
  const handleSearch = (val) => {
    store.deviceFilterParams = {
      ...store.deviceFilterParams,
      deviceName: val,
    };
  };
  useEffect(() => {
    return () => {
      storeAttr.removeDeviceLayer();
      store.changeState({
        activeType: filterTypes[0]?.value,
        deviceFilterParams: {
          withRole: false,
          deviceStatus: "0,1,2",
          tag: "",
          deviceName: "",
          deviceTypes: filterTypes[0]?.value,
        },
        checkedKeys: [],
      });
      storeAttr.addDeviceType = "0";
      storeAttr.filterLayerVisible = false;
    };
  }, []);
  useEffect(() => {
    const deviceLayerArr = deep(storeAttr.filterDeviceTypeKeys);
    const data: any = {
      // withRole: false,
      deviceStatus: storeAttr.filterDeviceStatusKeys,
      // tag: "",
      // deviceName: "",
      deviceTypes: deviceLayerArr,
      location: globalState.get("location"),
    };
    if (deviceLayerArr.includes("IPC_1") && !deviceLayerArr.includes("IPC_3")) {
      data.cameraForms = ["1", "2"];
    } else if (
      !deviceLayerArr.includes("IPC_1") &&
      deviceLayerArr.includes("IPC_3")
    ) {
      data.cameraForms = ["3", "4"];
    } else if (
      deviceLayerArr.includes("IPC_1") &&
      deviceLayerArr.includes("IPC_3")
    ) {
      data.cameraForms = ["1", "2", "3", "4"];
    }

    // appStore.getLayerBusinessQuery(data);
    const timer = setTimeout(() => {
      // 全量接口
      appStore.getLayerBusinessQuery(data).then((res) => {
        storeAttr.allDeviceList = res || [];
        const result: any = groupDevicesByTypeAndForm(res || []);
        if (
          storeAttr.filterDeviceStatusKeys.length == 0 ||
          storeAttr.filterDeviceTypeKeys.length == 0
        ) {
          storeAttr.removeDeviceLayer();
          return;
        }
        if (storeAttr.isCreateLayer) {
          storeAttr.removeDeviceLayer();
          setTimeout(() => {
            storeAttr.isCreateLayer = false;
          }, 1000);
        }
        // storeAttr.removeDeviceLayer();
        Object.keys(result).forEach((key) => {
          console.log("filterTerms", result[key]);
          if (
            result[key] &&
            result[key][2] &&
            result[key][2].value.length === 0
          ) {
            storeAttr.removeDeviceLayerByKey(key);
            return;
          }
          if (
            result[key] &&
            result[key].length == 2 &&
            result[key][1].value.length === 0
          ) {
            storeAttr.removeDeviceLayerByKey(key);
            return;
          }
          if (storeAttr.devicelayerObj[key]) {
            storeAttr.devicelayerObj[key].filter({ filterTerms: result[key] });
          } else {
            const devicelayer = new window["KMapUE"].DeviceLayer({
              viewer,
              options: {
                labelField: "name",
                icons: deviceIcons[key],
                filterTerms: result[key],
                isCluster: storeAttr.polymerization,
                deviceLabelMode: storeAttr.deviceNameVisible ? "None" : "hover",
                location: globalState.get("location"),
                range: 1000,
                compressionZoom: globalState.get("compressionZoom") || 17,
                datasetName: ["device_position_modify"],
                associateElement: String(storeAttr.associateElement),
                renderSpace: appStore.devicePerspectiveVisible
                  ? "Screen"
                  : "World",
                worldSpaceScale: appStore.ueConfig?.worldSpaceScale, //世界空间缩放比例，默认30
                worldSpaceIndoorScale: appStore.ueConfig?.worldSpaceIndoorScale, //世界空间室内缩放比例，默认10
                cameraBuffer: appStore.ueConfig?.cameraBuffer, //相机缓冲区域查询条件
                associateSolution: String(selectedPlan?.id),
                onComplete: (res) => {
                  // debugger
                  console.log("=======onComplete===========", res);
                  storeAttr.devicelayerIds[key] = res;
                  devicelayer.on("click", (res) => {
                    const properties = tryGet(res.data, "payload.properties");
                    if (!storeAttr.componentStore.isCorrect) return null;
                    if (
                      storeAttr.componentStore.jfCurrentCopy.gbid ==
                      properties.gbid &&
                      storeAttr.componentStore.jfCurrentCopy.id ==
                      res.data.layerId
                    ) {
                      storeAttr.openGizmoControl(true, () => {
                        storeAttr.gizmoControl.attachElement({
                          type: "device",
                          id: storeAttr.componentStore.jfCurrentCopy.gbid,
                          layerId: storeAttr.componentStore.jfCurrentCopy.id,
                          onComplete: (res) => {
                            storeAttr.gizmoControl.setBlockLists([
                              "EnclosureActor",
                              "BP_BiaoDian_C",
                              "PhysicalDefenseActor",
                              "BP_Pop_Frame_C",
                              "APoiDeviceActor",
                              "PoiDeviceActor",
                            ]);
                          },
                          onError: (err) => { },
                        });
                      });
                    } else {
                      storeAttr.clearGizmoControl();
                    }
                  });
                  devicelayer.on("dblclick", (res) => {
                    const properties: any = tryGet(
                      res.data,
                      "payload.properties"
                    );
                    if (!properties.gbid) return;
                    const row = storeAttr.allDeviceList.find(
                      (item) => item.gbid == properties.gbid
                    );
                    const groupIds = row?.groupId?.split("|") || [];
                    const keys = groupIds.map(
                      (groupId) => `${properties.gbid}-${groupId}`
                    );
                    properties.key = keys[0] || properties.gbid;
                    properties.keys = keys;
                    properties.deviceName =
                      properties.deviceName || properties.name;
                    if (properties.deviceType === "IPC") {
                      properties.cameraForm = tryGet(
                        properties,
                        "deviceAttr.ipc.cameraForm"
                      );
                    }

                    store.deviceCurrent = properties;
                    setTimeout(() => {
                      setDeviceVisible(true);
                    }, 500);

                    devicelayer.select({
                      layerId: res.data.layerId,
                      gbid: properties.gbid,
                    });
                  });
                  devicelayer.on("contextmenu", (res) => {
                    if (storeAttr.componentStore.isCorrect) return;
                    // if (["BWC", "PTT", "PAD"].includes(k)) return;
                    console.log(res, "contextmenucontextmenucontextmenu");
                    storeAttr.componentStore.changeState({
                      isMenu: true,
                      defenseStatus: "add_device",
                    });
                    const properties = tryGet(res.data, "payload.properties");
                    properties.type = "temporary";
                    const geometry = tryGet(res.data, "payload.geometry");
                    localStorage.setItem(
                      "ue-device-property",
                      JSON.stringify({
                        id: properties.id,
                        gbid: properties.gbid,
                        longitude: geometry.coordinates[0],
                        latitude: geometry.coordinates[1],
                        altitude: geometry.coordinates[2] || 0,
                      })
                    );
                    storeAttr.componentStore.correctLLA = {
                      lng: geometry.coordinates[0],
                      lat: geometry.coordinates[1],
                      alt: geometry.coordinates[2] || 0,
                    };
                    properties.deviceName =
                      properties.deviceName || properties.name;
                    if (res.screenPosition) {
                      // setPoint(res.screenPosition);
                      storeAttr.componentStore.changeState({
                        menuPoint: res.screenPosition,
                      });
                    }
                    storeAttr.componentStore.changeState({
                      jfCurrent: properties,
                    });
                    // setCurrentCopy({ gbid: properties.gbid, id: res.data.layerId });
                    storeAttr.componentStore.changeState({
                      jfCurrentCopy: {
                        gbid: properties.gbid,
                        id: res.data.layerId,
                      },
                    });
                  });
                  // devicelayer.flushDeviceLayer(res);

                  // 批量选中
                  // devicelayer.batchSelect(data)

                  // setGeometryDataMap((dataMap) => ({
                  //   ...dataMap,
                  //   [k]: devicelayer,
                  // }));
                },
                onError: (err) => {
                  console.error("=======onError===========", err);
                },
              },
            });
            storeAttr.devicelayerObj[key] = devicelayer;
          }
        });
      });
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [
    storeAttr.polymerization,
    storeAttr.filterDeviceStatusKeys,
    storeAttr.filterDeviceTypeKeys,
    storeAttr.deviceNameVisible,
  ]);
  useEffect(() => {
    setExpandedKeys(store.firstKeys);
  }, [store.firstKeys]);
  useEffect(() => {
    const timer = setTimeout(() => {
      // if (storeAttr.activeType != "0") return;
      // 在延迟时间结束后执行逻辑
      store.getDeviceGroup();
    }, 600);

    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [store.deviceFilterParams]);

  useEffect(() => {
    switch (store.activeType) {
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
  }, [store.activeType]);

  const onCheck = (value, extra) => {
    const { checked, node } = extra;
    store.setCheckedKeys(value);
    storeAttr.changeDevices(node.props, checked);
  };

  const loadMore = (treeNode) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (treeNode.props.nodeType === "group") {
          let data = await store.getdeviceGroupList(treeNode.props._key);
          const gbids = storeAttr.devices.map((item) => item.gbid);
          data = data.map((item) => {
            const isCheck = gbids.includes(item.gbid);
            if (isCheck) {
              store.setCheckedKeys([...store.checkedKeys, item.key]);
            }
            return {
              ...item,
              // disableCheckbox: isCheck,
            };
          });
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
    const layer = storeAttr.devicelayerObj[type];
    const layerId = storeAttr.devicelayerIds[type];
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

  const handleExtraClick = (row) => {
    console.log("row----", row);
    if (storeAttr.componentStore.isCorrect) return;
    const { dataSource, deviceName, id, gbid, deviceType, cameraForm } = row;
    try {
      const deviceData = JSON.parse(dataSource);
      localStorage.setItem(
        "ue-device-property",
        JSON.stringify({
          id: id,
          gbid: gbid,
          longitude: deviceData?.longitude,
          latitude: deviceData?.latitude,
          altitude: deviceData?.altitude || 0,
        })
      );

      storeAttr.componentStore.correctLLA = {
        lng: deviceData?.longitude,
        lat: deviceData?.latitude,
        alt: deviceData?.altitude || 0,
      };

      storeAttr.componentStore.changeState({
        jfCurrent: {
          id,
          gbid,
          deviceName,
        },
      });

      const data =
        storeAttr.devicelayerObj[
          deviceType == "IPC" ? `${deviceType}_${cameraForm}` : deviceType
        ]?.getData();

      storeAttr.componentStore.changeState({
        jfCurrentCopy: {
          gbid,
          id: data?.layerId,
        },
      });
    } catch (error) { }
    storeAttr.componentStore.handleCorrectFunc();
  };

  const getTreeExtra = (row) => {
    return (
      <>
        {
          row.nodeType !== "group"
          && storeAttr.componentStore?.pageType !== "inherent"
          && !["PAD", "PTT", "BWC"].includes(row?.deviceType) && (
            <img
              className="device-extra"
              src={jpSvg}
              onClick={() => {
                handleExtraClick(row);
              }}
              width={22}
            />
          )}
      </>
    );
  };
  const isCheck = (arr) => {
    const { checkedKeys } = store;
    return arr.some((item) => checkedKeys.includes(item));
  };
  const deviceFilterDom = () => {
    return (
      <>
        <div className={styles.left_wrp}>
          <Radio.Group
            className={`${styles.radio_group_buttons} radio-group-buttons device-list-group`}
            value={activeType}
            onChange={(val) => {
              store.deviceFilterParams = {
                ...store.deviceFilterParams,
                deviceTypes: val,
              };
              store.activeType = val;
              setExpandedKeys([]);
            }}
            type="button"
          >
            {[...filterTypes].map((item) => (
              <Radio
                key={item.value}
                value={item.value}
                className={styles.radio_img}
              >
                <div
                  className={`${styles.device_tab} ${item.value == activeType ? styles.active : ""
                    }`}
                >
                  {item.label}
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <div className={styles.right_wrp}>
          <div className={styles.gulian}>
            <div className={styles["gulian-li"]}>
              <img src={ygl} alt="" />
              <label htmlFor="" style={{ color: "#FFAE00" }}>
                已关联方案
              </label>
            </div>
            <div className={styles["gulian-li"]}>
              <img src={yglys} alt="" />
              <label htmlFor="">已关联要素</label>
            </div>
          </div>
          <Input.Search
            size="large"
            placeholder="请输入设备名称/GBID/分组名搜索"
            onChange={debounce(handleSearch, 600)}
            defaultValue=""
            allowClear
          />
          <div className={styles.left_avar}>
            <div className={`${stylename} ${styles.avar_img}`}></div>
            <div className={styles.avar_title}>
              <p>设备总数:</p> <span>{totalStatistical.total}</span>
              <p>个</p>
            </div>
          </div>
          {store.deviceGroupTree?.length > 0 ? (
            <>
              <div className={classNames(styles["live-show"])}>
                <KArcoTree
                  treeData={filterTree(store.deviceGroupTree)}
                  blockNode
                  loadMore={loadMore}
                  onCheck={(value, extra) => {
                    onCheck(value, extra);
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
                  // checkedStrategy={Tree.SHOW_CHILD}
                  renderTitle={(options: any) => {
                    return getTreeTitle(options);
                  }}
                  renderExtra={(options: any) => {
                    return getTreeExtra(options);
                  }}
                  checkStrictly={true}
                  checkedKeys={checkedKeys}
                  selectedKeys={selectedKeys}
                  expandedKeys={expandedKeys}
                  fieldNames={
                    {
                      // key: "orgCode",
                      // title: "orgName",
                      // children: "child",
                    }
                  }
                  onSelect={(
                    selectedKeys,
                    { selected, selectedNodes, node }
                  ) => {
                    onSelect(selectedKeys, node.props);
                  }}
                  // checkable
                  onExpand={(keys) => {
                    setExpandedKeys(keys);
                  }}
                // setExpandedKeys={setExpandedKeys}
                ></KArcoTree>
              </div>

              {/* <div className={styles.footer}>
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 10 }}
              onClick={debounce(onOk, 600)}
            >
              确认
            </Button>
          </div> */}
            </>
          ) : (
            <div className="no-data">
              <img src={exh_center} />
              <span>暂无数据</span>
            </div>
          )}
        </div>
      </>
    );
  };
  return (
    <FloatBox
      className={classNames(
        styles["float-left"],
        store.leftCollapsed && styles["place-manage-box-hide"],
        "addDeviceBox"
      )}
      title="设备资源列表"
      width={379}
      direction="left"
      resize
      extra={
        <>
          <div className={styles["oper-btn-wrap"]}>
            {tabList.map((item) => (
              <div
                className={classNames(
                  "tab-li",
                  item.value === storeAttr.addDeviceType && "active"
                )}
                key={item.value}
                onClick={() => {
                  storeAttr.addDeviceType = item.value;
                  store.leftCollapsed = false;
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
          {!store.leftCollapsed && storeAttr.addDeviceType === "1" && (
            <Button
              type="text"
              className={styles["clear-select"]}
              onClick={() => {
                storeAttr.location = null;
              }}
              icon={<IconDelete style={{ fontSize: 18 }} />}
            >
              清除框选
            </Button>
          )}
        </>
      }
    >
      <div className={styles.float_left_wrp}>
        {storeAttr.addDeviceType === "0" && deviceFilterDom()}
        {storeAttr.addDeviceType === "1" && <FrameSelect />}
        {deviceVisible && (
          <DeviceDetail
            visible={deviceVisible}
            setVisible={setDeviceVisible}
            data={deviceCurrent}
            onlyPlay
            deviceChildren={
              <div className={styles["device-select"]}>
                <Checkbox
                  checked={isCheck(
                    deviceCurrent?.keys.length > 0
                      ? deviceCurrent.keys
                      : [deviceCurrent.key]
                  )}
                  style={{ padding: "7px 14px" }}
                  onChange={(val) => {
                    if (val) {
                      store.checkedKeys = [
                        ...store.checkedKeys,
                        ...(deviceCurrent?.keys.length > 0
                          ? deviceCurrent.keys
                          : [deviceCurrent.key]),
                      ];
                      storeAttr.changeDevices(deviceCurrent, val);
                    } else {
                      store.checkedKeys = store.checkedKeys.filter(
                        (item) =>
                          !(
                            deviceCurrent?.keys.length > 0
                              ? deviceCurrent.keys
                              : [deviceCurrent.key]
                          ).includes(item)
                      );
                      storeAttr.changeDevices(deviceCurrent, val);
                    }
                  }}
                >
                  添加设备
                </Checkbox>
              </div>
            }
          />
        )}
      </div>
    </FloatBox>
  );
};

export default memo(observer(AddDevice));
