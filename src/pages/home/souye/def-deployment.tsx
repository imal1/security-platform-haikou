import React, { useState, useCallback, useEffect } from "react";
import {
  Grid,
  Checkbox,
  Form,
  Input,
  Tag,
  TreeProps,
  Tooltip,
} from "@arco-design/web-react";
import { KArcoTree, NoData, FilterModal, TitleBar } from "@/components";
import { tryGet, Icons, deep } from "@/kit";
import { observer } from "mobx-react";
import store from "../store";
import { debounce, union, without } from "lodash";
import { codeMap } from "../../constant/index";
const CheckboxGroup = Checkbox.Group;
import {
  getTemporaryFeatureDetail,
  getInherentFeatureDetail,
} from "../store/webapi";
const FormItem = Form.Item;
const { Row, Col } = Grid;
const iconObj = { ...Icons.devices, ...Icons.region };
const InputSearch = Input.Search;

const options = [
  {
    label: "区域",
    value: "AREA",
  },
  {
    label: "路线",
    value: "ROUTE",
  },
  {
    label: "责任区",
    value: "AOR",
  },
  {
    label: "墙",
    value: "WALL",
  },
  {
    label: "升降柱",
    value: "BOLLARD",
  },
  {
    label: "巡逻车",
    value: "PATROL_CAR",
  },
  {
    label: "拒马",
    value: "KNIFE_REST",
  },
  {
    label: "防冲撞",
    value: "ANTI_COLLISION",
  },
  {
    label: "出入口",
    value: "GATE",
  },
  {
    label: "安检站",
    value: "SECURITY_GATE",
  },
  {
    label: "消防栓",
    value: "FIRE_HYDRANT",
  },
  {
    label: "护栏",
    value: "GUARDRAIL",
  },
  {
    label: "安检机",
    value: "SECURITY_MACHINE",
  },
  {
    label: "车检站",
    value: "VEHICLE_INSPECTION_STATION",
  },
  {
    label: "闸机",
    value: "SUBWAY_GATE_MACHINE",
  },
  {
    label: "特警巡逻车",
    value: "SPECIAL_POLICE_PATROL_VEHICLE",
  },
  {
    label: "武警防冲撞车",
    value: "POLICE_FORCE_CRASH_PREVENTION",
  },
  {
    label: "标点",
    value: "PUNCTUATION",
  },
  {
    label: "文本",
    value: "TEXT",
  },
  {
    label: "休憩",
    value: "REST",
  },
  {
    label: "公厕",
    value: "TOILET",
  },
  {
    label: "停车场",
    value: "PARKING_LOT",
  },
  {
    label: "禁止停车",
    value: "NO_PARKING",
  },
  {
    label: "警务站",
    value: "POLICE_STATION",
  },
  {
    label: "驿站",
    value: "STATION",
  },
  {
    label: "路牌",
    value: "SIGNPOST",
  },
  {
    label: "防爆点",
    value: "EXPLOSION_PROOF_POINT",
  },
  {
    label: "消防点",
    value: "FIRE_PROTECTION_POINT",
  },
  {
    label: "无人机反制点",
    value: "UAV",
  },
  {
    label: "反恐防范点",
    value: "COUNTER_TERRORISM_PREVENTION",
  },
  {
    label: "特警执勤点",
    value: "SPECIAL_POLICE_DUTY",
  },
  {
    label: "武警执勤点",
    value: "ARMED_POLICE_DUTY",
  },
  {
    label: "治安处置点",
    value: "SECURITY_DISPOSAL",
  },
];
const ids = options.map((item) => item.value);
const DefDeployment = ({ arrangeValue, isAllCheck = true }) => {
  const [form] = Form.useForm();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(["-1"]);
  const [selectedTemporaryKeys, setSelectedTemporaryKeys] = useState([]);
  const [expandedTemporaryKeys, setExpandedTemporaryKeys] = useState(["-1"]);
  const [inherentCheckedKeys, setInherentCheckedKeys] = useState([]);
  const [temporaryCheckedKeys, setTemporaryCheckedKeys] = useState([]);
  const { drawCodes, featureTypes } = store;
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const [value, setValue] = useState(ids);
  const [inputValue, setInputValue] = useState("");
  const [geometryDataMap, setGeometryDataMap] = useState({});
  const [zrqgroup1, setZrqgroup1] = useState([]);
  const [zrqgroup2, setZrqgroup2] = useState([]);
  const { openComponentFrame, closeComponentFrame } = store;
  useEffect(() => {
    if (!store.viewer) return;
    featureDiagram(store.wfInherentData, inherentCheckedKeys, "inherent");
    const zrqgroup = store.wfInherentData
      .filter((item) => inherentCheckedKeys.includes(item.id) && item.sceneId)
      .map((row) => {
        const featureStyle = JSON.parse(row.featureStyle || "{}");
        return {
          id: row.sceneId,
          color: featureStyle.fillColor,
          uid: "inherent" + row.id,
        };
      });
    setZrqgroup1(zrqgroup);
  }, [inherentCheckedKeys, store.viewer]);
  useEffect(() => {
    if (!store.viewer) return;
    featureDiagram(store.wfTemporaryData, temporaryCheckedKeys, "temporary");
    const zrqgroup = store.wfTemporaryData
      .filter((item) => temporaryCheckedKeys.includes(item.id) && item.sceneId)
      .map((row) => {
        const featureStyle = JSON.parse(row.featureStyle || "{}");
        return {
          id: row.sceneId,
          color: featureStyle.fillColor,
          uid: "temporary" + row.id,
        };
      });
    setZrqgroup2(zrqgroup);
  }, [temporaryCheckedKeys, store.viewer]);
  useEffect(() => {
    const zrqgroup = [...zrqgroup1, ...zrqgroup2];
    store.addNnzrg(zrqgroup);
  }, [zrqgroup1, zrqgroup2]);
  useEffect(() => {
    if (!store.viewer) return;
    if (store.wfInherentData.length) {
      const ids = store.wfInherentData.map((item) => item.id);
      // setExpandedKeys(ids);
      isAllCheck && setInherentCheckedKeys(ids);
    }
    // if (store.wfTemporaryData) {
    //   const ids = store.wfTemporaryData.map((item) => item.id);
    //   setExpandedTemporaryKeys(ids);
    //   // isAllCheck && setTemporaryCheckedKeys(ids);
    // }
  }, [store.wfInherentData, store.wfTemporaryData, store.viewer]);
  useEffect(() => {
    return () => {
      setInherentCheckedKeys([]);
      setTemporaryCheckedKeys([]);
      store.removeAllFeature();
      store.destroyAllNnzrg();
    };
  }, []);
  useEffect(() => {
    store.geometryDataMapStore = geometryDataMap;
  }, [geometryDataMap]);
  const getTreeTitle = (row) => {
    return (
      <div className="tree-title-wrap">
        {drawCodes.includes(row.featureCode) && row.type == "classify" && (
          <>
            <Tag
              size="small"
              style={{
                backgroundColor: "rgba(215, 114, 42, 0.2)",
                borderColor: "#fd8022",
                color: "#fd8022",
                marginRight: 8,
              }}
              bordered
            >
              {featureTypes[row.featureCode]}
            </Tag>
          </>
        )}
        {row.type == "classify" && !drawCodes.includes(row.featureCode) && (
          <img
            src={store.icons[row.featureCode]}
            style={{ width: 26, marginRight: 8 }}
          />
        )}
        {row.title.length > 8 ? (
          <Tooltip content={row.title}>
            <span className="tree-tit text-overflow">{row.title}</span>
          </Tooltip>
        ) : (
          <span className="tree-tit text-overflow">{row.title}</span>
        )}
      </div>
    );
  };
  const getTreeTitle2 = (row) => {
    return (
      <div className="tree-title-wrap">
        {drawCodes.includes(row.featureCode) && row.type == "classify" && (
          <>
            <Tag
              size="small"
              style={{
                backgroundColor: "rgba(215, 114, 42, 0.2)",
                borderColor: "#fd8022",
                color: "#fd8022",
                marginRight: 8,
              }}
              bordered
            >
              {featureTypes[row.featureCode]}
            </Tag>
          </>
        )}
        {row.type == "classify" && !drawCodes.includes(row.featureCode) && (
          <img
            src={store.icons[row.featureCode]}
            style={{ width: 26, marginRight: 8 }}
          />
        )}
        {row.title.length > 8 ? (
          <Tooltip content={row.title}>
            <span className="tree-tit text-overflow">{row.title}</span>
          </Tooltip>
        ) : (
          <span className="tree-tit text-overflow">{row.title}</span>
        )}
      </div>
    );
  };
  const onChangeAll = (checked) => {
    if (checked) {
      setIndeterminate(false);
      setCheckAll(true);
      setValue(ids);
    } else {
      setIndeterminate(false);
      setCheckAll(false);
      setValue([]);
    }
  };

  const onChange = (checkList) => {
    setIndeterminate(
      !!(checkList.length && checkList.length !== options.length)
    );
    setCheckAll(!!(checkList.length === options.length));
    setValue(checkList);
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
  useEffect(() => {
    setFirstExpanded();
  }, [inputValue, value]);
  const setFirstExpanded = () => {
    try {
      const inherentData: any = searchData(store.wfInherentTree);
      const temporaryData: any = searchData(store.wfTemporaryTree);
      // 合并 keys
      if (inherentData?.length > 0) {
        setExpandedKeys(["-1", inherentData[0]?.children[0]?.id]);
      }
      if (temporaryData?.length > 0) {
        setExpandedTemporaryKeys(["-1", temporaryData[0]?.children[0]?.id]);
      }
    } catch (error) {}
  };
  const searchData = (TreeData) => {
    const loop = (data) => {
      const result = [];
      data.forEach((item) => {
        if (
          item.featureName.toLowerCase().indexOf(inputValue.toLowerCase()) >
            -1 &&
          (value.includes(item.id) || value.includes(item.parentId))
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
  const setFeatureNameShowHide = (geometryObj, val, values?) => {
    try {
      setTimeout(() => {
        if (val) {
          if (!geometryObj) return;
          const { featureName, fontColor, fontSize, fontAnchor } = values;
          geometryObj.showLabel &&
            geometryObj.showLabel({
              text: featureName,
              style: {
                fontColor,
                fontSize,
                fontAnchor,
              },
            });
        } else {
          geometryObj.hideLabel && geometryObj.hideLabel();
        }
      }, 100);
    } catch (error) {
      console.log("error", error);
    }
  };
  const areaFeatureEvent = useCallback(
    (v, type) => {
      let obj = {};
      if (store.geometryDataMapStore) {
        for (let key in store.geometryDataMapStore) {
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
        const getKeyByValue = (obj, v) => {
          const keys = Object.keys(obj);
          const key = keys.find((key) => obj[key] === v.id);
          return key || null;
        };

        const res = getKeyByValue(obj, v);
        const tempId = res;
        const acce =
          type === "inherent"
            ? res.substring(8, res.length)
            : res.substring(9, res.length);
        const getFunction =
          type === "inherent"
            ? getInherentFeatureDetail
            : getTemporaryFeatureDetail;
        getFunction(acce).then((res) => {
          console.log(res, "res");
          if (res.popFrameStyle) {
            const popFrameStyle = res?.popFrameStyle;
            const content = res?.popFrameStyle?.content
              ? JSON.parse(res?.popFrameStyle?.content)
              : [];
            if (popFrameStyle?.gizmoStatus == "true") {
              popFrameStyle.content = content;
              openComponentFrame({
                uid: type + res.id,
                ...popFrameStyle,
              });
            }
          }
        });
      }
    },
    [geometryDataMap]
  );
  const featureEvent = useCallback(
    (v, type) => {
      let obj = {};
      if (store.geometryDataMapStore) {
        for (let key in store.geometryDataMapStore) {
          const item = store.geometryDataMapStore[key];
          if (item) {
            obj[key] = item.getData ? item.getData().id : "";
          }
        }
        console.log(obj, "objobj");
        const getKeyByValue = (obj, v) => {
          const keys = Object.keys(obj);
          const key = keys.find((key) => obj[key] === v.id);
          return key || null;
        };

        const res = getKeyByValue(obj, v);
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
        getFunction(acce).then((res) => {
          console.log(res, "res");
          if (res.popFrameStyle) {
            const popFrameStyle = res?.popFrameStyle;
            const content = res?.popFrameStyle?.content
              ? JSON.parse(res?.popFrameStyle?.content)
              : [];
            if (popFrameStyle?.gizmoStatus == "true") {
              popFrameStyle.content = content;
              openComponentFrame({
                uid: type + res.id,
                ...popFrameStyle,
              });
            }
          }
        });
      }
    },
    [geometryDataMap]
  );
  //物防上图
  const featureDiagram = (data = [], keys = [], type) => {
    try {
      if (keys.includes("-1")) {
        keys = data.map((item) => item.id);
      }
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

              try {
                let geometryStyle: any = {};
                featureStyle &&
                  featureStyle.fillColor &&
                  (geometryStyle.fillColor = sceneId
                    ? "rgba(0,0,0,0)"
                    : featureStyle.fillColor);
                featureStyle &&
                  featureStyle.outlineColor &&
                  (geometryStyle.outlineColor = sceneId
                    ? "rgba(0,0,0,0)"
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
                // debugger
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
                  // redrawData.Id && store.batchIdMap.set(redrawData.Id, uid);
                  const geometryUtil = new window["KMapUE"].GeometryUtil({
                    viewer: store.viewer,
                  });
                  closeComponentFrame(uid);
                  setFeatureNameShowHide(geometryDataMap[uid], false);
                  if (featureCode === "WALL") {
                    console.log("redrawData", redrawData);
                    // store.batchRemoveAreaData.ids.push(redrawData?.Id);
                    // store.batchRemoveAreaData.wallIds.push(redrawData?.wallId);
                    geometryUtil.remove({
                      ids: [redrawData?.Id],
                      wallIds: [redrawData?.wallId],
                    });
                  } else if (featureCode === "ROUTE") {
                    // store.batchRemoveAreaData.ids.push(redrawData?.Id);
                    // store.batchRemoveAreaData.routeIds.push(redrawData?.routeId);
                    geometryUtil.remove({
                      ids: [redrawData?.Id],
                      routeIds: [redrawData?.routeId],
                    });
                  } else {
                    // debugger
                    // redrawData?.Id && store.batchRemoveAreaData.ids.push(redrawData?.Id);
                    redrawData?.Id &&
                      geometryUtil.remove({ ids: [redrawData?.Id] });
                  }
                  setGeometryDataMap((dataMap) => ({
                    ...dataMap,
                    [uid]: null,
                  }));
                }
              } catch (error) {
                console.log("error", error);
              }
            }
          } catch (error) {
            console.log("error", error);
          }
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
          } catch (error) {
            console.log("error", error);
          }
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
                  "iconPos666itioniconPosition"
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
          } catch (error) {
            console.log("error", error);
          }
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
                    store.batchIdMap.get(index)
                  );

                  setGeometryDataMap((dataMap) => ({
                    ...dataMap,
                    [store.batchIdMap.get(index)]: item,
                  }));
                  setFeatureNameShowHide(
                    item,
                    store.batchPropertyMap.get(index).showName,
                    store.batchPropertyMap.get(index).textParams
                  );
                  item?.on("click", (v) => areaFeatureEvent(v, type));
                });
              },
            },
            store.viewer
          );

        if (store.batchRemoveAreaData?.ids.length > 0) {
          geometryUtil.remove({
            ...store.batchRemoveAreaData,
          });
          store.batchRemoveAreaData?.ids.forEach((item: string) => {
            closeComponentFrame(store.batchIdMap.get(item));
            setFeatureNameShowHide(
              geometryDataMap[store.batchIdMap.get(item)],
              false
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
              }, 200);
            });
          },
        });
      } catch (error) {
        console.log("error", error);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleSelectTemporary = (extra, type) => {
    const dataRef = extra.node.props.dataRef;
    const { switchAnimation, visualAngle, id } = dataRef;
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
      store.viewer.flyTo({ ...rotation, duration });
    }
  };

  const filterNode = (item) => {
    if (item.id == "-1") return true;
    // 检查子节点是否满足条件
    const hasMatchingChildren = item.children?.some((child) =>
      filterNode(child)
    );
    return (
      (item.featureName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 &&
        (value.includes(item.id) || value.includes(item.parentId))) ||
      hasMatchingChildren
    );
  };
  return (
    <div
      className="police-deployment arrange-wrap def-deployment"
      style={{ display: arrangeValue === "wfbs" ? "flex" : "none" }}
    >
      <Form layout="vertical" form={form} style={{ padding: "14px 10px" }}>
        <div style={{ display: "flex" }}>
          <FormItem field="keyword" style={{ marginBottom: 0, flex: 1 }}>
            <InputSearch
              autoComplete="off"
              allowClear
              placeholder="请输入关键字搜索要素名称"
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
              title="要素筛选"
              triggerProps={{
                getPopupContainer: () =>
                  document.querySelector(".def-deployment"),
              }}
              height={320}
            >
              <TitleBar>要素类型</TitleBar>
              <div style={{ marginTop: 10 }}>
                <Checkbox
                  onChange={onChangeAll}
                  checked={checkAll}
                  indeterminate={indeterminate}
                  style={{
                    paddingLeft: 0,
                  }}
                >
                  全部
                </Checkbox>
                <CheckboxGroup
                  value={value}
                  options={options}
                  onChange={onChange}
                  className={"def-checkGroup"}
                />
              </div>
            </FilterModal>
          </FormItem>
        </div>
      </Form>
      <div className="people-tree-wrap public-scrollbar">
        {searchData(store.wfInherentTree)?.length === 0 &&
        searchData(store.wfTemporaryTree)?.length === 0 ? (
          <>
            <NoData
              isAnbo
              status={value || inputValue ? true : false}
              image_width={"200px"}
            />
          </>
        ) : (
          <>
            <KArcoTree
              treeData={store.wfInherentTree}
              blockNode
              checkable
              className="organization-tree"
              renderTitle={(options: any) => {
                return getTreeTitle(options);
              }}
              selectedKeys={selectedKeys}
              expandedKeys={expandedKeys}
              fieldNames={{
                key: "id",
                title: "featureName",
              }}
              onSelect={(selectedKeys, extra) => {
                setSelectedKeys(selectedKeys);
                handleSelectTemporary(extra, "inherent");
              }}
              onExpand={(keys, extra) => {
                setExpandedKeys(keys);
              }}
              setExpandedKeys={setExpandedKeys}
              checkedKeys={inherentCheckedKeys}
              onCheck={debounce((checkedKeys) => {
                setInherentCheckedKeys(checkedKeys);
              }, 600)}
              filterNode={filterNode}
            ></KArcoTree>
            <KArcoTree
              treeData={store.wfTemporaryTree}
              blockNode
              checkable
              className="organization-tree"
              renderTitle={(options: any) => {
                return getTreeTitle2(options);
              }}
              selectedKeys={selectedTemporaryKeys}
              expandedKeys={expandedTemporaryKeys}
              fieldNames={{
                key: "id",
                title: "featureName",
              }}
              onSelect={(selectedKeys, extra) => {
                setSelectedTemporaryKeys(selectedKeys);
                handleSelectTemporary(extra, "temporary");
              }}
              onExpand={(keys, extra) => {
                setExpandedTemporaryKeys(keys);
              }}
              setExpandedKeys={setExpandedTemporaryKeys}
              checkedKeys={temporaryCheckedKeys}
              onCheck={debounce((checkedKeys) => {
                setTemporaryCheckedKeys(checkedKeys);
              }, 600)}
              filterNode={filterNode}
            ></KArcoTree>
          </>
        )}
      </div>
    </div>
  );
};

export default observer(DefDeployment);
