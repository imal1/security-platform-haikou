import styles from "./index.module.less";
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import {
  Input,
  Tree,
  Radio,
  Space,
  TreeProps,
  Message,
} from "@arco-design/web-react";
import { debounce, groupBy } from "lodash";
import { statisticsInherent, inherentTreeDevices } from "../../store/webapi";
import { IconFile } from "@arco-design/web-react/icon";
import store from "../../store/index";
import { icons } from "../../../place-manage/component/ele-store/const";
import DeviceFilter from "../../../place-manage/component/FloatLeft/DeviceFilter";
import { deviceIcons } from "@/pages/constant/index";
import { DeviceDetail, VideoAssess } from "@/components/index";
import {
  tryGet,
  Icons,
  getServerBaseUrl,
  getServerBaseUrlNoPortal,
  unique,
  getFeatureTreeData,
  Trees,
} from "@/kit";
import PositionCorrect from "../../../../components/position-correct";
import {
  updateDeviceBuildingInfo,
  updateLocation,
} from "../../../place-manage/store/webapi";
import storeAttr from "../../../place-manage/store/attributes-store";
import globalState from "@/globalState";
import appStore from "@/store";
const { getFirstRootKeys } = Trees;
const JiFang = () => {
  const [statistics, setStatistics] = useState({
    deviceLibraryStatisticsVOS: [],
  });
  const [searchText, setSearchText] = useState("");
  const [expandedKeys, setExpandedKeys] = useState(["inherent"]);
  // const [geometryDataMap, setGeometryDataMap] = useState({});
  // const [visible, setVisible] = useState(false);
  // const [current, setCurrent] = useState<any>({ id: "", gbid: "" });
  // const [currentCopy, setCurrentCopy] = useState({ id: "", gbid: "" });
  const [isMenu, setIsMenu] = useState(false);
  const [inherentTreeData, setInherentTreeData] = useState<FeatureTreeProps[]>(
    []
  );
  const [isCorrent, setIsCorrent] = useState(false);
  const [point, setPoint] = useState({
    x: 600,
    y: 600,
  });

  // const cTUserMngServer =
  //   getServerBaseUrlNoPortal("CT_SERVER_URL") ||
  //   getServerBaseUrl("CTUserMngServer");
  const [correctPoint, setCorrectPoint] = useState({ lng: 0, lat: 0, alt: 0 });
  const [treeParams, setTreeParams] = useState({ deviceTypes: [], status: [] });
  const { selectedPlan, features, viewer } = store;
  const newPageVideo = window.globalConfig["newPageVideo"];
  const handleSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);
  useEffect(() => {
    if (store.jfCurrent) {
      const { gbid, status, title, deviceType, deviceName } = store.jfCurrent;
      const name = deviceName || title;
      store.jfVideoVisible &&
        appStore.sendMessage({ gbid, status, name, deviceType });
    }
  }, [store.jfCurrent, store.jfVideoVisible]);
  useEffect(() => {
    statisticsInherent().then(setStatistics);
    inherentTreeDevices(treeParams).then((res) => {
      // res = getFeatureTreeData(res);
      setInherentTreeData(res);
      store.delayeringTree(res, "jfInherentData");
    });
  }, [selectedPlan, treeParams]);

  useEffect(() => {
    if (!store.viewer) return;
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      deviceRedraw(store.jfCheckedKeys, store.jfInherentData);
    }, 600);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    store.jfCheckedKeys,
    store.jfInherentData,
    store.viewer,
    storeAttr.deviceNameVisible,
  ]);

  useEffect(() => {
    const hancleClick = (event) => {
      if (event.target.parentElement.id == "fixMenu") {
        return;
      }
      setIsMenu(false);
      store.changeState({
        toJfDetail: toDetail,
        handleJfCorrect: handleCorrect,
        isMenu: false,
      });
    };

    document.addEventListener("click", hancleClick, true);

    return () => {
      document.removeEventListener("click", hancleClick, true);
    };
  }, []);

  useEffect(() => {
    const transformUe = storeAttr.transformUe;
    if (transformUe !== null) {
      store.correctLLA = transformUe.position;
    }
  }, [storeAttr.transformUe]);
  useEffect(() => {
    setFirstExpanded();
  }, [searchText]);
  const setFirstExpanded = () => {
    try {
      const inherentData: any = searchData(inherentTreeData);
      // 合并 keys
      if (inherentData?.length > 0) {
        setExpandedKeys(["inherent", ...getFirstRootKeys(inherentData, "id")]);
      }
    } catch (error) {}
  };
  const searchData = (TreeData) => {
    const loop = (data) => {
      const result = [];
      data.forEach((item) => {
        if (item.featureName.toLowerCase().includes(searchText.toLowerCase())) {
          result.push({
            ...item,
            children: item.children?.length ? loop(item.children) : [],
          });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({ ...item, children: filterData });
          }
        }
      });
      return result;
    };
    return loop(TreeData);
  };
  const handleSelect = (selectedKeys, extra) => {
    console.log("handleSelect", selectedKeys, extra);
    const { node } = extra;
    const { gbid, deviceType } = node.props;
    gbid && appStore.getLayerServiceQuery(gbid, store.viewer);
    const layer = store.devicelayerObj[deviceType];
    const layerId = store.devicelayerIds[deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };
  const removeAllLayer = () => {
    try {
      if (store.devicelayerObj) {
        for (const key in store.devicelayerObj) {
          const item = store.devicelayerObj[key];
          if (item) {
            item?.remove();
            store.devicelayerObj[key] = null;
            store.devicelayerIds[key] = null;
            store.changeState({
              jfGeometryDataMap: {
                ...store.jfGeometryDataMap,
                [key]: null,
              },
            });
          }
        }
      }
    } catch (error) {}
  };
  const deviceRedraw = (keys = [], data = []) => {
    keys = keys.map((item) => (item ? String(item).split("-")[0] : item));
    const getGbids = (deviceType) => {
      // 设备
      const gbids = data
        .filter(
          (item) => item.deviceType === deviceType && keys.includes(item.gbid)
        )
        .map((item) => item.gbid);
      return unique(gbids);
    };
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
          value: getGbids("IPC_1") ?? [],
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
          value: getGbids("IPC_3") ?? [],
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
          value: getGbids("BWC") ?? [],
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
          value: getGbids("PTT") ?? [],
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
          value: getGbids("PAD") ?? [],
          termType: "in",
          filterType: 1,
        },
      ],
      TOLLGATE: [
        {
          column: "deviceType",
          value: ["TOLLGATE"],
          termType: "in",
          filterType: 1,
          type: "and",
        },
        {
          column: "gbid",
          value: getGbids("TOLLGATE") ?? [],
          termType: "in",
          filterType: 1,
        },
      ],
    };
    if (storeAttr.isCreateLayer) {
      removeAllLayer();
      storeAttr.isCreateLayer = false;
    }
    Object.keys(filterTerms).forEach((k) => {
      if (getGbids(k).length > 0) {
        if (store.devicelayerObj[k]) {
          store.devicelayerObj[k].filter({ filterTerms: filterTerms[k] });
        } else {
          const devicelayer = new window["KMapUE"].DeviceLayer({
            viewer,
            options: {
              labelField: "name",
              icons: deviceIcons[k],
              filterTerms: filterTerms[k],
              isCluster: false,
              range: 1000,
              deviceLabelMode: storeAttr.deviceNameVisible ? "None" : "hover",
              compressionZoom: globalState.get("compressionZoom") || 17,
              location: globalState.get("location"),
              datasetName: ["device_position_modify"],
              renderSpace: appStore.devicePerspectiveVisible
                ? "Screen"
                : "World",
              worldSpaceScale: appStore.ueConfig?.worldSpaceScale, //世界空间缩放比例，默认30
              worldSpaceIndoorScale: appStore.ueConfig?.worldSpaceIndoorScale, //世界空间室内缩放比例，默认10
              cameraBuffer: appStore.ueConfig?.cameraBuffer, //相机缓冲区域查询条件
              onComplete: (res) => {
                console.log("=======onComplete===========", res);
                // setGeometryDataMap((dataMap) => ({
                //   ...dataMap,
                //   [k]: devicelayer,
                // }));
                store.changeState({
                  jfGeometryDataMap: {
                    ...store.jfGeometryDataMap,
                    [k]: devicelayer,
                  },
                });

                store.devicelayerIds[k] = res;
              },
              onError: (err) => {
                console.error("=======onError===========", err);
              },
            },
          });
          store.devicelayerObj[k] = devicelayer;
          setTimeout(() => {
            devicelayer.on("click", (res) => {
              const properties = tryGet(res.data, "payload.properties");
              // setCurrent(properties);
              // devicelayer.select({
              //   layerId: res.data.layerId,
              //   gbid: properties.gbid,
              // });
              if (!store.isCorrect) return null;
              if (
                store.jfCurrentCopy.gbid == properties.gbid &&
                store.jfCurrentCopy.id == res.data.layerId
              ) {
                storeAttr.openGizmoControl(true, () => {
                  storeAttr.gizmoControl.attachElement({
                    type: "device",
                    id: store.jfCurrentCopy.gbid,
                    layerId: store.jfCurrentCopy.id,
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
                    onError: (err) => {},
                  });
                });
              } else {
                storeAttr.clearGizmoControl();
              }
            });
            devicelayer.on("contextmenu", (res) => {
              if (store.isCorrect) return;
              // if (["BWC", "PTT", "PAD"].includes(k)) return;
              console.log(res.data, "contextmenucontextmenucontextmenu");
              setIsMenu(true);
              store.changeState({
                isMenu: true,
                defenseStatus: "jf",
              });
              const properties = tryGet(res.data, "payload.properties");
              const geometry = tryGet(res.data, "payload.geometry");
              localStorage.setItem(
                "ue-device-property",
                JSON.stringify({
                  longitude: geometry.coordinates[0],
                  latitude: geometry.coordinates[1],
                  altitude: geometry.coordinates[2] || 0,
                })
              );
              store.correctLLA = {
                lng: geometry.coordinates[0],
                lat: geometry.coordinates[1],
                alt: geometry.coordinates[2] || 0,
              };
              properties.deviceName = properties.deviceName || properties.name;
              if (res.screenPosition) {
                // setPoint(res.screenPosition);
                store.changeState({
                  menuPoint: res.screenPosition,
                });
              }
              // setCurrent(properties);
              // setCurrentCopy({ gbid: properties.gbid, id: res.data.layerId });
              store.changeState({
                jfCurrent: properties,
              });
              store.changeState({
                jfCurrentCopy: { gbid: properties.gbid, id: res.data.layerId },
              });
            });
          }, 1000);
        }
      } else {
        if (store.devicelayerObj[k]) {
          // geometryDataMap[k]?.remove();
          store.jfGeometryDataMap[k]?.remove();
          store.devicelayerObj[k] = null;
          store.devicelayerIds[k] = null;

          store.changeState({
            jfGeometryDataMap: { ...store.jfGeometryDataMap, [k]: null },
          });
        }
      }
    });
  };

  const handleCheckInherent: TreeProps["onCheck"] = (checkedKeys, extra) => {
    // const { checked, checkedNodes } = extra;
    const editData = store.jfCheckedKeys.filter((item: any) => {
      return (
        typeof item == "string" && item.indexOf(store.jfCurrent.gbid) != -1
      );
    });
    const editDataNew = checkedKeys.filter((item: any) => {
      return (
        typeof item == "string" && item.indexOf(store.jfCurrent.gbid) != -1
      );
    });
    if (
      store.jfCurrent.gbid &&
      editData.length > 0 &&
      editDataNew.length == 0 &&
      store.isCorrect
    ) {
      // Message.warning("正在纠偏！");
      checkedKeys.push(editData[0]);
      checkedKeys.push(editData[0].slice(0, 2));
      store.jfCheckedKeys = checkedKeys;
    } else {
      store.jfCheckedKeys = checkedKeys;
    }
    // deviceRedraw({ checked, checkedNodes, type: "inherent" });
  };

  const renderTitle = (props) => {
    let { title, featureType, featureCode, deviceType, status } = props;
    let prefix = null;

    console.log("固有资源", icons[deviceType]);
    if (status === 0) {
      deviceType = deviceType + "_ON";
    }
    if (featureType === "SITE_DRAWING") {
      prefix = (
        <span className="feature-code" style={{ marginRight: 4 }}>
          {features.find((v) => v.featureCode === featureCode)?.featureName}
        </span>
      );
    } else if (featureCode) {
      prefix = (
        <img
          className="feature-icon"
          src={icons[featureCode]}
          width={26}
          style={{ marginRight: 4 }}
        />
      );
    } else if (deviceType) {
      prefix = (
        <img
          className="feature-icon"
          src={icons[deviceType]}
          width={26}
          style={{ marginRight: 4 }}
        />
      );
    }

    return (
      <>
        {prefix}
        <span className="feature-title">{title}</span>
      </>
    );
  };

  const filterNode = (node) => {
    const { id } = node;
    if (id === "inherent" || id === "temporary") return true;
    // 检查子节点是否满足条件
    const hasMatchingChildren = node.children?.some((child) =>
      filterNode(child)
    );
    return (
      node.featureName.toLowerCase().includes(searchText.toLowerCase()) ||
      hasMatchingChildren
    );
  };

  const handleDeviceFilter = ({ types, status }) => {
    setTreeParams({ deviceTypes: types.join(","), status: status.join(",") });
  };

  const onDetail = (row) => {
    // setCurrent(row);
    store.changeState({
      jfCurrent: row,
      jfVideoVisible: true,
      currentDevice: row,
    });
    // setVisible(true);
  };

  const renderExtra = (props) => {
    const { id, deviceType } = props;
    if (id === "inherent" || id === "temporary") return null;

    return (
      <div className="feature-extra">
        {deviceType && (
          <IconFile style={{ fontSize: 18 }} onClick={() => onDetail(props)} />
        )}
      </div>
    );
  };

  const toDetail = () => {
    // setVisible(true);
    setIsMenu(false);
    store.changeState({
      isMenu: false,
      jfVideoVisible: true,
      currentDevice: store.jfCurrent,
    });
    const deviceType = store.getDeviceType(store.jfCurrent);
    const { gbid } = store.jfCurrent;
    const layer = store.devicelayerObj[deviceType];
    const layerId = store.devicelayerIds[deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };

  const manualCorrect = (coordinate: any) => {
    storeAttr.clearGizmoControl();
    const location = [
      {
        id: store.jfCurrent.id,
        gbid: store.jfCurrent.gbid,
        longitude: coordinate.lng,
        latitude: coordinate.lat,
        altitude: coordinate.alt,
      },
    ];
    updateLocation(store.cTUserMngServer, location).then(() => {
      Object.keys(store.jfGeometryDataMap).forEach((k) => {
        // debugger
        store.jfGeometryDataMap[k] &&
          store.jfGeometryDataMap[k].flushDeviceLayer();
      });
      saveIsOutDoor(store.cTUserMngServer, location);
    });
    // geometryDataMap.map(layerItem => {
    //   layerItem.flushDeviceLayer()
    // });

    setTimeout(() => {
      if (!store.isCorrect) return;
      storeAttr.openGizmoControl(true, () => {
        storeAttr.gizmoControl.attachElement({
          type: "device",
          id: store.jfCurrentCopy.gbid,
          layerId: store.jfCurrentCopy.id,
          onComplete: (res) => {},
          onError: (err) => {},
        });
      });
    }, 200);
  };

  const handleCorrect = () => {
    store.correctCofirm = manualCorrect;
    // setIsMenu(false);
    store.changeState({
      isMenu: false,
    });
    store.changeState({
      correctCancel,
      correctOk,
    });
    setIsCorrent(true);
    store.changeState({
      isCorrect: true,
      rightCollapsed: true,
      isView: true,
      geometryPosition: {
        lng: store.jfCurrent.longitude,
        lat: store.jfCurrent.latitude,
      },
    });
    store.viewer.startTakePoint({
      tip: "鼠标单击，重新选择设备摆放位置，esc键退出",
    });
    store.viewer.off("take_point");
    store.viewer.on("take_point", (res) => {
      const getToArr = (obj) => {
        return { position: [[obj.lng, obj.lat]], height: obj.alt + 1 };
      };
      setCorrectPoint(res);
      store.correctLLA = res;
      store.changeState({
        geometryPosition: res,
        jfCorrectPoint: res,
      });
      const Point = getToArr(res);
      console.log(res, "take_pointtake_pointv");
      const buildingEvent = new window["KMapUE"].BuildingEvent(viewer);
      const buildingInfo = buildingEvent.getInfo() || {
        buildingId: "outdoor",
        floor: "1",
      };
      const buildingData = {
        appName: globalState.get("userInfo").userName,
        serviceName: "device_position_modify	",
        esDataEntityList: [
          {
            dataId: store.jfCurrent.gbid,
            appName: globalState.get("userInfo").userName,
            serviceName: "device_position_modify	",
            keyValueMap: {
              buildingId: buildingInfo.buildingId,
              floor: buildingInfo.floor,
            },
          },
        ],
      };
      // updateDeviceBuildingInfo(cTUserMngServer, buildingData);
      const data = {
        id: store.menuFeatureId,
        iconPosition: Point,
      };
      const iconPosition = data?.iconPosition;

      const location = [
        {
          id: store.jfCurrent.id,
          gbid: store.jfCurrent.gbid,
          longitude: res.lng,
          latitude: res.lat,
          altitude: res.alt,
        },
      ];
      // console.log(cTUserMngServer, "cTUserMngServer");
      // updateLocation(cTUserMngServer, location).then(() => {
      //   Object.keys(store.jfGeometryDataMap).forEach((k) => {
      //     // debugger
      //     setTimeout(() => {
      //       store.jfGeometryDataMap[k] && store.jfGeometryDataMap[k].flushDeviceLayer();
      //     }, 200);
      //   });
      //   saveIsOutDoor(cTUserMngServer, location);
      // });

      // setTimeout(() => {
      //   storeAttr.openGizmoControl(true, () => {
      //     storeAttr.gizmoControl.attachElement({
      //       type: "device",
      //       id: store.jfCurrentCopy.gbid,
      //       layerId: store.jfCurrentCopy.id,
      //       onComplete: (res) => {},
      //       onError: (err) => {},
      //     });
      //   });
      // }, 500);
    });
  };

  const correctOk = async () => {
    if (!store.isCorrect) return;
    const transformUe = storeAttr.transformUe;
    console.log(
      store.jfGeometryDataMap,
      "geometryDataMapgeometryDataMap",
      transformUe
    );
    if (transformUe) {
      const location = [
        {
          id: store.jfCurrent.id,
          gbid: store.jfCurrent.gbid,
          longitude: transformUe.position.lng,
          latitude: transformUe.position.lat,
          altitude: transformUe.position.alt,
        },
      ];
      console.log(store.cTUserMngServer, "cTUserMngServer");
      await updateLocation(store.cTUserMngServer, location);
      saveIsOutDoor(store.cTUserMngServer, location);

      Object.keys(store.jfGeometryDataMap).forEach((k) => {
        // debugger
        setTimeout(() => {
          store.jfGeometryDataMap[k] &&
            store.jfGeometryDataMap[k].flushDeviceLayer();
        }, 200);
      });
    }
    localStorage.removeItem("ue-device-property");
    Message.success("更新成功");
    correctCancel(false);
  };

  const correctCancel = (cancelOnly = true) => {
    if (!store.isCorrect) return;
    setIsMenu(false);
    setIsCorrent(false);
    store.changeState({
      isCorrect: false,
      isView: false,
      geometryPosition: null,
    });
    store.changeState({
      isMenu: false,
    });

    store.viewer.endTakePoint({
      onComplete: () => {
        store.viewer.off("take_point");
      },
    });
    storeAttr.clearGizmoControl();

    if (cancelOnly) {
      const point = localStorage.getItem("ue-device-property");
      const geometry = JSON.parse(point);
      const location = [
        {
          id: store.jfCurrent.id,
          gbid: store.jfCurrent.gbid,
          ...geometry,
        },
      ];
      console.log(store.cTUserMngServer, "cTUserMngServer");
      geometry &&
        updateLocation(store.cTUserMngServer, location).then(() => {
          Object.keys(store.jfGeometryDataMap).forEach((k) => {
            // debugger
            setTimeout(() => {
              store.jfGeometryDataMap[k] &&
                store.jfGeometryDataMap[k].flushDeviceLayer();
            }, 200);
          });
          saveIsOutDoor(store.cTUserMngServer, location);
          localStorage.removeItem("ue-device-property");
        });
    }
  };

  const saveIsOutDoor = (cTUserMngServer, location) => {
    const buildingEvent = new window["KMapUE"].BuildingEvent(viewer);
    const buildingInfo = buildingEvent.getInfo();
    const isOutDoor =
      !buildingInfo || (buildingInfo && buildingInfo.buildingId === "outdoor");
    const param = {
      appName: globalState.get("userInfo").userName,
      serviceName: "device_position_modify",
      esDataEntityList: location.map((i) => {
        return {
          dataId: i.id,
          appName: globalState.get("userInfo").userName,
          serviceName: "device_position_modify",
          keyValueMap: {
            // buildingId不是outdoor的话就是室内
            outdoor: isOutDoor + "",
          },
        };
      }),
    };
    updateDeviceBuildingInfo(cTUserMngServer, param);
  };

  return (
    <div className="box-jf">
      <div className="left-grid">
        {statistics?.deviceLibraryStatisticsVOS?.map((v, i) => (
          <div className="grid-item-bg" key={i}>
            <div className="grid-item">
              <div className="grid-num">{v.count}</div>
              <div className="grid-title">{v.deviceTypeName}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="left-search">
        <Input.Search
          size="large"
          placeholder="请输入关键字搜索"
          onChange={handleSearch}
        />
        <DeviceFilter onFilter={handleDeviceFilter} />
      </div>
      <Tree
        className="left-tree public-scrollbar"
        blockNode
        checkable
        selectable
        defaultExpandedKeys={["inherent"]}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        checkStrictly={false}
        checkedKeys={store.jfCheckedKeys}
        onCheck={handleCheckInherent}
        onSelect={handleSelect}
        treeData={[
          {
            id: "inherent",
            featureName: "固有资源",
            children: inherentTreeData,
          },
        ]}
        fieldNames={{ key: "id", title: "featureName" }}
        filterNode={filterNode}
        renderTitle={renderTitle}
        renderExtra={renderExtra}
        style={{ maxHeight: "100%" }}
        virtualListProps={{
          height: "90vh",
        }}
      />
      {/* {visible && (
        <DeviceDetail
          visible={visible}
          setVisible={setVisible}
          data={current}
          onClose={() => {
            const deviceType = store.getDeviceType(current);
            const { gbid } = current;
            const layer = store.devicelayerObj[deviceType];
            const layerId = store.devicelayerIds[deviceType];
            if (gbid && layer && layerId) {
              layer.select({
                layerId,
                gbid: "",
              });
            }
          }}
        />
      )} */}
      {/* {!newPageVideo && (
        <VideoAssess data={current} visible={visible} setVisible={setVisible} />
      )} */}
      {/* {isMenu && (
        <div
          className={styles.menu}
          id="fixMenu"
          style={{ left: point.x + 10, top: point.y + 10 }}
        >
          <div onClick={toDetail}>查看详情</div>
          {store.status == "editable" && (<div onClick={handleCorrect}>位置纠偏</div>)}
        </div>
      )} */}
      {/* {store.isCorrect && (
        <PositionCorrect onCancel={correctCancel} onOk={correctOk} />
      )} */}
    </div>
  );
};

export default observer(JiFang);
