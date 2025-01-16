import styles from "./index.module.less";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { debounce } from "lodash";
import FloatBox from "../FloatBox";
import {
  Form,
  AutoComplete,
  Input,
  Select,
  Button,
  Checkbox,
  Radio,
  InputNumber,
  Slider,
  ColorPicker,
  Grid,
  Switch,
  TreeSelect,
  Message,
  Space,
  Popconfirm,
  Tooltip,
  Modal,
  Popover,
  Tag,
} from "@arco-design/web-react";
import { IconClose, IconDelete } from "@arco-design/web-react/icon";
import { InputColorPIcker } from "@/components";
import { regExp, deep, formatDate, getTypeof, getPlanId } from "@/kit";
import TitleBar from "../title-bar";
import { observer } from "mobx-react";
import store from "../../store/attributes-store";
import storeFloat from "../../store/index";
import ComponentConfig from "./component-config";
import ViewPerspectives from "./view-visual-angle";
import VideoDevice from "./video-device";
import AddDevice from "./add-device";
import { NoData } from "@/components";
import classNames from "classnames";
import * as turf from "@turf/turf";
import exclamationCircle from "@/assets/img/exclamationCircle.png";
import qt1 from "@/assets/img/qt-style1.png";
import qt2 from "@/assets/img/qt-style2.png";
import qt3 from "@/assets/img/qt-style3.png";
import vip_car from "@/assets/img/place-manage/vip_car.png";
import qzdbc from "@/assets/img/place-manage/qzdbc.png";
import jcxlc from "@/assets/img/place-manage/jcxlc.png";
import ldczc from "@/assets/img/place-manage/ldczc.png";
import jcsjc from "@/assets/img/place-manage/jcsjc.png";
import snry from "@/assets/img/place-manage/snry.jpg";
import * as webapi from "../../store/webapi";
import globalState from "@/globalState";
import FrameSelectDevice from "./frame-select-device";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const RadioGroup = Radio.Group;
const { Row, Col } = Grid;
const Option = Select.Option;
const qtStyleList = [
  {
    label: "蓝色流动线",
    value: "1",
    imgUrl: qt1,
  },
  {
    label: "红色方块线",
    value: "2",
    imgUrl: qt2,
  },
  {
    label: "红色流动线",
    value: "3",
    imgUrl: qt3,
  },
];
const carTypeList = [
  {
    label: "警车/巡逻车",
    value: 2,
    imgUrl: jcxlc,
  },
  {
    label: "领导观展车",
    value: 7,
    imgUrl: ldczc,
  },
  {
    label: "轿车/私家车",
    value: 5,
    imgUrl: jcsjc,
  },
  {
    label: "vip车辆",
    value: 0,
    imgUrl: vip_car,
  },
  {
    label: "群众大巴车",
    value: 1,
    imgUrl: qzdbc,
  },
  {
    label: "室内人员",
    value: 9,
    imgUrl: snry,
  },
];
interface EleAttributesProps {
  indexStore: any;
  addFeatureStorage?: any;
  editFeature?: any;
  callback?: (obj) => void;
  modelChange?: (featureCode, status) => void;
}

const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 17,
  },
};
const formListLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
};

const arrangeList = [
  {
    label: "要素属性",
    value: "yssx",
  },
  {
    label: "查看视角",
    value: "cksj",
  },
  {
    label: "组件配置",
    value: "zjpz",
  },
];

const EleAttributes = (props: EleAttributesProps) => {
  const { addFeatureStorage, editFeature, callback, indexStore, modelChange } =
    props;
  const current = useMemo(() => {
    return editFeature?.id ? editFeature : addFeatureStorage;
  }, [props.addFeatureStorage, props.editFeature]);
  console.log(props, "propsprops", current);
  const [curValue, setCurValue] = useState("yssx");
  const [routeTime, setRouteTime] = useState("0");
  const [detail, setDetail]: any = useState({});
  const [attrType, setAttrType] = useState(0);
  const [showName, setShowName] = useState(false);
  const [gizmoStatus, setGizmoStatus] = useState(false);
  const [carDevice, setCarDevice] = useState([]);
  const [carDeviceMap, setCarDeviceMap] = useState([]);
  const [workGroup, setWorkGroup] = useState([]);
  const [form] = Form.useForm();
  const { closeComponentFrame } = storeFloat;
  const [isSave, setIsSave] = useState(true);
  useEffect(() => {
    storeFloat.rightCollapsed = false;
    store.changeState({
      indexStore,
      viewer: indexStore.viewer,
    });
  }, []);

  const {
    securityTypeList,
    securityTypeWallList,
    routeTypeList,
    modalVisible,
    isHasObj,
    modalMap,
    workGroupList,
    carDeviceList,
    sceneList,
  } = store;
  const { geometryObj, viewer, checkedKeysArr, checkedKeysInherentArr } =
    indexStore;
  useEffect(() => {
    setIsSave(true);
    init();
    store.geometryUtilThree = new window["KMapUE"].GeometryUtil({
      viewer: indexStore.viewer,
    });
    store.geometryUtilThree.updateTips("draw");
  }, [indexStore.viewer, props.addFeatureStorage, props.editFeature]);
  useEffect(() => {
    return () => {
      store.clearGizmoControl();
      if (store.geometryUtilThree) {
        store.drawId && store.geometryUtilThree.remove({ ids: [store.drawId] });
        // store.geometryUtilThree.cancel();
        store.position = [];
        store.drawId = "";
        store.geometryUtilThree.updateTips("draw");
      }
      if (current.featureCode === "ROUTE") {
        geometryObj?.off("circle_contextmenu");
      }
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      // 在延迟时间结束后执行逻辑
      if (
        indexStore.geometryObj &&
        store.gizmoControl &&
        current.featureType != "SITE_DRAWING"
      ) {
        selectCurrentGizmo();
      }
    }, 1000);
    // 每次输入值改变时，清除之前的定时器
    return () => {
      clearTimeout(timer);
    };
  }, [indexStore.geometryObj, store.gizmoControl, store.elementType]);
  const init = async () => {
    store.changeState({
      viewer: indexStore.viewer,
      geometryObj: indexStore.geometryObj,
    });
    getAttrType();
    store.initialData();
    store.changeState({ attrForm: form });
    store.getDeviceTypes();
    store.getTagList();
    store.getRbacDepartmentTree();
    store.getWorkGroupList();
    store.getCarDeviceList();
    store.getAllDevice();
    if (current.id) {
      getDetail();
      store.associateElement = current.id;
    } else {
      const { Point } = current;
      store.iconPosition = Point;
      setDefaultView();
      store.associateElement = null;
    }
  };
  useEffect(() => {
    if (curValue == "zjpz") {
      store.changeState({
        elementType: "elementIcon",
      });
    }
  }, [curValue]);
  useEffect(() => {
    if (current.featureType === "SITE_DRAWING") {
      indexStore.geometryObj &&
        indexStore.geometryObj.edit &&
        indexStore.geometryObj.edit();
      if (current.featureCode === "ROUTE") {
        routeContextmenu();
      }
    } else {
      if (!geometryObj) return;
      geometryObj &&
        geometryObj.on("click", (v) => {
          let elementType = "";
          if (v.type == "label") {
            elementType = "label";
          } else if (v.type == "road") {
            elementType = "roadlabel";
          } else if (v.type == "model") {
            elementType = "elementModel";
          } else {
            elementType = "elementIcon";
          }
          store.elementType = elementType;
        });
    }
  }, [indexStore.geometryObj]);
  useEffect(() => {
    const carDeviceListCurrent = carDevice.map((item) => {
      const row = carDeviceList.find((car) => car["gbid"] == item) || {};
      return {
        label: row.name,
        value: row.gbid,
      };
    });
    setCarDeviceMap(carDeviceListCurrent);
  }, [carDevice]);
  const selectCurrentGizmo = () => {
    try {
      const row = indexStore.geometryObj?.getData();
      const id = row?.id;
      if (store.elementType != "elementModel") {
        store.gizmoControl.setMode("translate");
      }
      store.gizmoControl.attachElement({
        type: store.elementType, // 可选值：elementIcon、elementModel、label、roadlabel
        id,
        onComplete: (res) => {},
        onError: (err) => {},
      });
    } catch (error) {}
  };
  const getAttrType = () => {
    const { featureType = "SITE_DRAWING", featureCode = "WALL" } = current;
    let type = 1;
    if (featureType === "SITE_DRAWING") {
      if (["AREA", "AOR"].includes(featureCode)) {
        type = 1; //场地绘制-区域、责任区
      } else if (featureCode === "ROUTE") {
        type = 2; //场地绘制-路线
      } else {
        type = 3; //场地绘制-墙
      }
    } else if (featureType === "PHYSICAL_DEFENSE") {
      if (["KNIFE_REST", "ANTI_COLLISION", "GUARDRAIL"].includes(featureCode)) {
        type = 4; //物防-拒马/防冲撞/护栏
      } else {
        type = 5; //方案管理-物防（升降柱、巡逻车、出入口、安检站、消防栓）
      }
    } else {
      if (["PUNCTUATION"].includes(featureCode)) {
        type = 6; //场所设施-标点
      } else if (["TEXT"].includes(featureCode)) {
        type = 7; //场所设施-文本
      } else if (["SIGNPOST"].includes(featureCode)) {
        type = 9; //场所设施-路牌
      } else {
        type = 8; //场所设施-其他要素
      }
    }
    setAttrType(type);
    store.attrType = type;
    if (type === 7) {
      store.elementType = "label";
    } else if (type === 9) {
      store.elementType = "roadlabel";
    } else {
      // store.elementType = "elementIcon";
    }
    if ([4, 5, 6, 7, 8, 9].includes(type)) {
      store.createGizmoControl();
      store.openGizmoControl(true, () => {
        selectCurrentGizmo();
      });
    } else {
      store.createGizmoControl();
      store.openGizmoControl(true, () => {
        // selectCurrentGizmo();
        store.gizmoControl.setBlockLists([
          "EnclosureActor",
          "BP_MyLabel_C",
          "BP_BiaoDian_C",
          "PhysicalDefenseActor",
          "APoiDeviceActor",
          "PoiDeviceActor",
        ]);
      });
    }
  };
  const defaultModalWidth = () => {
    const { featureCode } = current;
    switch (featureCode) {
      case "KNIFE_REST":
        return 0.41;
      case "ANTI_COLLISION":
        return 0.95;
      case "GUARDRAIL":
        return 0.4;
      default:
        return 0.4;
    }
  };
  const defaultModalHeight = () => {
    const { featureCode } = current;
    switch (featureCode) {
      case "KNIFE_REST":
        return 0.86;
      case "ANTI_COLLISION":
        return 1.07;
      case "GUARDRAIL":
        return 1.21;
      default:
        return 1.21;
    }
  };
  const setDefaultView = () => {
    const mainView = globalState.get("mainView");
    form.setFieldsValue(mainView);
    store.rotation = mainView;
    if (current.id) {
      viewer.flyTo(mainView);
    }
  };
  const routeContextmenu = () => {
    if (!geometryObj) return;
    geometryObj &&
      geometryObj.on("circle_contextmenu", (res) => {
        const { id, position } = res;
        const { lng, lat, alt } = position;
        if (store.isAdd) {
          // store.add();
          const passingPoints = form.getFieldValue("passingPoints") || [];
          form.setFieldValue("passingPoints", [
            ...passingPoints,
            {
              name: "",
              point: `${lng},${lat},${alt}`,
            },
          ]);
          // store.isAdd = false;
        }
      });
  };
  const getStringObj = (str) => {
    try {
      const obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return {};
    }
  };
  //获取详情加回显
  const getDetail = async () => {
    try {
      const { type, id } = current;
      const apiName =
        type === "inherent"
          ? webapi.getInherentFeatureDetail
          : webapi.getTemporaryFeatureDetail;
      const res = await apiName(id);
      setDetail(res);
      const featureStyle = getStringObj(res.featureStyle);
      const addDTO: any = res.popFrameStyle || {};
      addDTO.content = addDTO.content
        ? JSON.parse(addDTO.content)
        : [
            {
              value: "",
              key: "",
            },
          ];
      // addDTO.styleType

      const modelStyle = getStringObj(res.modelStyle);
      const visualAngle = getStringObj(res.visualAngle);
      const switchAnimation = getStringObj(res.switchAnimation);
      const iconPosition = getStringObj(res.iconPosition);
      const position = getStringObj(res.position);
      store.changeState({
        animationType: switchAnimation.animationType,
        iconPosition,
        position,
        modalMap: res.showModel == 1 ? true : false,
        rotation: visualAngle.rotation || {},
        modelAltitude: modelStyle.modelAltitude,
      });
      setShowName(res.showName ? true : false);
      if (res.showModel && attrType === 5) {
        store.elementType = "elementModel";
      }
      const carDeviceArr = res.carDevice ? res.carDevice.split(",") : [];
      const workGroupArr = res.workGroup ? res.workGroup.split(",") : [];
      setGizmoStatus(addDTO.gizmoStatus == "true" ? true : false);
      const carDeviceMapTemp = res.carDeviceMap
        ? JSON.parse(res.carDeviceMap)
        : [];
      const params = {
        sceneId: res.sceneId,
        featureName: res.featureName,
        aliasName: res.aliasName,
        showName: res.showName ? true : false,
        securityType: res.securityType,
        carDevice: carDeviceArr,
        workGroup: workGroupArr,
        responsibleUnits: res.responsibleUnits,
        securityInstruction: res.securityInstruction,
        gizmoStatus: addDTO.gizmoStatus == "true" ? true : false,
        carType: res.carType,
        passingPoints: featureStyle.passingPoints,
        ...addDTO,
        ...featureStyle,
        ...modelStyle,
        ...visualAngle,
        ...switchAnimation,
      };
      setCarDevice(carDeviceArr);
      setCarDeviceMap(carDeviceMapTemp);
      setWorkGroup(workGroupArr);
      store.visualType = visualAngle.visualType;
      if (res.devices) {
        store.devices = res.devices || [];
      }
      setTimeout(() => {
        form.setFieldsValue(params);
      });

      store.detailData = params;
      // if (visualAngle.visualType == "0") {
      //   setDefaultView();
      // }
    } catch (error) {
      // console.log(error, "debuggerdebuggerdebugger");
    }
  };
  const getNewGeometry = () => {
    try {
      const promise = new Promise<void>((resolve, reject) => {
        isHasObj(geometryObj) &&
          geometryObj?.complete({
            onComplete: (geometryData: any) => {
              resolve(geometryData);
              const isShow = form.getFieldValue("showName");
              setFeatureNameShowHide(isShow);
            },
          });
      });
      return promise;
    } catch (error) {
      return "";
    }
  };

  const findNonExistentSegments = (
    arr: Array<Array<number>>,
    segments: Array<Array<number>>
  ) => {
    const nonExistentSegments = [];

    segments.forEach((segment, index) => {
      if (!arr.some((element) => arraysEqual(element, segment))) {
        nonExistentSegments.push(index);
      }
    });

    return nonExistentSegments;
  };

  const arraysEqual = (a: Array<number>, b: Array<number>) => {
    // 如果两个数组长度都小于2，或者点位之间的阈值大于0.000001时说明不匹配
    if (
      (a.length < 2 && b.length < 2) ||
      (Math.abs(a[0] - b[0]) > 0.000001 && Math.abs(a[1] - b[1]) > 0.000001)
    )
      return false;

    return true;
  };
  const getPointNames = (passingPoints, indexs) => {
    const list = passingPoints.filter((item, index) => indexs.includes(index));
    return list.map((item) => item.name).join("、");
  };
  const onSave = async () => {
    try {
      setIsSave(false);
      const values = await form.validate().catch((err) => {
        console.log(err);
      });

      const { type, id, venueId, planId, parentId, featureType, featureCode } =
        current;
      if (modalMap && attrType === 4 && store.position?.length < 2) {
        setIsSave(true);
        return Message.warning("请先绘制！");
      }
      const featureStyle = {
        fontColor: values.fontColor,
        fontSize: values.fontSize,
        fontAnchor: values.fontAnchor,
        backgroundColor: values.backgroundColor,
        opacity: values.opacity,
        routeColor: values.routeColor,
        routeWidth: values.routeWidth,
        routeTime: values.routeTime,
        time: values.time,
        scale: values.scale,
        fillColor: values.fillColor,
        outlineColor: values.outlineColor,
        outlineWidth: values.outlineWidth,
        type: values.type || 2,
        brightness: values.brightness,
        passingPoints: values.passingPoints || null,
      };
      const rotationUe = store.rotationUe;
      const modelStyle: any = {
        modelWidth: values.modelWidth,
        modelHeight: values.modelHeight,
        modelScale: values.modelScale,
        modelAltitude: store.modelAltitude,
      };
      if (rotationUe !== null) {
        modelStyle.rotation = rotationUe;
      }
      const visualAngle = {
        visualType: values.visualType,
        pitch: values.pitch,
        heading: values.heading,
        alt: values.alt,
        rotation: store.rotation,
      };
      const switchAnimation = {
        animationType: values.animationType,
        animationTime: values.animationType != "0" ? values.animationTime : 0,
      };
      const positionFrame = store.positionFrame;
      const addDTO = {
        gizmoStatus: values.gizmoStatus,
        popFrameName: values.popFrameName,
        content: values.content,
        featureLibraryId: id,
        position: positionFrame
          ? [positionFrame.lng, positionFrame.lat]
          : [
              store.detailData?.positionX || 108.37646075775328,
              store.detailData?.positionY || 22.8129738636835,
            ],
        altitude:
          (positionFrame && positionFrame.alt) ||
          store.detailData?.altitude ||
          13,

        styleType: values.styleType ? values.styleType : "horizontal",
      };

      console.log(addDTO, "-----");

      let geometry = id ? detail.geometry : current.geometry;
      if (current.featureType === "SITE_DRAWING") {
        let geometryJson: any = await getNewGeometry();

        if (values.carType == 9) {
          geometryJson = {
            ...geometryJson,
            ...{ geometry: geometryJson.threegeometry },
          };
        }
        geometry = JSON.stringify(geometryJson);
      } else {
        const isShow = form.getFieldValue("showName");
        setFeatureNameShowHide(isShow);
      }
      console.log("store.iconPosition", store.iconPosition);
      let params: any = {
        featureName: values.featureName,
        showName: values.showName ? 1 : 0,
        aliasName: values.aliasName,
        sceneId: values.sceneId || "",
        featureStyle: JSON.stringify(featureStyle),
        showModel: modalMap ? 1 : 0,
        position: modalMap ? JSON.stringify(store.position) : null,
        modelStyle: JSON.stringify(modelStyle),
        securityType: values.securityType,
        responsibleUnits: values.responsibleUnits,
        securityInstruction: values.securityInstruction,
        visualAngle: JSON.stringify(visualAngle),
        switchAnimation: JSON.stringify(switchAnimation),
        geometry,
        devices: store.devices,
        iconPosition: store.iconPosition
          ? JSON.stringify(store.iconPosition)
          : null,
        addDTO,
        carType: values.carType,
        carDevice: values.carDevice?.join(),
        workGroup: values.workGroup?.join(),
        carDeviceMap: JSON.stringify(carDeviceMap),
      };

      if (id) {
        params.id = id;
        params.addDTO.id = detail?.popFrameStyle?.id;
      } else {
        let buildingContent: any = geometryObj.getBuildingInfo();
        if (getTypeof(buildingContent) == "object") {
          buildingContent = [buildingContent];
        }
        if (type === "inherent") {
          params.venueId = venueId;
        } else {
          params.planId = planId;
        }
        params = {
          ...params,
          parentId,
          featureType,
          featureCode,
          buildingContent:
            buildingContent.length == 0 ? "" : JSON.stringify(buildingContent),
        };
      }
      if (attrType === 2 && values.passingPoints?.length > 0) {
        const row = geometryObj.getData();
        const coordinates = row?.geometry?.coordinates[0];
        const points = values.passingPoints.map((item) => {
          const point = item.point.split(",");
          return [point[0], point[1]];
        });
        const list = findNonExistentSegments(coordinates, points);
        const onLine = list.length > 0;
        console.log(onLine, "onLine");
        if (list?.length > 0) {
          const names = getPointNames(values.passingPoints, list);
          Modal.confirm({
            title: "提示",
            content: `途经点（${names}）不在路线上，是否确认保存。`,
            onOk: () => {
              save({ params, type, id });
            },
            onCancel: () => {
              geometryObj.edit();
              setIsSave(true);
            },
          });
        } else {
          save({ params, type, id });
        }
      } else {
        save({ params, type, id });
      }
    } catch (error) {
      Message.error("校验失败，请检查必填字段！");
      setIsSave(true);
      console.log(error);
    }
  };

  const save = async ({ params, type, id }) => {
    const uid = id ? type + id : 1;
    if (type === "inherent") {
      if (id) {
        await webapi.updateInherentFeature(params);
        Message.success("更新成功");
      } else {
        const id = await webapi.addInherentFeature(params);
        indexStore.changeState({
          checkedKeysInherentArr: [...checkedKeysInherentArr, id],
        });
        store.changeState({
          addElement: {
            id,
            element: store.geometryObj,
          },
        });
        Message.success("保存成功");
      }
    } else {
      if (id) {
        await webapi.updateTemporaryFeature(params);
        Message.success("更新成功");
      } else {
        const id = await webapi.addTemporaryFeature(params);
        Message.success("保存成功");
        indexStore.changeState({ checkedKeysArr: [...checkedKeysArr, id] });
        store.changeState({
          addElement: {
            id,
            element: store.geometryObj,
          },
        });
      }
    }
    closeComponentFrame(uid);
    indexStore.getAllPlans();
    store.removeDeviceLayer();
    setTimeout(() => {
      store.modalVisible = false;
      indexStore.isAttributes = false;
    }, 600);
    handleAllDeviceCorrect();
  };
  const onCancel = () => {
    setIsSave(false);
    const { id, type } = current;
    const uid = id ? type + id : 1;
    if (
      modalMap &&
      attrType === 4 &&
      store.geometryUtilThree &&
      store.position?.length < 2
    ) {
      store.geometryUtilThree.cancel();
    }
    if (id) {
      setDefault(detail);
      if ([1, 2, 3, 4].includes(attrType)) {
        setTimeout(() => {
          isHasObj(geometryObj) && geometryObj.complete();
        }, 500);
      }
    } else {
      const sceneId = form.getFieldValue("sceneId");
      if (sceneId && store.nnzrg) {
        store.nnzrg?.destroy(sceneId);
      }
      setTimeout(() => {
        isHasObj(geometryObj) && geometryObj.remove();
        indexStore.changeState({
          geometryObj: null,
        });
      }, 500);
    }
    closeComponentFrame(uid);
    handleAllDeviceCorrect();
    store.removeDeviceLayer();
    setTimeout(() => {
      indexStore.isAttributes = false;
      store.modalVisible = false;
      store.detailData = null;
    }, 800);
  };

  const handleAllDeviceCorrect = () => {
    if (storeFloat.isCorrect) {
      storeFloat.correctOkFunc();
    }
  };

  const filterTreeNode = (inputText, node) => {
    return node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1;
  };
  // 判断对象的键名称是否包含在数组内
  const hasKeyInArr = (obj, arr) => {
    for (let key in obj) {
      if (arr.includes(key)) {
        return true;
      }
    }
    return false;
  };

  const formChange = (value, values) => {
    if (hasKeyInArr(value, ["sceneId"])) return;
    if (
      hasKeyInArr(value, [
        "showName",
        "featureName",
        "fontColor",
        "fontSize",
        "fontAnchor",
      ]) &&
      ![7, 9].includes(attrType)
    ) {
      setFeatureNameShowHide(values.showName);
      return;
    }

    let params: any = {};
    if ([4, 5, 6, 8].includes(attrType)) {
      params = {
        ...params,
        scale: values.scale,
      };
    }
    if ([4].includes(attrType)) {
      params = {
        ...params,
        modelWidth: values.modelWidth,
        modelHeight: values.modelHeight,
        // type: store.modalMap ? "model" : "icon",
      };
    }
    if ([5].includes(attrType)) {
      params = {
        ...params,
        scale: values.scale,
        modelScale: values.modelScale,
        type: store.modalMap ? "model" : "icon",
      };
    }
    if (![2, 4].includes(attrType)) {
      params = {
        ...params,
        fontColor: values.fontColor,
        fontSize: values.fontSize,
      };
      if (attrType != 7) {
        params.backgroundColor = values.backgroundColor;
      }
    }
    if ([9].includes(attrType)) {
      console.log(params, "attrTypeattrType");
      params = {
        ...params,
        text: values.aliasName,
      };
    }

    if ([4, 5, 6, 8, 9].includes(attrType)) {
      store.elementUpdate(params);
      if (attrType === 5) {
        // store.elementType = store.modalMap ? "elementModel" : "elementIcon";
        setTimeout(() => {
          selectCurrentGizmo();
        }, 500);
      }
    }

    if ([7].includes(attrType)) {
      params = {
        fontSize: values.fontSize,
        fontColor: values.fontColor,
        backgroundColor: values.backgroundColor,
        scale: values.scale,
      };
      isHasObj(geometryObj) &&
        geometryObj?.update({ text: values.featureName, style: params });
    }

    if (attrType === 1) {
      params = {
        fillColor: values.fillColor,
        outlineColor: values.outlineColor,
        outlineWidth: values.outlineWidth,
      };
      isHasObj(geometryObj) && geometryObj?.update({ geometryStyle: params });
    }
    if (attrType === 2) {
      params = {
        fillColor: values.routeColor,
        outlineColor: values.routeColor,
        outlineWidth: values.outlineWidth,
      };
      let routeParams = {
        routeColor: value.routeColor,
        routeWidth: value.routeWidth,
        routeOpacity: value.opacity / 100,
      };
      isHasObj(geometryObj) &&
        geometryObj?.update({ geometryStyle: params, routeStyle: routeParams });
    }
    if (attrType === 3) {
      params = {
        type: values.type || 2,
        brightness: values.brightness,
        scale: values.scale,
        fillColor: values.fillColor,
      };
      isHasObj(geometryObj) && geometryObj?.update({ closureStyle: params });
    }
  };
  //取消恢复默认
  const setDefault = (res) => {
    // debugger
    const { id, showModel, showName, aliasName, featureName, sceneId } = res;
    const iconPosition = getStringObj(res.iconPosition);
    const position = getStringObj(res.position);
    const featureStyle = getStringObj(res.featureStyle);
    const modelStyle = getStringObj(res.modelStyle);
    const geometry = getStringObj(res.geometry);
    if (![7, 9].includes(attrType)) {
      setFeatureNameShowHide(showName, featureStyle);
    }

    let params: any = {
      position: iconPosition.position,
      height: iconPosition?.height,
      modelAltitude: modelStyle.modelAltitude,
      rotation: modelStyle.rotation || "",
    };
    if ([4, 5, 6, 8].includes(attrType)) {
      let positionOffset = [];
      if (iconPosition && iconPosition.position) {
        positionOffset = [
          [iconPosition.position[0][0] - 0.00002, iconPosition.position[0][1]],
        ];
      }
      params = {
        ...params,
        scale: featureStyle.scale,
        modelPosition:
          !position || (Array.isArray(position) && position.length == 0)
            ? positionOffset
            : position,
      };
    }
    if ([4].includes(attrType)) {
      params = {
        ...params,
        modelWidth: modelStyle.modelWidth,
        modelHeight: modelStyle.modelHeight,
      };
    }
    if ([5].includes(attrType)) {
      params = {
        ...params,
        scale: featureStyle.scale,
        modelScale: modelStyle.modelScale,
        type: showModel ? "model" : "icon",
        position: iconPosition.position,
        modelPosition: position ? position : iconPosition.position,
      };
    }
    if (![2, 4].includes(attrType)) {
      params = {
        ...params,
        fontColor: featureStyle.fontColor,
        fontSize: featureStyle.fontSize,
      };
      if (attrType != 7) {
        params.backgroundColor = featureStyle.backgroundColor;
      }
    }
    if ([9].includes(attrType)) {
      params = {
        ...params,
        text: aliasName,
      };
    }

    if ([4, 5, 6, 8, 9].includes(attrType)) {
      store.elementUpdate(params);
    }

    if ([7].includes(attrType)) {
      params = {
        ...params,
        fontSize: featureStyle.fontSize,
        fontColor: featureStyle.fontColor,
        backgroundColor: featureStyle.backgroundColor,
        scale: featureStyle.scale,
      };
      isHasObj(geometryObj) &&
        geometryObj?.update({ text: featureName, style: params });
    }

    if (attrType === 1) {
      params = {
        fillColor: sceneId ? "#00000000" : featureStyle.fillColor,
        outlineColor: sceneId ? "#00000000" : featureStyle.outlineColor,
        outlineWidth: featureStyle.outlineWidth,
      };
      isHasObj(geometryObj) && geometryObj?.update({ geometryStyle: params });
      if (sceneId) {
        // TODO 这里还是要判断一下是固有还是临时
        store.addNnzrg([
          {
            uid: current.type + id,
            id: sceneId,
            color: featureStyle.fillColor,
          },
        ]);
      }
    }
    if (attrType === 2) {
      params = {
        fillColor: featureStyle.routeColor,
        outlineColor: featureStyle.routeColor,
        outlineWidth: featureStyle.outlineWidth,
      };
      isHasObj(geometryObj) && geometryObj?.update({ geometryStyle: params });
    }
    if (attrType === 3) {
      params = {
        type: featureStyle.type || 2,
        brightness: featureStyle.brightness,
        scale: featureStyle.scale,
        fillColor: featureStyle.fillColor,
      };
      isHasObj(geometryObj) && geometryObj?.update({ closureStyle: params });
    }
  };
  const setFeatureNameShowHide = (val, style?: any) => {
    try {
      if (!geometryObj || [7, 9].includes(attrType)) return;
      setTimeout(() => {
        if (val) {
          const values = form.getFieldsValue();
          const { featureName, fontColor, fontSize, fontAnchor } = values;
          featureName &&
            geometryObj.showLabel({
              text: featureName,
              style: {
                fontColor:
                  style && style.fontColor ? style.fontColor : fontColor,
                fontSize: style && style.fontSize ? style.fontSize : fontSize,
                fontAnchor:
                  style && style.fontAnchor ? style.fontAnchor : fontAnchor,
              },
            });
        } else {
          geometryObj.hideLabel();
        }
      }, 50);
    } catch (error) {}
  };
  //工作组详情
  const getWorkGroupInfo = (row) => {
    const {
      groupName,
      startTime,
      endTime,
      groupLeaderName,
      mainJob,
      orgCodeName,
    } = row;
    return (
      <div className="work-group-info">
        <div className="work-group-li">
          <label htmlFor="">工作组名称</label>
          <span>{groupName}</span>
        </div>
        <div className="work-group-li">
          <label htmlFor="">责任单位</label>
          <span>{orgCodeName || "-"}</span>
        </div>
        <div className="work-group-li">
          <label htmlFor="">起止日期</label>
          <span>
            {formatDate(new Date(startTime), "yyyy/MM/dd")} ~
            {formatDate(new Date(endTime), "yyyy/MM/dd")}
          </span>
        </div>
        <div className="work-group-li">
          <label htmlFor="">组长</label>
          <span>{groupLeaderName}</span>
        </div>
        <div className="work-group-li">
          <label htmlFor="">工作职责</label>
          <span>{mainJob}</span>
        </div>
      </div>
    );
  };
  const sceneChange = (val) => {
    const { id, type } = current;
    const uid = id ? `${type}${id}` : "type";
    const fillColor = form.getFieldValue("fillColor");
    const outlineColor = form.getFieldValue("outlineColor");
    const zrqgroup = deep(store.zrqgroup);
    const index = zrqgroup.findIndex((item) => item.uid == uid);
    if (val) {
      geometryObj?.update({
        geometryStyle: {
          fillColor: "#00000000",
          outlineColor: "#00000000",
        },
      });
      const child = {
        uid,
        id: val,
        color: fillColor,
      };
      if (index > -1) {
        zrqgroup.splice(index, 1, child);
      } else {
        zrqgroup.push(child);
      }
    } else {
      geometryObj?.update({
        geometryStyle: {
          fillColor,
          outlineColor,
        },
      });
      zrqgroup.splice(index, 1);
    }
    store.addNnzrg(zrqgroup);
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(carDeviceMap);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const gbids = items.map((item) => item.value);
    form.setFieldValue("carDevice", gbids);
    setCarDevice(gbids);
    setCarDeviceMap(items);
  };
  const { departmentTree } = store;
  return (
    <FloatBox
      className={styles["ele-attributes"]}
      title={<span>要素属性</span>}
      width={379}
      direction="right"
      extra={
        <>{modalVisible && store.frameSelectVisible && <FrameSelectDevice />}</>
      }
    >
      <Radio.Group
        className="radio-group-buttons"
        options={arrangeList}
        value={curValue}
        onChange={setCurValue}
        type="button"
      />
      {modalVisible && <AddDevice />}

      <Form
        form={form}
        autoComplete="off"
        {...formItemLayout}
        className={"attr-from public-scrollbar"}
        initialValues={{
          slider: 20,
          content: [
            {
              key: "",
              value: "",
            },
          ],
          style: "1",
          popFrameName: props.addFeatureStorage?.featureName,
        }}
        // onValuesChange={onValuesChange}
        scrollToFirstError
        onChange={debounce(formChange, 600)}
      >
        <div
          className={"attr-con"}
          style={{ display: curValue === "yssx" ? "flex" : "none" }}
        >
          <TitleBar content={"要素样式"} style={{ marginBottom: 14 }} />
          <div className="visual-angle-type">
            <Form.Item
              label="要素名称"
              field="featureName"
              rules={[
                { required: true, message: "请输入要素名称" },
                {
                  match: regExp.LetterNumberUnderlineOrChinese,
                  message: "只支持中英文、数字、下划线",
                },
              ]}
            >
              <Input
                placeholder="要素名称"
                maxLength={20}
                style={{ width: [2, 3, 7, 9].includes(attrType) ? 220 : 120 }}
                allowClear
              />
            </Form.Item>
            {![2, 3, 7, 9].includes(attrType) && (
              <Form.Item
                className={"animation-time"}
                label=""
                field="showName"
                style={{ width: 100 }}
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Checkbox onChange={setShowName} checked={showName}>
                  名称显示
                </Checkbox>
              </Form.Item>
            )}
          </div>
          {![2, 3, 7, 9].includes(attrType) && (
            <>
              <Form.Item
                label="文字颜色"
                field="fontColor"
                rules={[
                  { required: true, message: "请输入文字颜色" },
                  { match: regExp.colorRegex, message: "请输入正确的色值" },
                ]}
                initialValue={"#ffffff"}
              >
                <InputColorPIcker placeholder="文字颜色" />
              </Form.Item>
              {attrType && (
                <Form.Item
                  label="文字大小"
                  field="fontSize"
                  initialValue={![4, 5, 6, 8].includes(attrType) ? 100 : 20}
                  rules={[
                    {
                      type: "number",
                      required: true,
                      message: "请输入文字大小",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="文字大小"
                    min={12}
                    max={![4, 5, 6, 8].includes(attrType) ? 600 : 50}
                  />
                </Form.Item>
              )}
            </>
          )}
          {![2, 3, 7, 9].includes(attrType) && (
            <>
              <Form.Item
                label="文字位置"
                field="fontAnchor"
                initialValue={"top"}
              >
                <Select
                  placeholder="文字位置"
                  getPopupContainer={() => document.querySelector(".attr-from")}
                  options={[
                    { label: "标绘上方", value: "top" },
                    { label: "标绘下方", value: "bottom" },
                    { label: "标绘右侧", value: "right" },
                    { label: "标绘左侧", value: "left" },
                    { label: "标绘右上方", value: "top-right" },
                    { label: "标绘右下方", value: "bottom-right" },
                    { label: "标绘左上方", value: "top-left" },
                    { label: "标绘左下方", value: "bottom-left" },
                  ]}
                  allowClear
                />
              </Form.Item>
            </>
          )}
          {attrType === 7 && (
            <>
              <Form.Item
                label="背景颜色"
                field="backgroundColor"
                rules={[
                  { required: true, message: "请输入背景颜色" },
                  { match: regExp.colorRegex, message: "请输入正确的色值" },
                ]}
                initialValue={"#0D1624CD"}
              >
                <InputColorPIcker placeholder="背景颜色" />
              </Form.Item>
            </>
          )}
          {attrType === 9 && (
            <Form.Item
              label="道路名称"
              field="aliasName"
              rules={[{ required: true, message: "请输入名称" }]}
            >
              <Input
                placeholder="道路名称"
                maxLength={20}
                style={{ width: attrType === 9 ? 220 : 120 }}
                allowClear
              />
            </Form.Item>
          )}

          {attrType === 2 && (
            <>
              <Form.Item
                label="路线颜色"
                field="routeColor"
                rules={[
                  { required: true, message: "请输入路线颜色" },
                  { match: regExp.colorRegex, message: "请输入正确的色值" },
                ]}
                initialValue={"#EA930FFF"}
              >
                <InputColorPIcker placeholder="路线颜色" />
              </Form.Item>
              <Form.Item label="路线透明度" field="opacity" initialValue={100}>
                <Slider showInput />
              </Form.Item>
              <Form.Item label="路线宽度" field="routeWidth" initialValue={2.5}>
                <Slider
                  min={0.5}
                  max={10.0}
                  defaultValue={1}
                  step={0.1}
                  // marks={{ 0.5: "0.5", 2.0: "2.0" }}
                  style={{ padding: "0 4px", marginBottom: 0 }}
                />
              </Form.Item>
              <Form.List field="passingPoints">
                {(fields, { add, remove, move }) => {
                  setTimeout(() => {
                    store.changeState({
                      add,
                      isAdd: true,
                    });
                    store.geometryUtilThree.updateTips("addpasspoint");
                  }, 1000);
                  return (
                    <div>
                      <Form.Item
                        label={
                          <label>
                            路径途经点
                            <Tooltip content="鼠标右键单击编辑点可设置途经点。">
                              <div
                                className="prompt-icon"
                                style={{
                                  position: "absolute",
                                  top: 5,
                                  display: "inline-block",
                                }}
                              ></div>
                            </Tooltip>
                          </label>
                        }
                      >
                        {/* <div
                          className="passing-points-add"
                          onClick={() => {
                            store.changeState({
                              add,
                              isAdd: true,
                            });
                            store.geometryUtilThree.updateTips("addpasspoint");
                          }}
                        >
                          <div className="add-icon"></div>
                          <label htmlFor="">新增</label>
                        </div> */}
                      </Form.Item>
                      {fields.map((item, index) => {
                        return (
                          <div key={item.key}>
                            <Form.Item
                              label={"途经点名称"}
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                              {...formListLayout}
                            >
                              <div className="passing-points-item">
                                <Form.Item
                                  field={item.field + ".name"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "请输入途经点名称",
                                    },
                                  ]}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Input
                                    placeholder="请输入途经点名称"
                                    allowClear
                                  />
                                </Form.Item>
                                <Form.Item
                                  field={item.field + ".point"}
                                  rules={[{ required: true }]}
                                  style={{ display: "none" }}
                                  initialValue={""}
                                >
                                  <Input />
                                </Form.Item>
                                <Popconfirm
                                  focusLock
                                  title="你确定要删除该途经点吗？"
                                  content=""
                                  onOk={() => {
                                    remove(index);
                                  }}
                                  onCancel={() => {}}
                                >
                                  <IconDelete className="del" />
                                </Popconfirm>
                              </div>
                            </Form.Item>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              </Form.List>
              <div className="visual-angle-type">
                <Form.Item
                  label="路线时长"
                  field="routeTime"
                  initialValue={"0"}
                  rules={[{ required: true, message: "请选择路线时长" }]}
                >
                  <RadioGroup onChange={setRouteTime}>
                    <Radio value="0">推荐时长</Radio>
                    <Radio value="1">自定义时长</Radio>
                  </RadioGroup>
                </Form.Item>
                {routeTime == "0" ? (
                  <Form.Item
                    label=""
                    field="time"
                    style={{
                      width: 120,
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    initialValue={10}
                  >
                    <Select
                      placeholder="文字位置"
                      getPopupContainer={() =>
                        document.querySelector(".attr-from")
                      }
                      options={[
                        { label: "低速 5秒", value: 5 },
                        { label: "中速 10秒", value: 10 },
                        { label: "高速 10秒", value: 20 },
                      ]}
                      // allowClear
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    label=""
                    field="time"
                    style={{
                      width: 110,
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                    }}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <InputNumber
                      placeholder="请输入时长"
                      min={1}
                      max={299}
                      suffix={<span>秒</span>}
                    />
                  </Form.Item>
                )}
              </div>
            </>
          )}
          {[4, 5, 6, 8].includes(attrType) && (
            <Form.Item label="要素大小" field="scale" initialValue={1}>
              <Slider
                min={0.5}
                max={10.0}
                defaultValue={1}
                step={0.1}
                // marks={{ 0.5: "0.5", 2.0: "2.0" }}
                style={{ padding: "0 4px", marginBottom: 0 }}
              />
            </Form.Item>
          )}
          {[1, 3].includes(attrType) && (
            <>
              <Form.Item
                label="填充颜色"
                field="fillColor"
                rules={[
                  { required: true, message: "请输入填充颜色" },
                  { match: regExp.colorRegex, message: "请输入正确的色值" },
                ]}
                initialValue={"#FF6806B3"}
              >
                <InputColorPIcker
                  placeholder="填充颜色"
                  suffix={<ColorPicker />}
                  onChange={(val) => {
                    const sceneId = form.getFieldValue("sceneId");
                    if (sceneId) {
                      sceneChange(sceneId);
                    }
                  }}
                />
              </Form.Item>
              {/* <Form.Item label="填充透明度" field="slider1" initialValue={20}>
                <Slider showInput />
              </Form.Item> */}
            </>
          )}
          {[1].includes(attrType) && (
            <>
              <Form.Item
                label="边框线颜色"
                field="outlineColor"
                initialValue={"#f42800"}
                rules={[
                  { match: regExp.colorRegex, message: "请输入正确的色值" },
                ]}
              >
                <InputColorPIcker placeholder="边框线颜色" />
              </Form.Item>
              {/* <Form.Item
                label="边框透明度"
                field="borderOpacity"
                initialValue={100}
              >
                <Slider showInput />
              </Form.Item> */}
              <Form.Item
                label="边框线宽度"
                field="outlineWidth"
                initialValue={1}
              >
                <Slider
                  min={0.5}
                  max={10}
                  step={0.1}
                  // marks={{ 0.5: "0.5", 2.0: "2.0" }}
                  style={{ padding: "0 4px", marginBottom: 0 }}
                />
              </Form.Item>
              <Form.Item
                label={
                  <label style={{ paddingRight: 15 }}>
                    场景包裹
                    <Tooltip content="获取场景内置包裹效果，若选中则场景中渲染包裹面效果；若不选择则使用绘制的责任区域。">
                      <div
                        className="prompt-icon"
                        style={{
                          position: "absolute",
                          top: 5,
                          display: "inline-block",
                        }}
                      ></div>
                    </Tooltip>
                  </label>
                }
                field="sceneId"
              >
                <Select
                  placeholder="请选择"
                  getPopupContainer={() => document.querySelector(".attr-from")}
                  showSearch
                  allowClear
                  onChange={sceneChange}
                  filterOption={(inputValue, option) =>
                    option.props.value
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) >= 0 ||
                    option.props.children.props.content
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) >= 0
                  }
                >
                  {sceneList.map((item) => (
                    <Option key={item.value} value={item.value}>
                      <Tooltip content={item.label}>
                        <div className="text-overflow">{item.label}</div>
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
          {attrType === 3 && (
            <>
              {/* <Form.Item
                label="墙体样式"
                field="type"
                rules={[
                  { type: "number", required: true, message: "请输入墙体样式" },
                ]}
                initialValue={"1"}
              >
                <Radio.Group
                  className="qt-radio-group"
                  onChange={(val) => {
                    if (["1", "3"].includes(val)) {
                      form.setFieldValue("scale", 20);
                    } else {
                      form.setFieldValue("scale", 10);
                    }
                  }}
                >
                  {qtStyleList.map((item) => {
                    return (
                      <Radio key={item.value} value={item.value}>
                        {({ checked }) => {
                          return (
                            <div
                              tabIndex={-1}
                              key={item.value}
                              className={classNames(
                                "qtRadio",
                                checked && "active"
                              )}
                            // type={checked ? "primary" : "default"}
                            >
                              <img src={item.imgUrl} alt="" />
                            </div>
                          );
                        }}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Form.Item> */}
              <Form.Item
                label="墙体亮度"
                field="brightness"
                rules={[
                  { type: "number", required: true, message: "请输入墙体亮度" },
                ]}
                initialValue={4}
              >
                <InputNumber placeholder="墙体亮度" />
              </Form.Item>
              <Form.Item
                label="墙体高度"
                field="scale"
                rules={[
                  { type: "number", required: true, message: "请输入墙体高度" },
                ]}
                initialValue={10}
              >
                <InputNumber placeholder="墙体高度" max={200} min={1} />
              </Form.Item>
            </>
          )}
          {[4, 5].includes(attrType) && (
            <>
              <TitleBar
                content={
                  <div className="model-upmap">
                    <label htmlFor="">模型上图</label>
                    <Switch
                      size="small"
                      checked={modalMap}
                      onChange={(val) => {
                        store.modalMap = val;
                        store.elementType = val
                          ? "elementModel"
                          : "elementIcon";
                        if (attrType == 4) {
                          setTimeout(() => {
                            modelChange &&
                              modelChange(current?.featureCode, val);
                            store.modelOpen(val);
                            store.openGizmoControl(!val);
                          }, 200);
                        } else {
                          setTimeout(() => {
                            formChange(null, form.getFieldsValue());
                          }, 200);
                        }
                        // formChange(null, form.getFieldsValue());
                      }}
                    />
                  </div>
                }
                style={{ marginBottom: 14 }}
              />
              {modalMap && attrType === 4 && (
                <>
                  <Form.Item label="模型操作" field="">
                    <div className="model-opts">
                      <img src={exclamationCircle} />
                      <label>提示：请上图绘制</label>
                    </div>
                  </Form.Item>
                  <Form.Item
                    label="尺寸(m)"
                    field=""
                    rules={[{ required: true, message: "请输入尺寸" }]}
                  >
                    <Form.Item
                      label="宽度"
                      field="modelWidth"
                      requiredSymbol={false}
                      rules={[
                        {
                          type: "number",
                          required: true,
                          message: "请输入宽度",
                        },
                      ]}
                      initialValue={defaultModalWidth()}
                    >
                      <InputNumber placeholder="宽度" max={100} />
                    </Form.Item>
                    <Form.Item
                      label="高度"
                      field="modelHeight"
                      requiredSymbol={false}
                      rules={[
                        {
                          type: "number",
                          required: true,
                          message: "请输入高度",
                        },
                      ]}
                      initialValue={defaultModalHeight()}
                    >
                      <InputNumber placeholder="高度" max={100} />
                    </Form.Item>
                  </Form.Item>
                </>
              )}
              {modalMap && attrType === 5 && (
                <>
                  <Form.Item
                    label="模型比例"
                    field="modelScale"
                    initialValue={1}
                  >
                    <Slider
                      min={0.5}
                      max={10.0}
                      defaultValue={1}
                      step={0.1}
                      // marks={{ 0.5: "0.5", 2.0: "2.0" }}
                      style={{ padding: "0 4px", marginBottom: 0 }}
                    />
                  </Form.Item>
                </>
              )}
            </>
          )}
          {![6, 7].includes(attrType) && (
            <>
              <TitleBar content={"安保属性"} style={{ marginBottom: 14 }} />
              {[3].includes(attrType) && (
                <Form.Item
                  label="类型"
                  field="securityType"
                  rules={[{ required: true, message: "请选择类型" }]}
                >
                  <Select
                    placeholder="请选择"
                    getPopupContainer={() =>
                      document.querySelector(".attr-from")
                    }
                    options={
                      current?.featureCode === "WALL"
                        ? securityTypeWallList
                        : securityTypeList.filter((v) => v.value !== "CORE")
                    }
                    allowClear
                  />
                </Form.Item>
              )}

              {[2].includes(attrType) && (
                <>
                  <Form.Item
                    label="路线类型"
                    field="securityType"
                    rules={[{ required: true, message: "请选择路线类型" }]}
                  >
                    <Select
                      placeholder="请选择"
                      getPopupContainer={() =>
                        document.querySelector(".attr-from")
                      }
                      options={routeTypeList}
                      defaultValue={
                        detail.securityType ? routeTypeList : "OTHER"
                      }
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="车辆类型" field="carType">
                    <Radio.Group
                      className="qt-radio-group"
                      onChange={(val) => {
                        if (["1", "3"].includes(val)) {
                          form.setFieldValue("scale", 20);
                        } else {
                          form.setFieldValue("scale", 10);
                        }
                      }}
                    >
                      {carTypeList.map((item) => {
                        return (
                          <Radio key={item.value} value={item.value}>
                            {({ checked }) => {
                              return (
                                <div
                                  tabIndex={-1}
                                  key={item.value}
                                  className={classNames(
                                    "carRadio",
                                    checked && "active"
                                  )}
                                >
                                  <img src={item.imgUrl} alt="" />
                                  <div className="name">{item.label}</div>
                                </div>
                              );
                            }}
                          </Radio>
                        );
                      })}
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item label="车载设备" field="carDevice">
                    <Select
                      placeholder="请输入设备名称或GBID"
                      mode="multiple"
                      maxTagCount={1}
                      getPopupContainer={() =>
                        document.querySelector(".attr-from")
                      }
                      showSearch
                      allowClear
                      onChange={setCarDevice}
                      filterOption={(inputValue, option) =>
                        option.props.value
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0 ||
                        option.props.children.props.content
                          .toLowerCase()
                          .indexOf(inputValue.toLowerCase()) >= 0
                      }
                    >
                      {carDeviceList.map((item) => (
                        <Option key={item.value} value={item.value}>
                          <Tooltip content={item.label}>
                            <div className="text-overflow">{item.label}</div>
                          </Tooltip>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  {carDevice?.length > 0 && (
                    <div className="select-active-box">
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="carDeviceList">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {carDeviceMap.map((item, index) => (
                                <Draggable
                                  key={item.value}
                                  draggableId={item.value}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      className="select-li"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                        ...(snapshot.isDragging
                                          ? {
                                              boxShadow:
                                                "0px 0px 10px 2px #0c82d2 inset",
                                            }
                                          : { cursor: "move" }),
                                      }}
                                    >
                                      <label
                                        htmlFor=""
                                        className="text-overflow"
                                      >
                                        {item.label}
                                      </label>
                                      {index == 0 && (
                                        <Tag
                                          size="small"
                                          style={{
                                            backgroundColor:
                                              "rgba(215, 114, 42, 0.2)",
                                            borderColor: "#fd8022",
                                            color: "#fd8022",
                                            marginRight: 8,
                                            fontSize: 14,
                                            padding: "0 4px",
                                            height: 20,
                                            lineHeight: "18px",
                                          }}
                                          bordered
                                        >
                                          路线追踪
                                        </Tag>
                                      )}
                                      <Tooltip content="删除">
                                        <IconDelete
                                          onClick={() => {
                                            const arr = deep(carDevice);
                                            const index = carDevice.indexOf(
                                              item.value
                                            );
                                            arr.splice(index, 1);
                                            setCarDevice(arr);
                                            form.setFieldValue(
                                              "carDevice",
                                              arr
                                            );
                                          }}
                                        />
                                      </Tooltip>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  )}
                </>
              )}
              <Form.Item label="工作组" field="workGroup">
                <Select
                  placeholder="请选择"
                  mode="multiple"
                  maxTagCount={1}
                  getPopupContainer={() => document.querySelector(".attr-from")}
                  showSearch
                  allowClear
                  onChange={setWorkGroup}
                  filterOption={(inputValue, option) =>
                    option.props.value
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) >= 0 ||
                    option.props.children.props.children.props.children
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) >= 0
                  }
                  dropdownMenuClassName="group-work-select-drop"
                >
                  {workGroupList.map((item) => (
                    <Option key={item.value} value={item.value}>
                      <Popover
                        content={getWorkGroupInfo(item)}
                        getPopupContainer={() =>
                          document.querySelector(".attr-from")
                        }
                      >
                        <div>{item.label}</div>
                      </Popover>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {workGroup?.length > 0 && (
                <div className="select-active-box">
                  {workGroupList
                    .filter((item) => workGroup.includes(item.value))
                    .map((item) => (
                      <div className="select-li" key={item.value}>
                        <label htmlFor="" className="text-overflow">
                          {item.label}
                        </label>
                        <Tooltip content="删除">
                          <IconDelete
                            onClick={() => {
                              const arr = deep(workGroup);
                              const index = workGroup.indexOf(item.value);
                              arr.splice(index, 1);
                              setWorkGroup(arr);
                              form.setFieldValue("workGroup", arr);
                            }}
                          />
                        </Tooltip>
                      </div>
                    ))}
                </div>
              )}
              {![5, 8].includes(attrType) && (
                <Form.Item label="责任单位" field="responsibleUnits">
                  <TreeSelect
                    showSearch
                    placeholder="请选择"
                    treeData={departmentTree}
                    treeCheckStrictly={false}
                    filterTreeNode={filterTreeNode}
                    fieldNames={{
                      key: "id",
                      title: "name",
                    }}
                    notFoundContent={<NoData status={true} />}
                    getPopupContainer={() =>
                      document.querySelector(".attr-from")
                    }
                    treeProps={{
                      onSelect: (v, n) => {
                        console.log(n);
                      },
                    }}
                  />
                </Form.Item>
              )}

              <Form.Item label="说明" field="securityInstruction">
                <Input.TextArea placeholder="请输入" maxLength={200} />
              </Form.Item>
              <VideoDevice />
            </>
          )}
        </div>
        <div
          className={"attr-con"}
          style={{ display: curValue === "cksj" ? "flex" : "none" }}
        >
          <ViewPerspectives />
        </div>
        <div
          className={"attr-con"}
          style={{ display: curValue === "zjpz" ? "flex" : "none" }}
        >
          <ComponentConfig
            current={current}
            form={form}
            gizmoStatus={gizmoStatus}
          />
        </div>
      </Form>
      <div className="footer">
        <Button onClick={onCancel} disabled={!isSave}>
          取消
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isSave}
          style={{ marginLeft: 10 }}
          onClick={onSave}
        >
          确认
        </Button>
      </div>
    </FloatBox>
  );
};

export default observer(EleAttributes);
