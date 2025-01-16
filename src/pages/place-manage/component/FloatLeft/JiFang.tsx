import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { Input, Tree, TreeProps, Tag, Message } from "@arco-design/web-react";
import { tryGet, getFeatureTreeData } from "@/kit";
import { debounce, groupBy } from "lodash";
import {
  temporaryStatistics,
  inherentTreeDevices,
  temporaryTreeDevices,
} from "../../store/webapi";
import { DeviceDetail, VideoAssess } from "@/components";
import store from "../../store/index";
import { IconFile } from "@arco-design/web-react/icon";
import {
  Icons,
  getServerBaseUrl,
  getServerBaseUrlNoPortal,
  unique,
  Trees,
} from "@/kit";

import { icons } from "../ele-store/const";
import moreIcon from "@/assets/img/place-manage/more.png";
import DeviceFilter from "./DeviceFilter";
import { deviceIcons } from "@/pages/constant/index";
import storeAttr from "../../store/attributes-store";
import globalState from "@/globalState";
import { updateLocation, updateDeviceBuildingInfo } from "../../store/webapi";
import appStore from "@/store";
const { getFirstRootKeys } = Trees;
const deviceStatus = Icons.deviceStatus;

const JiFang = () => {
  const [endIndex, setEndIndex] = useState(5);
  const [statistics, setStatistics] = useState([]);
  const [searchText, setSearchText] = useState("");
  // const [visible, setVisible] = useState(false);
  // const [current, setCurrent] = useState<any>({ id: "", gbid: "" });
  // const [currentCopy, setCurrentCopy] = useState({ id: "", gbid: "" });
  // const { baseUrl } = globalState.get();

  // const [geometryDataMap, setGeometryDataMap] = useState({});
  const [inherentTreeData, setInherentTreeData] = useState<FeatureTreeProps[]>(
    []
  );
  const [temporaryTreeData, setTemporaryTreeData] = useState<
    FeatureTreeProps[]
  >([]);
  // const [isCorrent, setIsCorrent] = useState(false);

  const [expandedInherentKeys, setExpandedInherentKeys] = useState([
    "inherent",
  ]);
  const [expandedTemporaryKeys, setExpandedTemporaryKeys] = useState([
    "temporary",
  ]);

  const [treeParams, setTreeParams] = useState({ deviceTypes: [], status: [] });
  // const [isMenu, setIsMenu] = useState(false);
  // const [correctPoint, setCorrectPoint] = useState({ lng: 0, lat: 0, alt: 0 });

  // const [point, setPoint] = useState({
  //   x: 600,
  //   y: 600,
  // });

  const { viewer, selectedPlan, features } = store;
  // const cTUserMngServer = getServerBaseUrl("CTUserMngServer");
  // const [cTUserMngServer, setCTUserMngServer] = useState<string>("");
  // useEffect(() => {
  //   if(!appStore.serviceRoutes) return;
  //   setCTUserMngServer(getServerBaseUrl("CTUserMngServer"));
  // }, [appStore.serviceRoutes]);
  const handleSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);
  useEffect(() => {
    if (store.currentDevice) {
      const { gbid, status, title, deviceType, deviceName } =
        store.currentDevice;
      const name = deviceName || title;
      store.jfVideoVisible &&
        appStore.sendMessage({ gbid, status, deviceType, name });
    }
  }, [store.currentDevice, store.jfVideoVisible]);
  useEffect(() => {
    temporaryStatistics(selectedPlan.id).then((res) =>
      setStatistics(res?.deviceLibraryStatisticsVOS)
    );
    inherentTreeDevices(treeParams).then((res) => {
      setInherentTreeData(res);
      store.delayeringTree(res, "jfInherentData");
    });
    temporaryTreeDevices({ planId: selectedPlan.id, ...treeParams }).then(
      (res) => {
        console.log(res, "zihhhd");
        setTemporaryTreeData(res);
        store.delayeringTree(res, "jfTemporaryData");
        // deviceRedraw(res);
      }
    );
  }, [selectedPlan, treeParams]);
  useEffect(() => {
    if (!store.viewer) return;
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      deviceRedraw(store.jfInherentKeys, store.jfInherentData);
    }, 600);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    store.jfInherentKeys,
    store.jfInherentData,
    store.viewer,
    storeAttr.deviceNameVisible,
  ]);
  useEffect(() => {
    if (!store.viewer) return;
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      deviceRedraw(store.jfTemporaryKeys, store.jfTemporaryData, "temporary");
    }, 600);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [
    store.jfTemporaryKeys,
    store.jfTemporaryData,
    store.viewer,
    storeAttr.deviceNameVisible,
  ]);
  useEffect(() => {
    const hancleClick = (event) => {
      if (event.target.parentElement.id == "fixMenu") {
        return;
      }
    };
    store.changeState({
      toJfDetail: toDetail,
      handleJfCorrect: handleCorrect,
      isMenu: false,
    });
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
      const temporaryData: any = searchData(temporaryTreeData);
      // 合并 keys
      if (inherentData?.length > 0) {
        setExpandedInherentKeys([
          "inherent",
          ...getFirstRootKeys(inherentData, "id"),
        ]);
      }
      if (temporaryData?.length > 0) {
        setExpandedTemporaryKeys([
          "temporary",
          ...getFirstRootKeys(temporaryData, "id"),
        ]);
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
  const requesapi = async (url) => {
    const data = [
      {
        id: "3ce6a9c015b5469885a2fd06bd80eeac",
        gbid: "32050000001321128061",
        longitude: 120.124,
        latitude: 31.124,
        altitude: 25.124,
      },
    ];
    await updateLocation(url, data);
    saveIsOutDoor(url, data);
  };
  // 位置纠偏保存室内室外
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

  const handleSelect = (setExpandedKeys, type) => (selectedKeys, extra) => {
    const { node } = extra;
    const { id, switchAnimation, visualAngle, gbid, deviceType } = node.props;
    if (switchAnimation && visualAngle) {
      const duration =
        JSON.parse(switchAnimation).animationType != "0"
          ? JSON.parse(switchAnimation).animationTime * 1000
          : 0;
      const rotation = JSON.parse(visualAngle).rotation;
      viewer.flyTo({ ...rotation, duration });
    }
    gbid && appStore.getLayerServiceQuery(gbid, store.viewer);
    setExpandedKeys((keys) => {
      if (keys.includes(id)) {
        return keys.filter((k) => k !== id);
      } else {
        return [...keys, id];
      }
    });
    const layer = store.devicelayerObj[type][deviceType];
    const layerId = store.devicelayerIds[type][deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };

  const handleCheckInherent: TreeProps["onCheck"] = (checkedKeys, extra) => {
    // const { checked, checkedNodes } = extra;
    store.jfInherentKeys = checkedKeys;
    // deviceRedraw({ checked, checkedNodes, type: "inherent" });
  };

  const handleCheckTemporary: TreeProps["onCheck"] = (checkedKeys, extra) => {
    // debugger
    const editData = store.jfTemporaryKeys.filter((item: any) => {
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
      store.jfTemporaryKeys = checkedKeys;
    } else {
      store.jfTemporaryKeys = checkedKeys;
    }

    // const { checked, checkedNodes } = extra;
    // deviceRedraw({ checked, checkedNodes, type: "temporary" });
  };

  const renderExtra = (props, type) => {
    const { id } = props;
    if (id === "inherent" || id === "temporary") return null;

    return (
      <div className="feature-extra">
        {props.deviceType && (
          <IconFile
            style={{ fontSize: 18 }}
            onClick={() => onDetail({ ...props, type })}
          />
        )}
      </div>
    );
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
  const removeAllLayer = (type) => {
    try {
      if (store.devicelayerObj[type]) {
        for (const key in store.devicelayerObj[type]) {
          const item = store.devicelayerObj[type][key];
          if (item) {
            item?.remove();
            store.devicelayerObj[type][key] = null;
            store.devicelayerIds[type][key] = null;
            store.changeState({
              jfGeometryDataMap: {
                ...store.jfGeometryDataMap,
                [type + key]: null,
              },
            });
          }
        }
      }
    } catch (error) {}
  };
  const deviceRedraw = (keys = [], data = [], type = "inherent") => {
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
    if (storeAttr.isCreateLayer) {
      removeAllLayer(type);
      // storeAttr.isCreateLayer = false;
    }
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
          value: getGbids("IPC_1"),
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
          value: getGbids("IPC_3"),
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
          value: getGbids("BWC"),
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
          value: getGbids("PTT"),
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
          value: getGbids("PAD"),
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
          value: getGbids("TOLLGATE"),
          termType: "in",
          filterType: 1,
        },
      ],
    };

    Object.keys(filterTerms).forEach((k) => {
      if (getGbids(k).length > 0) {
        if (store.devicelayerObj[type][k]) {
          // 拿到新的key后判断，如果已经存在当前类型的layer就调用更新方法
          // 说明已经创建过此图层
          // 直接更新
          store.devicelayerObj[type][k].filter({ filterTerms: filterTerms[k] });
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
                store.devicelayerIds[type][k] = res;
                store.changeState({
                  jfGeometryDataMap: {
                    ...store.jfGeometryDataMap,
                    [type + k]: devicelayer,
                  },
                });
              },
              onError: (err) => {
                console.error("=======onError===========", err);
              },
            },
          });
          store.devicelayerObj[type][k] = devicelayer;
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
              console.log(res, "contextmenucontextmenucontextmenu");
              // setIsMenu(true);
              store.changeState({
                isMenu: true,
                defenseStatus: "jf",
              });
              const properties = tryGet(res.data, "payload.properties");
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
              store.correctLLA = {
                lng: geometry.coordinates[0],
                lat: geometry.coordinates[1],
                alt: geometry.coordinates[2] || 0,
              };
              properties.deviceName = properties.deviceName || properties.name;
              properties.type = type;
              if (res.screenPosition) {
                // setPoint(res.screenPosition);
                store.changeState({
                  menuPoint: res.screenPosition,
                });
              }
              // setCurrent(properties);
              store.changeState({
                jfCurrent: properties,
              });
              // setCurrentCopy({ gbid: properties.gbid, id: res.data.layerId });
              store.changeState({
                jfCurrentCopy: { gbid: properties.gbid, id: res.data.layerId },
              });
            });
          }, 1000);
        }
      } else {
        // 如果没有设备但是一个空图层的话就可以移除该图层
        if (store.devicelayerObj[type][k]) {
          store.jfGeometryDataMap[type + k]?.remove();
          store.devicelayerObj[type][k] = null;
          store.devicelayerIds[type][k] = null;
          // setGeometryDataMap((dataMap) => ({
          //   ...dataMap,
          //   [type + k]: null,
          // }));

          store.changeState({
            jfGeometryDataMap: { ...store.jfGeometryDataMap, [type + k]: null },
          });
        }
      }
    });
  };
  useEffect(() => {
    if (store.viewer) {
      storeAttr.viewer = store.viewer;
      storeAttr.createGizmoControl();
    }
  }, [store.viewer]);
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

    Message.success("更新成功");
    localStorage.removeItem("ue-device-property");
    correctCancel(false);
  };

  const correctCancel = (cancelOnly = true) => {
    if (!store.isCorrect) return;
    // setIsCorrent(false);
    store.changeState({
      isCorrect: false,
      isView: false,
      geometryPosition: null,
    });
    // setIsMenu(false);
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
          localStorage.removeItem("ue-device-property");
          saveIsOutDoor(store.cTUserMngServer, location);
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
    // setIsCorrent(true);
    store.changeState({
      isMenu: false,
    });
    store.changeState({
      correctCancel,
      correctOk,
    });
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
      // setCorrectPoint(res);
      store.changeState({
        jfCorrectPoint: res,
      });
      store.correctLLA = res;
      store.changeState({
        geometryPosition: res,
      });
      const Point = getToArr(res);
      console.log(res, "take_pointtake_pointv");

      const data = {
        id: store.menuFeatureId,
        iconPosition: Point,
      };
      const iconPosition = data?.iconPosition;
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
      const location = [
        {
          id: store.jfCurrent.id,
          gbid: store.jfCurrent.gbid,
          longitude: res.lng,
          latitude: res.lat,
          altitude: res.alt,
        },
      ];
      console.log(store.cTUserMngServer, "cTUserMngServer");
      // updateLocation(cTUserMngServer, location).then(() => {
      //   Object.keys(store.jfGeometryDataMap).forEach((k) => {
      //     // debugger
      //     store.jfGeometryDataMap[k] && store.jfGeometryDataMap[k].flushDeviceLayer();
      //   });
      //  saveIsOutDoor(cTUserMngServer, location);
      // });
      // geometryDataMap.map(layerItem => {
      //   layerItem.flushDeviceLayer()
      // });

      // setTimeout(() => {
      //   storeAttr.openGizmoControl(true, () => {
      //     storeAttr.gizmoControl.attachElement({
      //       type: "device",
      //       id: store.jfCurrentCopy.gbid,
      //       layerId: store.jfCurrentCopy.id,
      //       onComplete: (res) => { },
      //       onError: (err) => { },
      //     });
      //   });
      // }, 200);
    });
  };

  const toDetail = () => {
    store.changeState({
      isMenu: false,
      jfVideoVisible: true,
      currentDevice: store.jfCurrent,
    });
    // setVisible(true);
    const deviceType = store.getDeviceType(store.jfCurrent);
    const { type, gbid } = store.jfCurrent;
    const layer = store.devicelayerObj[type][deviceType];
    const layerId = store.devicelayerIds[type][deviceType];
    if (gbid && layer && layerId) {
      layer.select({
        layerId,
        gbid: gbid,
      });
    }
  };

  const renderTitle = (props) => {
    const { title, status, featureType, featureCode, deviceType } = props;
    let prefix = null;

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
        <>
          {status == 0 && (
            <Tag
              size="small"
              style={{
                backgroundColor: "rgba(0, 255, 192, 0.2)",
                borderColor: "#00ffc0",
                color: "#00ffc0",
              }}
              bordered
            >
              在线
            </Tag>
          )}
          {status == 1 && (
            <Tag
              size="small"
              style={{
                backgroundColor: "rgba(186, 186, 186, 0.2)",
                borderColor: "#bababa",
                color: "#bababa",
              }}
              bordered
            >
              离线
            </Tag>
          )}
          {status == 2 && (
            <Tag
              size="small"
              style={{
                backgroundColor: "rgba(216, 73, 44, 0.2)",
                borderColor: "#d8492c",
                color: "#d8492c",
              }}
              bordered
            >
              故障
            </Tag>
          )}
          <img
            className="feature-icon"
            src={deviceStatus[`${deviceType}_${status}`]}
            width={26}
            style={{ marginRight: 4 }}
          />
        </>
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
  const { jfInherentKeys, jfTemporaryKeys } = store;
  return (
    <div className="box-jf">
      <div className="left-grid">
        {statistics?.slice(0, endIndex).map((v, i) => (
          <div className="grid-item-bg" key={i}>
            <div className="grid-item">
              <div className="grid-num">{v.count}</div>
              <div className="grid-title">{v.deviceTypeName}</div>
            </div>
          </div>
        ))}
        {statistics?.length > 5 && (
          <div className="grid-item-bg">
            <div
              className="grid-item"
              onClick={() => setEndIndex(endIndex === 5 ? -1 : 5)}
            >
              <div className="grid-more" end-index={endIndex}>
                <span>{endIndex === 5 ? "更多" : "收起"}</span>
                <img src={moreIcon} width={18} />
              </div>
            </div>
          </div>
        )}
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
        className="left-tree"
        blockNode
        checkable
        selectable
        expandedKeys={expandedInherentKeys}
        onExpand={setExpandedInherentKeys}
        checkStrictly={false}
        checkedKeys={jfInherentKeys}
        onCheck={handleCheckInherent}
        onSelect={handleSelect(setExpandedInherentKeys, "inherent")}
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
        renderExtra={(val) => renderExtra(val, "inherent")}
      />
      <Tree
        className="left-tree"
        blockNode
        checkable
        selectable
        expandedKeys={expandedTemporaryKeys}
        onExpand={setExpandedTemporaryKeys}
        checkStrictly={false}
        checkedKeys={jfTemporaryKeys}
        onCheck={handleCheckTemporary}
        onSelect={handleSelect(setExpandedTemporaryKeys, "temporary")}
        treeData={[
          {
            id: "temporary",
            featureName: "临时资源",
            children: temporaryTreeData,
          },
        ]}
        fieldNames={{ key: "id", title: "featureName" }}
        filterNode={filterNode}
        renderTitle={renderTitle}
        renderExtra={(val) => renderExtra(val, "temporary")}
      />
      {/* {visible && (
        <DeviceDetail
          visible={visible}
          setVisible={setVisible}
          data={current}
          onClose={() => {
            const deviceType = store.getDeviceType(current);
            const { type, gbid } = current;
            const layer = store.devicelayerObj[type][deviceType];
            const layerId = store.devicelayerIds[type][deviceType];
            if (gbid && layer && layerId) {
              layer.select({
                layerId,
                gbid: "",
              });
            }
          }}
        />
      )} */}

      {/* {isMenu && (
        <div
          className={styles.menu}
          id="fixMenu"
          style={{ left: point.x + 10, top: point.y + 10 }}
        >
          <div onClick={toDetail}>查看详情</div>
          {(store.status == "editable" && current.type == "temporary") && <div onClick={handleCorrect}>位置纠偏</div>}
        </div>
      )} */}
      {/* {store.isCorrect && (
        <PositionCorrect onCancel={correctCancel} onOk={correctOk} />
      )} */}
    </div>
  );
};

export default observer(JiFang);
