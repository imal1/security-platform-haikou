import {
  Input,
  Message,
  Popconfirm,
  Tooltip,
  Tree,
} from "@arco-design/web-react";
import { debounce, union, without } from "lodash";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import { useCallback, useEffect, useState } from "react";
import styles from "./WuFang.module.less";

import moreIcon from "@/assets/img/place-manage/more.png";
import deleteIcon from "@/assets/img/place-manage/tree-delete.png";
import editIcon from "@/assets/img/place-manage/tree-edit.png";
import { getFeatureTreeData } from "@/kit";
import { getVenueId } from "../../../../kit/util";
import { codeMap } from "../../../constant/index";
import {
  default as attrStore,
  default as storeAttr,
} from "../../store/attributes-store";
import store from "../../store/index";
import {
  getInherentFeatureDetail,
  getTemporaryFeatureDetail,
  inherentTree,
  reSequence,
  temporaryDelete,
  temporaryStatistics,
  temporaryTree,
  updateIconPosition,
} from "../../store/webapi";
import { icons } from "../ele-store/const";

const WuFang = () => {
  const [endIndex, setEndIndex] = useState(5);
  const [statistics, setStatistics] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [zrqgroup1, setZrqgroup1] = useState([]);
  const [zrqgroup2, setZrqgroup2] = useState([]);

  const [geometryDataMap, setGeometryDataMap] = useState({});
  const [inherentTreeData, setInherentTreeData] = useState<FeatureTreeProps[]>(
    [],
  );
  const [temporaryTreeData, setTemporaryTreeData] = useState<
    FeatureTreeProps[]
  >([]);

  const [selecteditem, setSelectItem] = useState([]);
  const [isMenu, setIsMenu] = useState(false);
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isMenuInherent, setIsMenuInherent] = useState(false);

  // const [isCorrent, setIsCorrent] = useState(false);
  const [expandedInherentKeys, setExpandedInherentKeys] = useState([
    "inherent",
  ]);
  const [expandedTemporaryKeys, setExpandedTemporaryKeys] = useState([
    "temporary",
  ]);

  const [point, setPoint] = useState({
    x: 600,
    y: 600,
  });

  const [correctPoint, setCorrectPoint] = useState<{
    modelPosition?: any;
    modelHeight?: number;
    iconPosition?: any;
  }>({});

  const {
    viewer,
    status,
    selectedPlan,
    features,
    checkedKeysArr,
    checkedKeysInherentArr,
    editFeature,
    isAttributes,
    geometryDataMapStore,
    openComponentFrame,
    closeComponentFrame,
  } = store;
  const venueId = getVenueId();

  useEffect(() => {
    try {
      if (store.viewer) {
        storeAttr.viewer = store.viewer;
        storeAttr.createGizmoControl();
      }
    } catch (error) {}
  }, [store.viewer]);

  useEffect(() => {
    store.changeState({
      toWfDetail: toDetail,
      handleWfEditUe: handleEditUe,
      handleWfCorrect: handleCorrect,
    });
    const hancleClick = (event) => {
      if (event.target.parentElement.id == "fixMenu") {
        return;
      }
      setIsMenu(false);
      store.changeState({
        isMenu: false,
      });
    };

    document.addEventListener("click", hancleClick, true);

    return () => {
      attrStore.destroyAllNnzrg();
      document.removeEventListener("click", hancleClick, true);
    };
  }, []);
  useEffect(() => {
    setFirstExpanded();
  }, [searchText]);
  const setFirstExpanded = () => {
    try {
      const inherentData = searchData(inherentTreeData);
      const temporaryData = searchData(temporaryTreeData);
      // 合并 keys
      setExpandedInherentKeys(["inherent", inherentData[0]?.id]);
      setExpandedTemporaryKeys(["temporary", temporaryData[0]?.id]);
    } catch (error) {}
  };
  const searchData = (TreeData) => {
    const loop = (data) => {
      const result = [];

      data.forEach((item) => {
        if (
          item.featureName.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        ) {
          result.push({ ...item });
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
  const handleSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);
  useEffect(() => {
    if (attrStore.addElement) {
      const { id, element } = attrStore.addElement;
      const uid = "temporary" + id;
      try {
        if ([1, 2, 3].includes(attrStore.attrType)) {
          setTimeout(() => {
            element.on("contextmenu", (v) => areaFeatureMenu(v, "temporary"));
          }, 1000);
        } else {
          element.on("contextmenu", (v) => featureMenu(v, "temporary"));
          element.on("click", (v) => featureEvent(v, "temporary"));
        }
      } catch (error) {
        console.error("addElement", element, error);
      }

      setGeometryDataMap({
        ...geometryDataMap,
        [uid]: element,
      });
    }
  }, [attrStore.addElement]);
  useEffect(() => {
    temporaryStatistics(selectedPlan.id).then((res) =>
      setStatistics(res?.featureLibraryStatisticsVOList),
    );
    inherentTree(venueId).then((res) => {
      res = getFeatureTreeData(res);
      setInherentTreeData(res);
      store.delayeringTree(res, "wfInherentTreeData");
    });
    temporaryTree(selectedPlan.id).then((res) => {
      res = getFeatureTreeData(res);
      setTemporaryTreeData(res);
      store.delayeringTree(res, "wfTemporaryTreeData");
    });
  }, [selectedPlan]);
  useEffect(() => {
    featureDiagram(
      store.wfInherentTreeData,
      store.checkedKeysInherentArr,
      "inherent",
    );
    const zrqgroup = store.wfInherentTreeData
      .filter(
        (item) =>
          store.checkedKeysInherentArr.includes(item.id) && item.sceneId,
      )
      .map((row) => {
        const featureStyle = JSON.parse(row.featureStyle || "{}");
        return {
          id: row.sceneId,
          color: featureStyle.fillColor,
          uid: "inherent" + row.id,
        };
      });
    setZrqgroup1(zrqgroup);
    // attrStore.zrqgroup = zrqgroup;
  }, [store.checkedKeysInherentArr]);
  useEffect(() => {
    featureDiagram(
      store.wfTemporaryTreeData,
      store.checkedKeysArr,
      "temporary",
    );
    const zrqgroup = store.wfTemporaryTreeData
      .filter((item) => store.checkedKeysArr.includes(item.id) && item.sceneId)
      .map((row) => {
        const featureStyle = JSON.parse(row.featureStyle || "{}");
        return {
          id: row.sceneId,
          color: featureStyle.fillColor,
          uid: "temporary" + row.id,
        };
      });
    setZrqgroup2(zrqgroup);
  }, [store.checkedKeysArr]);

  useEffect(() => {
    const zrqgroup = [...zrqgroup1, ...zrqgroup2];
    attrStore.addNnzrg(zrqgroup);
  }, [zrqgroup1, zrqgroup2]);
  useEffect(() => {
    const transformUe = storeAttr.transformUe;
    if (transformUe !== null) {
      store.correctLLA = transformUe.position;
    }
  }, [storeAttr.transformUe]);
  useEffect(() => {
    let inherentCheckedKeysData = union(
      store.checkedKeysInherentArr,
      store.showKey?.inherent || [],
    );
    let temporaryCheckedKeysData = union(
      store.checkedKeysArr,
      store.showKey?.temporary || [],
    );
    const { inherent = [], temporary = [] } = store.hideKey;
    if (inherent.length > 0) {
      inherent.push("inherent");
    }
    if (temporary.length > 0) {
      temporary.push("temporary");
    }
    if (store.editFeature?.id) {
      temporary.push(store.editFeature?.id);
    }
    inherentCheckedKeysData = without(
      inherentCheckedKeysData,
      ...(inherent || []),
    );
    temporaryCheckedKeysData = without(
      temporaryCheckedKeysData,
      ...(temporary || []),
    );
    store.checkedKeysInherentArr = inherentCheckedKeysData;
    store.checkedKeysArr = temporaryCheckedKeysData;
  }, [store.showKey, store.hideKey]);
  const handleSelect = (setExpandedKeys, type) => (selectedKeys, extra) => {
    const { node } = extra;
    setSelectItem(selectedKeys);
    const { id, switchAnimation, visualAngle } = node.props;
    const uid = type + id;
    if (
      store.geometryDataMapStore[uid] &&
      store.geometryDataMapStore[uid].select
    ) {
      store.geometryDataMapStore[uid].select(true);
    }
    if (switchAnimation && visualAngle) {
      const duration =
        JSON.parse(switchAnimation).animationType != "0"
          ? JSON.parse(switchAnimation).animationTime * 1000
          : 0;
      const rotation = JSON.parse(visualAngle).rotation;
      viewer.flyTo({ ...rotation, duration });
    }
    setExpandedKeys((keys) => {
      if (keys.includes(id)) {
        return keys.filter((k) => k !== id);
      } else {
        return [...keys, id];
      }
    });
  };

  const getCorrectItem = (id) => {
    getTemporaryFeatureDetail(id).then((res) => {
      store.correctEleData = res;
      store.hasCorrectDetail =
        res.popFrameStyle && res.popFrameStyle.gizmoStatus == "true"
          ? true
          : false;
      if (!store.hasCorrectDetail && store.status !== "editable") {
        Message.info("该要素未添加组件弹窗");
      }
    });
  };

  const exchangePosition = (iconPosition, isText = false) => {
    return Array.isArray(iconPosition.position)
      ? {
          lng: iconPosition.position[0][0],
          lat: iconPosition.position[0][1],
          alt: isText ? iconPosition.height + 1 : iconPosition.height,
        }
      : iconPosition.position;
  };
  const setFeatureNameShowHide = (geometryObj, val, values?) => {
    try {
      setTimeout(() => {
        if (val) {
          const { featureName, fontColor, fontSize, fontAnchor } = values;
          geometryObj.showLabel({
            text: featureName,
            style: {
              fontColor,
              fontSize,
              fontAnchor,
            },
          });
        } else {
          geometryObj.hideLabel();
        }
      }, 100);
    } catch (error) {}
  };
  const getElementType = (v) => {
    const { type } = v;
    if (type == "model") {
      return "elementModel";
    } else if (type == "label") {
      return "label";
    } else if (type == "road") {
      return "roadlabel";
    } else {
      return "elementIcon";
    }
  };
  const areaFeatureMenu = useCallback(
    (v, type = "temporary") => {
      console.log("area contextmenu: ", v);
      if (store.isCorrect || store.isAttributes) return null;
      if (type === "inherent") {
        return null;
      } else {
        setTimeout(() => {
          setIsMenu(true);
          store.changeState({
            defenseStatus: "wf",
            isMenu: true,
          });
        }, 100);
      }

      store.changeState({
        elementFeature: v,
      });

      let vid = v.id;
      let obj = {};

      for (let key in toJS(store.geometryDataMapStore)) {
        const item = store.geometryDataMapStore[key];
        if (v.type == "encloure") {
          obj[key] = item && item.getData().wallId;
        } else if (v.type == "route") {
          obj[key] = item && item.getData().routeId;
        } else {
          obj[key] = item && item.getData().Id;
        }
      }
      console.log(obj, "objobj");
      const getKeyByValue = (obj, vid) => {
        const keys = Object.keys(obj);
        const key = keys.find((key) => obj[key] === vid);
        return key || null;
      };
      const res = getKeyByValue(obj, vid);
      if (res) {
        setSelectItem([Number(res.slice(9))]);
      }

      if (v.screenPosition) {
        // setPoint(v.screenPosition);
        store.changeState({
          menuPoint: v.screenPosition,
        });
      }

      const acce =
        type === "inherent"
          ? res.substring(8, res.length)
          : res.substring(9, res.length);
      store.changeState({
        menuFeatureId: acce,
        menuFeatureType: type,
        tempId: res,
      });
      getCorrectItem(acce);
    },
    [geometryDataMap],
  );
  const areaFeatureEvent = useCallback(
    (v, type?: string) => {
      console.log("area clickevent: ", v);
    },
    [geometryDataMap],
  );
  const featureMenu = useCallback(
    (v, type) => {
      console.log(v, "dddd");
      if (store.isCorrect || store.isAttributes) return null;
      if (type === "inherent") {
        Message.info("请到场所管理页面编辑固有资源");
        return null;
      } else {
        setTimeout(() => {
          setIsMenu(true);
          store.changeState({
            defenseStatus: "wf",
            isMenu: true,
          });
        }, 100);
      }

      store.changeState({
        elementFeature: v,
      });
      attrStore.elementType = getElementType(v);
      let vid = v.id;
      let obj = {};
      if (store.geometryDataMapStore) {
        for (let key in toJS(store.geometryDataMapStore)) {
          const item = store.geometryDataMapStore[key];
          obj[key] = item && item.getData().id;
        }
        console.log(obj, "objobj");
        const getKeyByValue = (obj, vid) => {
          const keys = Object.keys(obj);
          const key = keys.find((key) => obj[key] === vid);
          return key || null;
        };
        const res = getKeyByValue(obj, vid);
        if (res) {
          setSelectItem([Number(res.slice(9))]);
        }

        if (v.screenPosition) {
          // setPoint(v.screenPosition);
          store.changeState({
            menuPoint: v.screenPosition,
          });
        }

        const acce =
          type === "inherent"
            ? res.substring(8, res.length)
            : res.substring(9, res.length);
        store.changeState({
          menuFeatureId: acce,
          menuFeatureType: type,
          tempId: res,
        });
        getCorrectItem(acce);
      }
    },
    [geometryDataMap],
  );
  const featureEvent = useCallback(
    (v, type) => {
      let vid = v.id;
      let vtype = v.type;
      let obj = {};
      if (!store.isCorrect && !store.isAttributes) return null;
      let elementType = "";
      store.isCorrect && (elementType = getAttachElementType(vtype));
      store.isAttributes && (elementType = getAttachElementType(vtype));
      if (store.geometryObj && store.geometryObj.getData().id == vid) {
        storeAttr.openGizmoControl(true, () => {
          if (elementType != "elementModel") {
            storeAttr.gizmoControl.setMode("translate");
          }
          storeAttr.gizmoControl.attachElement({
            type: elementType, // 可选值：elementIcon、elementModel、label、roadlabel
            id: store.elementFeature.id,
            onComplete: (res) => {
              attrStore.gizmoControl.setBlockLists([
                "EnclosureActor",
                "BP_MyLabel_C",
                "BP_Road1_C",
                "BP_BiaoDian_C",
                "PhysicalDefenseActor",
                "APoiDeviceActor",
                "PoiDeviceActor",
              ]);
            },
            onError: (err) => {},
          });
        });
        // if (attrStore.gizmoControl.getStatus()) {
        //   // attrStore.clearGizmoControl();
        // } else {

        // }
      } else {
        attrStore.clearGizmoControl();
      }
      if (store.geometryDataMapStore) {
        for (let key in toJS(store.geometryDataMapStore)) {
          const item = store.geometryDataMapStore[key];
          obj[key] = item.getData().id;
        }
        console.log(obj, "objobj", v);
        const getKeyByValue = (obj, vid) => {
          const keys = Object.keys(obj);
          const key = keys.find((key) => obj[key] === v);
          return key || null;
        };

        const res = getKeyByValue(obj, vid);
        setSelectItem([Number(res.slice(9))]);

        const tempId = res;
        const acce =
          type === "inherent"
            ? res.substring(8, res.length)
            : res.substring(9, res.length);
        const getFunction =
          type === "inherent"
            ? getInherentFeatureDetail
            : getTemporaryFeatureDetail;
        console.log(acce, "obj, vobj, vobj, v");
        // getFunction(acce).then((res) => {
        //   console.log(res, "res");

        // });
      }
    },
    [geometryDataMap],
  );
  //物防上图
  const featureDiagram = (data = [], keys = [], type) => {
    try {
      keys = keys.filter((item) => !["inherent", "temporary"].includes(item));
      const { viewer } = store;
      store.batchData = [];
      store.signpostBatchData = [];
      store.labelBatchData = [];
      store.areaBatchData = [];
      store.batchRemoveData = [];
      store.batchRemoveAreaData = { ids: [], wallIds: [], routeIds: [] };
      store.batchIdMap = new Map();
      store.batchPropertyMap = new Map();
      data
        .filter((item) => item.featureCode)
        .forEach((item) => {
          const {
            id,
            featureType,
            featureCode,
            featureName,
            aliasName,
            showName = false,
            sceneId,
          } = item;
          const checked = keys.includes(id);
          const uid = type + id;
          if (
            (geometryDataMap[uid] && checked) ||
            (!geometryDataMap[uid] && !checked)
          ) {
            return;
          }
          // redrawData 回显对象  场地是几何信息 其他的是id
          const redrawData = item.geometry || "{}";

          const featureStyle = JSON.parse(item.featureStyle || "{}");
          const iconPosition = JSON.parse(item.iconPosition || "{}");
          const textParams = {
            featureName,
            ...featureStyle,
          };
          try {
            // 区域上图和隐藏
            if (featureType === "SITE_DRAWING") {
              const redrawData = JSON.parse(item.geometry || "{}");

              const geometryUtil = new window["KMapUE"].GeometryUtil({
                viewer,
              });

              try {
                let geometryStyle: any = {};
                featureStyle &&
                  featureStyle.fillColor &&
                  (geometryStyle.fillColor = sceneId
                    ? "#00000000"
                    : featureStyle.fillColor);
                featureStyle &&
                  featureStyle.outlineColor &&
                  (geometryStyle.outlineColor = sceneId
                    ? "#00000000"
                    : featureStyle.outlineColor);
                featureStyle &&
                  featureStyle.outlineWidth &&
                  (geometryStyle.outlineWidth = featureStyle.outlineWidth);
                redrawData.Style = geometryStyle;
                if (featureCode === "WALL") {
                  let closureStyle: any = {};
                  closureStyle.type = "2";
                  featureStyle &&
                    featureStyle.scale &&
                    (closureStyle.scale = featureStyle.scale);
                  featureStyle &&
                    featureStyle.brightness &&
                    (closureStyle.brightness = featureStyle.brightness);
                  featureStyle &&
                    featureStyle.fillColor &&
                    (closureStyle.fillColor = featureStyle.fillColor);
                  redrawData.closureStyle = closureStyle;
                }
                if (featureCode === "ROUTE") {
                  let routeStyle: any = {};
                  featureStyle &&
                    featureStyle.routeColor &&
                    (routeStyle.routeColor = featureStyle.routeColor);
                  featureStyle &&
                    featureStyle.routeWidth &&
                    (routeStyle.routeWidth = featureStyle.routeWidth);
                  featureStyle &&
                    featureStyle.opacity &&
                    (routeStyle.routeOpacity = featureStyle.opacity / 100);
                  redrawData.routeStyle = routeStyle;
                }
                // 区域回显
                if (checked) {
                  redrawData.Id && store.areaBatchData.push(redrawData);
                  store.batchIdMap.set(redrawData.Id, uid);
                  store.batchPropertyMap.set(redrawData.Id, {
                    showName,
                    textParams,
                  });
                } else {
                  // debugger
                  const geometryUtil = new window["KMapUE"].GeometryUtil({
                    viewer: store.viewer,
                  });
                  closeComponentFrame(uid);
                  setFeatureNameShowHide(geometryDataMap[uid], false);
                  if (featureCode === "WALL") {
                    console.log("redrawData", redrawData);
                    geometryUtil.remove({
                      ids: [redrawData?.Id],
                      wallIds: [redrawData?.wallId],
                    });
                  } else if (featureCode === "ROUTE") {
                    geometryUtil.remove({
                      ids: [redrawData?.Id],
                      routeIds: [redrawData?.routeId],
                    });
                  } else {
                    redrawData?.Id &&
                      geometryUtil.remove({ ids: [redrawData?.Id] });
                  }
                  setGeometryDataMap((dataMap) => ({
                    ...dataMap,
                    [uid]: null,
                  }));
                }
              } catch (error) {}
            }
          } catch (error) {}
          try {
            // WuFang 上图
            if (checked && featureType === "PHYSICAL_DEFENSE") {
              const { showModel, position, iconPosition } = item;
              const modelStyle = JSON.parse(item.modelStyle || "{}");
              store.batchIdMap.set(redrawData, uid);
              store.batchData.push({
                id: redrawData,
                featureStyle,
                color: codeMap[featureCode],
                height: JSON.parse(iconPosition).height,
                scale: featureStyle.scale,
                modelScale: modelStyle.modelScale,
                modelAltitude: modelStyle.modelAltitude,
                modelPosition: position
                  ? JSON.parse(position)
                  : JSON.parse(iconPosition).position,
                type: showModel ? "model" : "icon",
                elementType: featureCode,
                modelWidth: modelStyle.modelWidth,
                modelHeight: modelStyle.modelHeight,
                rotation: modelStyle.rotation,
                position: JSON.parse(iconPosition).position,
                name: featureName,
                nameShow: showName,
                nameAnchor: featureStyle.fontAnchor,
                fontColor: featureStyle.fontColor,
                fontSize: featureStyle.fontSize,
              });
            } else if (!checked && featureType === "PHYSICAL_DEFENSE") {
              store.batchRemoveData.push(redrawData);
              store.batchIdMap.set(redrawData, uid);
            }
          } catch (error) {}
          try {
            // 设施 上图
            if (checked && featureType === "VENUE_FACILITY") {
              // 文本
              if (featureCode === "TEXT") {
                let fontStyle: any = {};
                featureStyle &&
                  featureStyle.fontColor &&
                  (fontStyle.fontColor = featureStyle.fontColor);
                featureStyle &&
                  featureStyle.fontSize &&
                  (fontStyle.fontSize = featureStyle.fontSize);
                featureStyle &&
                  featureStyle.backgroundColor &&
                  (fontStyle.backgroundColor = featureStyle.backgroundColor);
                store.batchIdMap.set(redrawData, uid);
                store.labelBatchData.push({
                  id: redrawData,
                  text: featureName,
                  color: codeMap[featureCode],
                  position: exchangePosition(iconPosition, true),
                  style: fontStyle,
                });
              } else if (featureCode === "SIGNPOST") {
                console.log(
                  iconPosition,
                  redrawData,
                  "iconPos666itioniconPosition",
                );
                store.batchIdMap.set(redrawData, uid);
                store.signpostBatchData.push({
                  id: redrawData,
                  text: aliasName,
                  position: exchangePosition(iconPosition),
                });
              } else {
                const { showModel, position, iconPosition } = item;
                store.batchIdMap.set(redrawData, uid);
                store.batchData.push({
                  id: redrawData,
                  height: JSON.parse(iconPosition).height,
                  type: "icon",
                  scale: featureStyle.scale,
                  elementType: featureCode,
                  position: showModel
                    ? JSON.parse(position)
                    : JSON.parse(iconPosition).position,
                  color: codeMap[featureCode],
                  name: featureName,
                  nameShow: showName,
                  nameAnchor: featureStyle.fontAnchor,
                  fontColor: featureStyle.fontColor,
                  fontSize: featureStyle.fontSize,
                });
              }
            } else if (!checked && featureType === "VENUE_FACILITY") {
              if (featureCode === "TEXT") {
                const TEXT = new window["KMapUE"].LabelBatch({
                  viewer,
                });
                redrawData && TEXT.removeById(redrawData);
                geometryDataMap?.[uid].remove &&
                  geometryDataMap?.[uid]?.remove();
                setGeometryDataMap((dataMap) => ({ ...dataMap, [uid]: null }));
                closeComponentFrame(uid);
              }
              if (featureCode === "SIGNPOST") {
                const SIGNPOST = new window["KMapUE"].RoadLabelBatch({
                  viewer,
                });
                redrawData && SIGNPOST.removeById(redrawData);
                setGeometryDataMap((dataMap) => ({ ...dataMap, [uid]: null }));
                closeComponentFrame(uid);
              } else {
                store.batchRemoveData.push(redrawData);
                store.batchIdMap.set(redrawData, uid);
              }
            }
          } catch (error) {}
        });
      try {
        const geometryUtil = new window["KMapUE"].GeometryUtil({
          viewer: store.viewer,
        });
        store.areaBatchData?.length > 0 &&
          geometryUtil.redraw(
            {
              data: store.areaBatchData,
              onComplete: (areaMap: any) => {
                console.warn("areaMap", areaMap, areaMap.size);

                areaMap.forEach((item: any, index: string) => {
                  console.log(
                    "areaMap foreach: ",
                    item,
                    index,
                    store.batchIdMap.get(index),
                  );

                  setGeometryDataMap((dataMap) => ({
                    ...dataMap,
                    [store.batchIdMap.get(index)]: item,
                  }));
                  setFeatureNameShowHide(
                    item,
                    store.batchPropertyMap.get(index).showName,
                    store.batchPropertyMap.get(index).textParams,
                  );
                  item?.on("click", (v) => areaFeatureEvent(v, type));
                  item?.on("contextmenu", (v) => areaFeatureMenu(v, type));
                });
              },
            },
            store.viewer,
          );

        if (store.batchRemoveAreaData?.ids.length > 0) {
          geometryUtil.remove({
            ...store.batchRemoveAreaData,
          });
          store.batchRemoveAreaData?.ids.forEach((item: string) => {
            closeComponentFrame(store.batchIdMap.get(item));
            setFeatureNameShowHide(
              geometryDataMap[store.batchIdMap.get(item)],
              false,
            );
            setGeometryDataMap((dataMap) => ({
              ...dataMap,
              [store.batchIdMap.get(item)]: null,
            }));
          });
        }

        const elementBatch = new window["KMapUE"].SecurityElementBatch({
          viewer: store.viewer,
        });
        // debugger
        elementBatch.add({
          options: store.batchData,
          onComplete: (elementMap: any) => {
            console.log("elementMap: ", elementMap);
            elementMap.forEach((element, key) => {
              setGeometryDataMap((dataMap) => ({
                ...dataMap,
                [store.batchIdMap.get(key)]: element,
              }));
              setTimeout(() => {
                element.on("click", (v) => featureEvent(v, type));
                element.on("contextmenu", (v) => featureMenu(v, type));
              }, 200);
            });
          },
        });

        if (store.batchRemoveData.length > 0) {
          elementBatch.removeIds(store.batchRemoveData);
          store.batchRemoveData.forEach((item: string) => {
            setGeometryDataMap((dataMap) => ({
              ...dataMap,
              [store.batchIdMap.get(item)]: null,
            }));
            closeComponentFrame(store.batchIdMap.get(item));
          });
        }

        const signBatch = new window["KMapUE"].RoadLabelBatch({
          viewer: store.viewer,
        });
        signBatch.add({
          options: store.signpostBatchData,
          onComplete: (signMap: any) => {
            console.log("signMap: ", signMap);
            signMap.forEach((element, key) => {
              setGeometryDataMap((dataMap) => ({
                ...dataMap,
                [store.batchIdMap.get(key)]: element,
              }));
              setTimeout(() => {
                element.on("click", (v) => featureEvent(v, type));
                element.on("contextmenu", (v) => featureMenu(v, type));
              }, 200);
            });
          },
        });

        const labelBatch = new window["KMapUE"].LabelBatch({
          viewer: store.viewer,
        });
        labelBatch.add({
          options: store.labelBatchData,
          onComplete: (labelMap: any) => {
            console.log("labelMap: ", labelMap);
            labelMap.forEach((element, key) => {
              setGeometryDataMap((dataMap) => ({
                ...dataMap,
                [store.batchIdMap.get(key)]: element,
              }));
              setTimeout(() => {
                element.on("click", (v) => featureEvent(v, type));
                element.on("contextmenu", (v) => featureMenu(v, type));
              }, 200);
            });
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };
  const featureRedraw = (dataRef: any) => {
    console.log(dataRef, "geometryDataMap", geometryDataMap);
    const {
      checked,
      id,
      featureType,
      featureCode,
      featureName,
      aliasName,
      type,
      showName = false,
    } = dataRef;
    const uid = type + id;

    // redrawData 回显对象  场地是几何信息 其他的是id
    const redrawData = dataRef.geometry || "{}";

    const featureStyle = JSON.parse(dataRef.featureStyle || "{}");
    const iconPosition = JSON.parse(dataRef.iconPosition || "{}");
    const textParams = {
      featureName,
      ...featureStyle,
    };
    // 区域上图和隐藏
    if (featureType === "SITE_DRAWING") {
      const redrawData = JSON.parse(dataRef.geometry || "{}");
      const geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });
      try {
        let geometryStyle: any = {};
        featureStyle &&
          featureStyle.fillColor &&
          (geometryStyle.fillColor = featureStyle.fillColor);
        featureStyle &&
          featureStyle.routeColor &&
          (geometryStyle.fillColor = featureStyle.routeColor);
        featureStyle &&
          featureStyle.outlineColor &&
          (geometryStyle.outlineColor = featureStyle.outlineColor);
        featureStyle &&
          featureStyle.outlineWidth &&
          (geometryStyle.outlineWidth = featureStyle.outlineWidth);
        redrawData.Style = geometryStyle;
        if (featureCode === "WALL") {
          let closureStyle: any = {};
          closureStyle.type = "2";
          featureStyle &&
            featureStyle.scale &&
            (closureStyle.scale = featureStyle.scale);
          featureStyle &&
            featureStyle.brightness &&
            (closureStyle.brightness = featureStyle.brightness);
          featureStyle &&
            featureStyle.fillColor &&
            (closureStyle.fillColor = featureStyle.fillColor);
          redrawData.closureStyle = closureStyle;
        }
        if (featureCode === "ROUTE") {
          let routeStyle: any = {};
          featureStyle &&
            featureStyle.routeColor &&
            (routeStyle.routeColor = featureStyle.routeColor);
          featureStyle &&
            featureStyle.routeWidth &&
            (routeStyle.routeWidth = featureStyle.routeWidth);
          featureStyle &&
            featureStyle.opacity &&
            (routeStyle.routeOpacity = featureStyle.opacity / 100);
          redrawData.routeStyle = routeStyle;
        }

        // 区域回显
        if (checked) {
          geometryUtil.redraw(
            {
              data: [redrawData],
              onComplete: (res) => {
                setGeometryDataMap((dataMap) => ({
                  ...dataMap,
                  [uid]: res.get(redrawData.Id),
                }));
                setFeatureNameShowHide(
                  res.get(redrawData.Id),
                  showName,
                  textParams,
                );
              },
            },
            store.viewer,
          );
        } else {
          if (featureCode === "WALL") {
            console.log("redrawData", redrawData);
            geometryUtil.remove({
              ids: [redrawData?.Id],
              wallIds: [redrawData?.wallId],
            });
          } else if (featureCode === "ROUTE") {
            geometryUtil.remove({
              ids: [redrawData?.Id],
              routeIds: [redrawData?.routeId],
            });
          } else {
            geometryUtil.remove({ ids: [redrawData?.Id] });
          }
        }
      } catch (error) {}
    }

    // WuFang 上图
    if (checked && featureType === "PHYSICAL_DEFENSE") {
      const { showModel, position, iconPosition } = dataRef;
      console.log(
        JSON.parse(iconPosition).position,
        " JSON.parse(iconPosition).position",
      );
      const modelStyle = JSON.parse(dataRef.modelStyle || "{}");
      const element = new window["KMapUE"].SecurityElement({
        viewer,
        options: {
          id: redrawData,
          featureStyle,
          color: codeMap[featureCode],
          scale: featureStyle.scale,
          modelScale: modelStyle.modelScale,
          modelAltitude: modelStyle.modelAltitude,
          modelPosition: position
            ? JSON.parse(position)
            : JSON.parse(iconPosition).position,
          height: JSON.parse(iconPosition).height,
          type: showModel ? "model" : "icon",
          elementType: featureCode,
          modelWidth: modelStyle.modelWidth,
          modelHeight: modelStyle.modelHeight,
          rotation: modelStyle.rotation,
          position: JSON.parse(iconPosition).position,
          onComplete: (res) => {
            setGeometryDataMap((dataMap) => ({
              ...dataMap,
              [uid]: element,
            }));
            console.log(element, "WuFangWuFangWuFang");
            setFeatureNameShowHide(element, showName, textParams);
            setTimeout(() => {
              element.on("contextmenu", (v) => featureMenu(v, type));
              element.on("click", (v) => featureEvent(v, type));
            }, 200);
          },
        },
      });
    } else if (!checked && featureType === "PHYSICAL_DEFENSE") {
      // setFeatureNameShowHide(geometryDataMap[uid], false);
      const element = new window["KMapUE"].SecurityElementBatch({
        viewer,
      });
      closeComponentFrame(uid);
      element.removeById(redrawData);
    }

    // 设施 上图
    if (checked && featureType === "VENUE_FACILITY") {
      const SIGNPOST = new window["KMapUE"].RoadLabelBatch({
        viewer,
      });
      const TEXT = new window["KMapUE"].LabelBatch({
        viewer,
      });
      // 文本
      if (featureCode === "TEXT") {
        let fontStyle: any = {};
        featureStyle &&
          featureStyle.fontColor &&
          (fontStyle.fontColor = featureStyle.fontColor);
        featureStyle &&
          featureStyle.fontSize &&
          (fontStyle.fontSize = featureStyle.fontSize);
        featureStyle &&
          featureStyle.backgroundColor &&
          (fontStyle.backgroundColor = featureStyle.backgroundColor);
        TEXT.add({
          options: [
            {
              id: redrawData,
              text: featureName,
              color: codeMap[featureCode],
              position: exchangePosition(iconPosition, true),
              style: fontStyle,
            },
          ],
          onComplete: (res) => {
            console.log(res.get(redrawData), "res.get(redrawData)", res);
            setTimeout(() => {
              res.get(redrawData).on("contextmenu", (v) => {
                featureMenu(v, type);
              });
              res.get(redrawData).on("click", (v) => {
                featureEvent(v, type);
              });
            }, 200);
            setGeometryDataMap((dataMap) => ({
              ...dataMap,
              [uid]: res.get(redrawData),
            }));
          },
        });
      } else if (featureCode === "SIGNPOST") {
        SIGNPOST.add({
          options: [
            {
              id: redrawData,
              text: aliasName,
              position: exchangePosition(iconPosition),
            },
          ],
          onComplete: (res) => {
            setTimeout(() => {
              res.get(redrawData).on("contextmenu", (v) => {
                featureMenu(v, type);
              });
              res.get(redrawData).on("click", (v) => {
                featureEvent(v, type);
              });
            }, 200);

            setGeometryDataMap((dataMap) => ({
              ...dataMap,
              [uid]: res.get(redrawData),
            }));
            console.log(res.get(redrawData), " res.get(redrawData)");
          },
          onError: (err) => {
            console.log(err, "errerr");
          },
        });
      } else {
        const { showModel, position, iconPosition, featureStyle } = dataRef;
        const sheshi = new window["KMapUE"].SecurityElement({
          viewer,
          options: {
            ...JSON.parse(featureStyle),
            id: redrawData,
            height: JSON.parse(iconPosition).height,
            type: "icon",
            elementType: featureCode,
            scale: featureStyle.scale,
            position: showModel
              ? JSON.parse(position)
              : JSON.parse(iconPosition).position,
            color: codeMap[featureCode],
            onComplete: (res) => {
              setGeometryDataMap((dataMap) => ({
                ...dataMap,
                [uid]: sheshi,
              }));
              setFeatureNameShowHide(sheshi, showName, textParams);
              setTimeout(() => {
                sheshi.on("contextmenu", (v) => featureMenu(v, type));
                sheshi.on("click", (v) => featureEvent(v, type));
              }, 200);
            },
          },
        });
      }
    } else if (!checked && featureType === "VENUE_FACILITY") {
      if (featureCode === "TEXT") {
        const TEXT = new window["KMapUE"].LabelBatch({
          viewer,
        });
        TEXT.removeById(redrawData);
        geometryDataMap?.[uid]?.remove();
        setGeometryDataMap((dataMap) => ({ ...dataMap, [uid]: null }));
      }
      if (featureCode === "SIGNPOST") {
        const SIGNPOST = new window["KMapUE"].RoadLabelBatch({
          viewer,
        });
        SIGNPOST.removeById(redrawData);

        setGeometryDataMap((dataMap) => ({ ...dataMap, [uid]: null }));
      } else {
        // setFeatureNameShowHide(geometryDataMap[uid], false);
        const element = new window["KMapUE"].SecurityElementBatch({
          viewer,
        });
        element.removeById(redrawData);
        closeComponentFrame(uid);
      }
    }

    dataRef?.children?.forEach((v) => {
      featureRedraw({ ...v, checked, type });
    });
  };

  useEffect(() => {
    store.changeState({ geometryDataMapStore: geometryDataMap });
  }, [geometryDataMap]);

  const handleCheckInherent = (checkedKeys, extra) => {
    store.changeState({ checkedKeysInherentArr: checkedKeys });
    const { checked, node } = extra;
    const type = "inherent";
    // featureRedraw({ ...node.props.dataRef, checked, type });
  };

  const handleCheckTemporary = (checkedKeys, extra) => {
    const { checked, node } = extra;
    if (
      (isAttributes || store.isCorrect) &&
      editFeature &&
      !checkedKeys.includes(editFeature.id)
    ) {
      checkedKeys.push(editFeature.id);
    }

    store.changeState({ checkedKeysArr: checkedKeys });
    const type = "temporary";
    // featureRedraw({ ...node.props.dataRef, checked, type });
  };

  const handleEdit = (props) => {
    if (store.isCorrect) return;
    console.log("geometryObjgeometryObj", props, geometryDataMap[props.id]);
    const uid = "temporary" + props.id;

    const editFeature = {
      type: "temporary",
      id: props?.id,
      featureCode: props?.featureCode,
      featureType: props?.featureType,
    };

    store.changeState({
      editFeature,
      selectedTreeNode: props,
      addFeatureStorage: null,
      isAttributes: true,
      geometryObj: geometryDataMap[uid],
    });

    const getFunction =
      store.menuFeatureType === "inherent"
        ? getInherentFeatureDetail
        : getTemporaryFeatureDetail;
    getFunction(props.id).then((res) => {
      console.log(res, "res");
      const uid = "temporary" + res.id;
      if (res.popFrameStyle) {
        const {
          altitude,
          content,
          gizmoStatus,
          popFrameName,
          positionX,
          positionY,
          status,
          styleType,
        } = res.popFrameStyle;
        if (gizmoStatus == "true") {
          const contentObj = content ? JSON.parse(content) : [];
          res.popFrameStyle.content = contentObj;
          openComponentFrame({
            uid: uid,
            ...res.popFrameStyle,
          });
        }
      }
    });
  };

  const handleEditUe = () => {
    setIsMenu(false);
    store.changeState({
      isMenu: false,
    });
    if (store.menuFeatureType === "inherent") return;
    // 编辑只对临时资源
    const getFunction =
      store.menuFeatureType === "inherent"
        ? getInherentFeatureDetail
        : getTemporaryFeatureDetail;
    getFunction(store.menuFeatureId).then((res) => {
      console.log(res, "res");
      const uid = "temporary" + res.id;

      const editFeature = {
        type: "temporary",
        id: res?.id,
        featureCode: res?.featureCode,
        featureType: res?.featureType,
      };
      store.changeState({
        editFeature,
        addFeatureStorage: null,
        isAttributes: true,
        geometryObj: store.geometryDataMapStore[uid],
      });

      if (res.popFrameStyle) {
        const {
          altitude,
          content,
          gizmoStatus,
          popFrameName,
          positionX,
          positionY,
          status,
          styleType,
        } = res.popFrameStyle;
        if (gizmoStatus == "true") {
          const contentObj = content ? JSON.parse(content) : [];
          res.popFrameStyle.content = contentObj;
          openComponentFrame({
            uid,
            ...res.popFrameStyle,
          });
        }
      }
    });
    // 编辑时自动弹出右侧编辑弹窗
    store.toggleRightCollapsed(true);
  };

  const handleDelete = async (props) => {
    if (store.isCorrect) return;
    await temporaryDelete(props.id);
    Message.success("操作成功");
    const geometryUtilRemove = new window["KMapUE"].GeometryUtil({ viewer });
    const { checked, featureType, featureCode, geometry, showName } = props;
    if (checked) {
      if (showName && featureType === "SITE_DRAWING") {
        const element = geometryDataMap[`temporary` + props.id];
        setFeatureNameShowHide(element, false);
      }
      if (
        featureType === "SITE_DRAWING" &&
        featureCode !== "WALL" &&
        featureCode !== "ROUTE"
      ) {
        geometryUtilRemove.remove({ ids: [JSON.parse(geometry).Id] });
      } else if (featureType === "SITE_DRAWING" && featureCode === "WALL") {
        geometryUtilRemove.remove({
          ids: [JSON.parse(geometry)?.Id],
          wallIds: [JSON.parse(geometry)?.wallId],
        });
      } else if (featureType === "SITE_DRAWING" && featureCode === "ROUTE") {
        geometryUtilRemove.remove({
          ids: [JSON.parse(geometry)?.Id],
          routeIds: [JSON.parse(geometry)?.routeId],
        });
      }
      if (featureType === "PHYSICAL_DEFENSE") {
        const element = new window["KMapUE"].SecurityElementBatch({
          viewer,
        });
        element.removeById(geometry);
      }

      if (featureType === "VENUE_FACILITY") {
        if (featureCode === "TEXT") {
          const labelBatch = new window["KMapUE"].LabelBatch({
            viewer,
          });
          labelBatch.removeById(geometry);
        } else if (featureCode === "SIGNPOST") {
          const roadBatch = new window["KMapUE"].RoadLabelBatch({
            viewer,
          });
          roadBatch.removeById(geometry);
        } else {
          const element = new window["KMapUE"].SecurityElementBatch({
            viewer,
          });
          element.removeById(geometry);
        }
      }
    }

    temporaryTree(store.selectedPlan.id).then((res) => {
      res = getFeatureTreeData(res);
      store.delayeringTree(res, "wfTemporaryTreeData");
      setTemporaryTreeData(res);
    });
  };

  const toDetail = () => {
    setIsMenu(false);
    store.changeState({
      isMenu: false,
    });
    const getFunction =
      store.menuFeatureType === "inherent"
        ? getInherentFeatureDetail
        : getTemporaryFeatureDetail;
    getFunction(store.menuFeatureId).then((res) => {
      console.log(res, "res");
      if (res.popFrameStyle) {
        const popFrameStyle = res?.popFrameStyle;
        const content = res?.popFrameStyle?.content
          ? JSON.parse(res?.popFrameStyle?.content)
          : [];
        popFrameStyle.content = content;
        if (popFrameStyle.gizmoStatus == "true") {
          openComponentFrame({
            uid: store.menuFeatureType + store.menuFeatureId,
            ...popFrameStyle,
          });
        }
      }
    });
  };
  const getToArr = (obj) => {
    if (store.elementFeature.type == "model") {
      return { modelPosition: [[obj.lng, obj.lat]], modelAltitude: obj.alt };
    } else if (
      store.elementFeature.type == "label" ||
      store.elementFeature.type == "road"
    ) {
      return { position: obj };
    } else {
      return { position: [[obj.lng, obj.lat]], height: obj.alt };
    }
  };
  const getAttachElementType = (type?: string) => {
    let elementType = "";

    // 获取类型，如果 type 参数不存在，则从 store.elementFeature 获取
    const elementTypeSource = type || store.elementFeature?.type;

    if (!elementTypeSource) return elementType;

    switch (elementTypeSource) {
      case "label":
        elementType = "label";
        break;
      case "road":
        elementType = "roadlabel";
        break;
      case "model":
        elementType = "elementModel";
        break;
      default:
        elementType = "elementIcon";
        break;
    }

    storeAttr.elementType = elementType;

    return elementType;
  };
  const manualCorrect = (coordinate: any) => {
    storeAttr.clearGizmoControl();
    const Point = getToArr(coordinate);
    setCorrectPoint(Point);
    store.changeState({
      wfCorrectPoint: Point,
    });
    store.geometryObj.update(Point);
    attachCorrectElement();
  };

  const handleCorrectDataLLA = () => {
    if (store.correctEleData) {
      const { iconPosition, modelStyle, position } = store.correctEleData;
      let elementType = getAttachElementType();
      let point;
      if (elementType == "elementModel") {
        const modelPosition = JSON.parse(position);
        const iconPos = JSON.parse(iconPosition);
        const modelStyleObj = JSON.parse(modelStyle);
        point =
          modelPosition && position != "{}" && position != "[]"
            ? modelPosition
            : iconPos.position;
        store.correctLLA = {
          lng: point[0][0],
          lat: point[0][1],
          alt:
            modelStyleObj && modelStyleObj.modelAltitude
              ? modelStyleObj.modelAltitude
              : iconPos.height,
        };
      } else {
        point = JSON.parse(iconPosition);
        store.correctLLA = {
          lng: Array.isArray(point.position)
            ? point.position[0][0]
            : point.position.lng,
          lat: Array.isArray(point.position)
            ? point.position[0][1]
            : point.position.lat,
          alt: point.height || point.position.alt,
        };
      }
    }
  };

  const attachCorrectElement = () => {
    let elementType = getAttachElementType();
    setTimeout(() => {
      storeAttr.openGizmoControl(true, () => {
        if (elementType != "elementModel") {
          storeAttr.gizmoControl.setMode("translate");
        }
        storeAttr.gizmoControl.attachElement({
          type: elementType, // 可选值：elementIcon、elementModel、label、roadlabel
          id: store.elementFeature.id,
          onComplete: (res) => {
            attrStore.gizmoControl.setBlockLists([
              "EnclosureActor",
              "BP_MyLabel_C",
              "BP_Road1_C",
              "BP_BiaoDian_C",
              "PhysicalDefenseActor",
              "APoiDeviceActor",
              "PoiDeviceActor",
            ]);
          },
          onError: (err) => {},
        });
      });
    }, 200);
  };
  const handleCorrect = () => {
    // console.log("store.correctEleData", store.correctEleData);
    handleCorrectDataLLA();
    setIsMenu(false);
    store.changeState({
      isMenu: false,
    });
    store.isView = true;
    if (store.menuFeatureType === "inherent") return;
    store.correctCofirm = manualCorrect;
    const uid = "temporary" + store.menuFeatureId;
    const editFeature = {
      type: "temporary",
      id: store.correctEleData?.id,
      featureCode: store.correctEleData?.featureCode,
      featureType: store.correctEleData?.featureType,
    };
    store.changeState({
      geometryObj: store.geometryDataMapStore[uid],
      editFeature,
    });
    // setIsCorrent(true);
    store.changeState({
      isCorrect: true,
      rightCollapsed: true,
    });

    store.changeState({
      correctCancel,
      correctOk,
    });

    store.viewer.startTakePoint({
      tip: "鼠标单击，重新选择要素摆放位置，esc键退出",
    });
    store.viewer.off("take_point");
    store.viewer.on("take_point", (res) => {
      const Point = getToArr(res);
      setCorrectPoint(Point);
      store.changeState({
        wfCorrectPoint: Point,
      });
      store.correctLLA = res;
      // store.geometryDataMapStore[uid].update(Point);
      // attachCorrectElement();
    });
  };

  const correctOk = async () => {
    if (!store.isCorrect) return;
    const transformUe = storeAttr.transformUe;
    const rotationUe = storeAttr.rotationUe;
    const { position, iconPosition, modelAltitude } = storeAttr;
    const data: any = {
      id: store.menuFeatureId,
    };
    if (transformUe !== null) {
      const Point = getToArr(transformUe.position);
      console.log(Point, "take_pointtake_pointv");
      if (store.elementFeature.type == "model") {
        // console.log("correctEleData", store.correctEleData);
        const { modelStyle } = store.correctEleData;
        let modelStyleObj = JSON.parse(modelStyle);
        Object.assign(modelStyleObj, { modelAltitude: Point.modelAltitude });
        // modelStyleObj = {...modelStyleObj, ...{modelAltitude: Point.modelHeight}}
        data.modelStyle = JSON.stringify(modelStyleObj);
        data.position = JSON.stringify(Point.modelPosition);
        // data.modelStyle = JSON.stringify({ modelAltitude: Point.modelHeight });
      } else {
        data.iconPosition = JSON.stringify(Point);
      }
    } else {
      if (store.elementFeature.type == "model") {
        data.position = JSON.stringify(store.wfCorrectPoint.modelPosition);
        // data.modelStyle = JSON.stringify({modelHeight: correctPoint.modelHeight});
      } else {
        data.iconPosition = JSON.stringify(store.wfCorrectPoint);
      }
    }

    if (rotationUe !== null) {
      if (store.elementFeature.type == "model") {
        // console.log("correctEleData", store.correctEleData);
        const { modelStyle } = store.correctEleData;
        let modelStyleObj = JSON.parse(modelStyle);
        Object.assign(modelStyleObj, { rotation: rotationUe });
        // modelStyleObj = {...modelStyleObj, ...{modelAltitude: Point.modelHeight}}
        data.modelStyle = JSON.stringify(modelStyleObj);
        // data.modelStyle = JSON.stringify({ modelAltitude: Point.modelHeight });
      }
    }
    console.log(
      "纠偏后获取楼栋数据：",
      store.geometryObj && store.geometryObj.getRealBuildingInfo(),
    );
    const buildingInfo =
      store.geometryObj && store.geometryObj.getRealBuildingInfo();
    if (buildingInfo) {
      data.buildingContent = JSON.stringify([buildingInfo]);
      store.correctEleData &&
        store.correctEleData.buildingFloor &&
        store.correctEleData.buildingFloor[0] &&
        (data.buildingFloorId = store.correctEleData.buildingFloor[0].id);
    }
    updateIconPosition(data);
    Message.success("更新成功");
    correctCancel(false);
    store.getAllPlans();
    setTimeout(() => {
      // debugger
      // temporaryTree(store.selectedPlan.id).then((res) => {
      //   res = getFeatureTreeData(res);
      //   store.delayeringTree(res, "wfTemporaryTreeData");
      //   setTemporaryTreeData(res);
      // });
      storeAttr.openGizmoControl(false);
    }, 300);
  };

  const correctCancel = (cancelOnly = true) => {
    if (!store.isCorrect) return;
    store.changeState({
      isCorrect: false,
    });
    store.viewer.endTakePoint();
    // setIsCorrent(false);
    console.log("correctCancel store.menuFeatureId ", store.menuFeatureId);
    store.isView = false;
    attrStore.clearGizmoControl();

    store.viewer.endTakePoint({
      onComplete: () => {
        store.viewer.off("take_point");
      },
    });
    if (cancelOnly) {
      let point = null;
      if (store.elementFeature.type == "model") {
        point = {
          modelPosition:
            store.correctEleData.position &&
            store.correctEleData.position != "{}" &&
            store.correctEleData.position != "[]"
              ? JSON.parse(store.correctEleData.position)
              : JSON.parse(store.correctEleData.iconPosition).position,
        };
      } else if (
        store.elementFeature.type == "label" ||
        store.elementFeature.type == "road"
      ) {
        point = JSON.parse(store.correctEleData.iconPosition);
      } else {
        point = JSON.parse(store.correctEleData.iconPosition);
      }
      store.geometryObj?.update(point);
    }
  };

  const renderTitle = (props) => {
    const { id, title, featureType, featureCode, deviceType, type } = props;
    let prefix = null;

    if (id === "inherent" || id === "temporary") {
      const content =
        id === "inherent"
          ? "场所内部固定要素，每个方案默认展示资源，可在场所设施管理该类数据。"
          : "当前所选方案创建的针对活动安保部署的要素资源。";

      return (
        <span className="feature-root-title">
          {title}
          <Tooltip content={content}>
            <div className="feature-title-icon" />
          </Tooltip>
        </span>
      );
    }

    if (type == "classify") {
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
    }

    return (
      <>
        {prefix}
        <span className="feature-title">{title}</span>
      </>
    );
  };

  const renderExtra = (props) => {
    const { id, checked, type } = props;
    if (id === "inherent" || id === "temporary" || type == "classify")
      return null;
    if (status === "readonly" || isAttributes) return null;

    return (
      <div className="feature-extra">
        {checked && (
          <Tooltip content={"编辑"}>
            <img
              className={styles.opacityImg}
              src={editIcon}
              onClick={() => handleEdit(props)}
              width={22}
            />
          </Tooltip>
          // <IconEdit onClick={() => handleEdit(props)} style={{ fontSize: 18 }} />
        )}
        {!store.isCorrect && (
          <Popconfirm
            title="确定删除该标绘数据？"
            content="删除后数据不可恢复数据 将被清除。"
            position="bottom"
            onOk={() => handleDelete(props)}
          >
            <img className={styles.opacityImg} src={deleteIcon} width={22} />
          </Popconfirm>
        )}
      </div>
    );
  };

  const filterNode = (node) => {
    const { id } = node;
    if (id === "inherent" || id === "temporary") return true;
    // 检查子节点是否满足条件
    const hasMatchingChildren = node.children?.some((child) =>
      filterNode(child),
    );
    return (
      node.featureName.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
      hasMatchingChildren
    );
  };

  return (
    <div className="box-jf">
      <div className="left-grid">
        {statistics?.slice(0, endIndex).map((v, i) => (
          <div className="grid-item-bg" key={i}>
            <div className="grid-item">
              <div className="grid-num">{v.count}</div>
              <div className="grid-title">{v.featureName}</div>
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
      </div>
      <Tree
        className="left-tree"
        blockNode
        checkable
        selectable
        expandedKeys={expandedInherentKeys}
        onExpand={setExpandedInherentKeys}
        checkStrictly={false}
        checkedKeys={checkedKeysInherentArr}
        onCheck={debounce(handleCheckInherent, 600)}
        onSelect={handleSelect(setExpandedInherentKeys, "inherent")}
        treeData={[
          {
            id: "inherent",
            type: "classify",
            featureName: "固有资源",
            children: inherentTreeData,
          },
        ]}
        fieldNames={{ key: "id", title: "featureName" }}
        filterNode={filterNode}
        renderTitle={renderTitle}
      />
      <Tree
        className="left-tree"
        blockNode
        draggable
        checkable
        selectable
        selectedKeys={selecteditem}
        expandedKeys={expandedTemporaryKeys}
        onExpand={setExpandedTemporaryKeys}
        checkStrictly={false}
        checkedKeys={checkedKeysArr}
        onCheck={debounce(handleCheckTemporary, 600)}
        onSelect={handleSelect(setExpandedTemporaryKeys, "temporary")}
        treeData={[
          {
            id: "temporary",
            type: "classify",
            featureName: "临时资源",
            children: temporaryTreeData,
          },
        ]}
        fieldNames={{ key: "id", title: "featureName" }}
        filterNode={filterNode}
        renderTitle={renderTitle}
        renderExtra={renderExtra}
        onDrop={({ dragNode, dropNode, dropPosition }) => {
          if (
            dragNode["props"]["parentId"] === dropNode["props"]["parentId"] &&
            dragNode["props"]["parentId"] != "-1"
          ) {
            // 寻找同级别的目标dropNode key，存在则根据 dropPosition 选择插入的位置，前或后
            let result = [];
            const loop = (data, key, callback) => {
              data.some((item, index, arr) => {
                if (item.id === key) {
                  callback(item, index, arr);
                  return true;
                }

                if (item.children) {
                  return loop(item.children, key, callback);
                }
              });
            };
            const data = [...temporaryTreeData];
            let dragItem: any;
            loop(data, dragNode.props._key, (item, index, arr) => {
              const _item = arr.splice(index, 1)[0];
              dragItem = item;
              dragItem.className = "tree-node-dropover";
              // 将 _item 插入到 dropNode 的位置
              // -1 在之前，0本来是在此类添加子元素，我们默认在后面，1在之后
              if (dropPosition === -1) {
                // 插入到前方
                loop(data, dropNode.props._key, (item, index, arr) => {
                  arr.splice(index, 0, _item);
                });
              } else {
                // 插入到后方
                loop(data, dropNode.props._key, (item, index, arr) => {
                  arr.splice(index + 1, 0, _item);
                });
              }
              result = arr;
            });
            setTemporaryTreeData([...data]);
            setTimeout(() => {
              dragItem.className = "";
              const seqMap = {};
              for (let index = 0; index < result.length; index++) {
                const item = result[index];
                seqMap[item.id] = index;
              }
              // setTemporaryTreeData([...data]);
              reSequence({
                // parentId: dropNode["props"]["parentId"],
                sequences: result.map((item) => item.id),
                seqMap,
              }).then(() => {
                Message.success("排序成功");
              });
            }, 1000);
          } else {
            // 不支持切换不同层级的顺序
            console.log("不支持切换不同层级的顺序");
          }
        }}
      />
      {/* {isMenu && (
        <div
          className={styles.menu}
          id="fixMenu"
          style={{ left: point.x + 10, top: point.y + 10, border:  (store.status !== "editable" && !store.hasCorrectDetail) ? "none" : ""}}
        >
          {store.elementFeature.type !== "model" && store.hasCorrectDetail && (
            <div onClick={toDetail}>查看详情</div>
          )}
          {store.status == "editable" && <div onClick={handleEditUe}>编辑要素</div>}
          {store.status == "editable" && store.correctEleData &&
            store.correctEleData.featureType !== "SITE_DRAWING" && (
              <div onClick={handleCorrect}>位置纠偏</div>
            )}
        </div>
      )} */}

      {/* {store.isCorrect && (
        <PositionCorrect onCancel={correctCancel} onOk={correctOk} />
      )} */}
    </div>
  );
};

export default observer(WuFang);
