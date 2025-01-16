import styles from "./index.module.less";
import React, { useState, useMemo, useEffect } from "react";
import { observer } from "mobx-react";
import classNames from "classnames";
import { Input, Message, Radio } from "@arco-design/web-react";
import { featureTypes, icons } from "./const";
import { debounce, groupBy } from "lodash";
import FloatBox from "../FloatBox";
import TitleBar from "../title-bar";
import { useLocation } from "react-router-dom";
import { getVenueId } from "../../../../kit/util";
import FeatureRegion from "./feature-region";
import { codeMap } from "../../../constant/index";
import { getTemporaryFeatureDetail } from "../../store/webapi";
import attrStore from "../../store/attributes-store";
import storeFloat from "../../store/index";

const EleStore = ({ store }) => {
  const [searchText, setSearchText] = useState("");
  const [curType, setCurType] = useState("all");
  const { viewer, features, selectedPlan, selectedFeature } = store;
  const location = useLocation();
  const venueId = getVenueId();

  useEffect(() => {
    store.getAllFeatures();
    attrStore.elementType = "elementIcon";

    const handleKeyDown = (event: any) => {
      if (
        event.code == "Escape" && store.selectedFeature && ["AREA","AOR","ROUTE","WALL"].includes(store.selectedFeature.featureCode)
      ) {
        handleFeatureClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearch = debounce((value: string) => {
    setSearchText(value);
  }, 300);

  const groupColumns = useMemo(() => {
    let filterColumns = features.filter((v) =>
      v.featureName.includes(searchText)
    );
    if (curType !== "all") {
      filterColumns = filterColumns.filter((v) => v.featureType === curType);
    }
    return groupBy(filterColumns, "featureType");
  }, [features, curType, searchText]);

  const featureEvent = (v) => {
    console.log(v, "featureE33ventfeatureEventfeatureEvent");
    // attrStore
    if (attrStore.addElement) {
      const { id } = attrStore.addElement;
      getTemporaryFeatureDetail(id).then((res) => {
        if (res.popFrameStyle) {
          const popFrameStyle = res?.popFrameStyle;
          const content = res?.popFrameStyle?.content
            ? JSON.parse(res?.popFrameStyle?.content)
            : [];
          const newContent =
            content?.map((item) => ({ name: item.key, value: item.value })) ||
            [];
          console.log(newContent, "newContent");

          const popFrameName = popFrameStyle?.popFrameName;
          const styleType = popFrameStyle?.styleType;
          const positionX = popFrameStyle.positionX;
          const positionY = popFrameStyle.positionY;
          console.log(store.frameUeIds, "store.frameUeIdsstore.frameUeIds");
          // if (store.frameUeIds[tempId]) return;
          const Frame = new window["KMapUE"].Frame({
            viewer,
            options: {
              style: styleType,
              title: popFrameName,
              contents: newContent,
              position: [positionX, positionY],
              altitude: 30,
              // id: store.frameUeIds[tempId],
              onComplete: (res) => {
                //
                // store.frameUeIds[tempId] = res;
                // console.log(store.frameUeIds, ' store.frameUeIds store.frameUeIds')
              },
              onError: (err) => {
                // do sth.
              },
            },
          });
        }
      });
    }
  };

  const featureEvent1 = (v) => {
    let vid = v.id;
    let vType = v.type;
    if (!store.isCorrect && !store.isAttributes) return null;
    let elementType = "";
    if (vType == "label") {
      elementType = "label";
    } else if (vType == "road") {
      elementType = "roadlabel";
    } else if (vType == "model") {
      elementType = "elementModel";
    } else {
      elementType = "elementIcon";
    }

    if (store.geometryObj && store.geometryObj.getData().id == vid) {
      if (attrStore.gizmoControl.getStatus()) {
        // attrStore.clearGizmoControl();
      } else {
        attrStore.openGizmoControl(true, () => {
          if (elementType != "elementModel") {
            attrStore.gizmoControl.setMode("translate");
          }
          attrStore.gizmoControl.attachElement({
            type: elementType, // 可选值：elementIcon、elementModel、label、roadlabel
            id: store.geometryObj.getData().id,
            onComplete: (res) => {
              attrStore.gizmoControl.setBlockLists([
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
      }
    } else {
      attrStore.clearGizmoControl();
    }
  };

  const handleColumnClick = (feature: FeatureProps) => {
    if (store.isCorrect) {
      Message.warning("正在纠偏，无法创建");
      return;
    }
    store.changeState({ selectedFeature: feature });
    const { featureType, featureName, featureCode } = feature;
    const geometryUtil = new window["KMapUE"].GeometryUtil({ viewer });
    let geometry = {};
    let geometryData = {};

    switch (featureCode) {
      case "AREA": // 区域
      case "AOR": // 责任区
        viewer.endTakePoint();
        break;
      case "ROUTE": // 路线
        viewer.endTakePoint();
        geometryUtil.draw({
          // type: 444,
          type: window["KMapUE"].GeometryType.ROUTE,
          geometryStyle: {
            fillColor: "#FF6200",
            outlineColor: "#FF6200",
            outlineWidth: 10,
          },
          onComplete: (res) => {
            geometry = res;
            geometryData = res.getData();
            // 新增唤起要素面板 入参
            const acce = {
              type:
                location.pathname === "/site_manage" ? "inherent" : "temporary",
              venueId,
              planId: selectedPlan?.id,
              parentId: -1,
              featureType,
              featureCode,
              featureName,
              geometry: JSON.stringify(geometryData),
            };
            store.changeState({
              editFeature: null,
              geometryObj: geometry,
              addFeatureStorage: acce,
              isAttributes: true,
            });
            handleFeatureClose();
          },
          onError: () => {
            handleFeatureClose();
          }
        });
        break;
      case "WALL": // 墙
        viewer.endTakePoint();
        store.changeState({
          isPlanSelect: false,
        });
        geometryUtil.draw({
          type: window["KMapUE"].GeometryType.WALL,
          immeEdit: true,
          closureStyle: {
            type: "2",
          },
          onComplete: (res) => {
            geometry = res;
            geometryData = res.getData();
            console.log(res, "resr44444esres");
            // 新增唤起要素面板 入参
            const acce = {
              type:
                location.pathname === "/site_manage" ? "inherent" : "temporary",
              venueId,
              planId: selectedPlan?.id,
              parentId: -1,
              featureType,
              featureCode,
              featureName,
              geometry: JSON.stringify(geometryData),
            };
            store.changeState({
              editFeature: null,
              geometryObj: geometry,
              addFeatureStorage: acce,
              isAttributes: true,
              isPlanSelect: true,
            });
            handleFeatureClose();
          },
          onError: () => {
            handleFeatureClose();
          }
        });
        break;
      case "TEXT": // 文本
        if (geometryUtil.getDrawState() == "drawing") geometryUtil.cancel();
        viewer.startTakePoint({});
        viewer.off("take_point");
        viewer.on("take_point", (res) => {
          console.log("TEXT", res);
          const getToArr = (obj) => {
            return { position: res, height: obj.alt + 1 };
          };
          const Point = getToArr(res);
          const TEXT = new window["KMapUE"].Label({
            viewer: viewer,
            options: {
              text: "文本",
              position: { ...res, ...{ alt: res && res.alt + 1 } },
              style: {
                fontSize: 100,
                fontColor: "#ffffff",
                backgroundColor: "#0D1624CD",
              },
              onComplete: (res) => {
                const acce = {
                  type:
                    location.pathname === "/site_manage"
                      ? "inherent"
                      : "temporary",
                  venueId,
                  Point,
                  planId: selectedPlan?.id,
                  parentId: -1,
                  featureType,
                  featureCode,
                  featureName,
                  geometry: res,
                };
                store.changeState({
                  editFeature: null,
                  geometryObj: TEXT,
                  addFeatureStorage: acce,
                  isAttributes: true,
                });
                handleFeatureClose();
                TEXT.on("click", (v) => {
                  featureEvent1(v);
                });
              },
              onError: (err) => {
                // do sth.
              },
            },
          });
          viewer.endTakePoint({
            onComplete: () => {
              viewer.off("take_point");
            },
          });
        });
        break;

      case "SIGNPOST": // 路牌
        console.log("SIGNPOST");
        if (geometryUtil.getDrawState() == "drawing") geometryUtil.cancel();
        viewer.startTakePoint({});
        viewer.off("take_point");
        viewer.on("take_point", (res) => {
          console.log(res, "resres");
          const getToArr = (obj) => {
            return { position: res, height: obj.alt + 1 };
          };
          const Point = getToArr(res);
          console.log(Point, "PointPointPoint");

          const SIGNPOST = new window["KMapUE"].RoadLabel({
            viewer: viewer,
            options: {
              text: "路牌",
              ...Point,
              onComplete: (res) => {
                console.log(res, "路牌路牌路牌");
                // do sth.
                const acce = {
                  type:
                    location.pathname === "/site_manage"
                      ? "inherent"
                      : "temporary",
                  Point,
                  venueId,
                  planId: selectedPlan?.id,
                  parentId: -1,
                  featureType,
                  featureCode,
                  featureName,
                  geometry: res,
                };
                store.changeState({
                  editFeature: null,
                  geometryObj: SIGNPOST,
                  addFeatureStorage: acce,
                  isAttributes: true,
                });
                handleFeatureClose();
                SIGNPOST.on("click", (v) => {
                  featureEvent1(v);
                });
              },
              onError: (err) => {
                // do sth.
              },
            },
          });

          viewer.endTakePoint({
            onComplete: () => {
              viewer.off("take_point");
            },
          });
        });
        break;
      case "KNIFE_REST":
      case "GUARDRAIL":
      case "ANTI_COLLISION":
        console.log("拒马三兄弟");
        // 拒马三兄弟
        // 鼠标位置
        if (geometryUtil.getDrawState() == "drawing") geometryUtil.cancel();
        viewer.startTakePoint({});
        viewer.off("take_point");
        viewer.on("take_point", (res) => {
          const getToArr = (obj) => {
            return { position: [[obj.lng, obj.lat]], height: obj.alt };
          };
          const Point = getToArr(res);
          console.log(Point, "positionposition");
          const element = new window["KMapUE"].SecurityElement({
            viewer,
            options: {
              scale: 1,
              color: codeMap[featureCode],
              type: "icon",
              elementType: featureCode,
              ...Point,
              onComplete: (res) => {
                console.log("onCompleteonComplete", element.getData());
                const wufangId = element?.getData().id;
                // 唤起要素面板 入参
                const acce = {
                  type:
                    location.pathname === "/site_manage"
                      ? "inherent"
                      : "temporary",
                  venueId,
                  Point,
                  planId: selectedPlan?.id,
                  parentId: -1,
                  featureType,
                  featureCode,
                  featureName,
                  geometry: wufangId,
                };
                store.changeState({
                  editFeature: null,
                  geometryObj: element,
                  addFeatureStorage: acce,
                  isAttributes: true,
                });
                element.on("click", (v) => {
                  featureEvent1(v);
                });
                handleFeatureClose();
              },
              onError: (err) => {},
            },
          });
          viewer.endTakePoint({
            onComplete: () => {
              viewer.off("take_point");
            },
          });
        });
        break;
      default:
        // 其他 物防 和设施 排除拒马三兄弟
        console.log("其他 物防 和设施 排除拒马三兄弟");
        if (geometryUtil.getDrawState() == "drawing") geometryUtil.cancel();
        viewer.startTakePoint({});
        viewer.off("take_point");
        viewer.on("take_point", (res) => {
          console.log(res, "take_pointtake_pointv");
          const positionOffset = [[res.lng - 0.00002, res.lat]];
          const getToArr = (obj) => {
            return { position: [[obj.lng, obj.lat]], height: obj.alt + 1 };
          };
          const Point = getToArr(res);
          const element = new window["KMapUE"].SecurityElement({
            viewer,
            options: {
              scale: 1,
              color: codeMap[featureCode],
              type: "icon",
              elementType: featureCode,
              modelPosition: positionOffset,
              ...Point,
              onComplete: (res) => {
                console.log("onCompleteonCom3plete", element.getData());
                const wufangId = element?.getData().id;
                // 新增物防唤起要素面板 入参
                const acce = {
                  type:
                    location.pathname === "/site_manage"
                      ? "inherent"
                      : "temporary",
                  venueId,
                  Point,
                  planId: selectedPlan?.id,
                  parentId: -1,
                  featureType,
                  featureCode,
                  featureName,
                  geometry: wufangId,
                };
                store.changeState({
                  editFeature: null,
                  geometryObj: element,
                  addFeatureStorage: acce,
                  isAttributes: true,
                });
                handleFeatureClose();
                setTimeout(() => {
                  element.on("click", (v) => {
                    featureEvent1(v);
                  });
                  // element.on("click", (v) => featureEvent(v));
                }, 200);
              },
              onError: (err) => {},
            },
          });

          viewer.endTakePoint({
            onComplete: () => {
              viewer.off("take_point");
            },
          });
        });

        break;
    }
  };

  const handleFeatureClose = () => {
    store.changeState({
      selectedFeature: null,
    });
  };

  return (
    <FloatBox
      className={styles["ele-store"]}
      title="要素库"
      width={379}
      direction="right"
      extra={
        <>
          {(selectedFeature?.featureCode === "AREA" ||
            selectedFeature?.featureCode === "AOR") && (
            <FeatureRegion store={store} onClose={handleFeatureClose} />
          )}
        </>
      }
    >
      <Input.Search
        className="ele-search"
        size="large"
        placeholder="请输入关键字搜索"
        onChange={handleSearch}
      />
      <Radio.Group
        className="radio-group-buttons"
        options={featureTypes}
        value={curType}
        onChange={setCurType}
        type="button"
      />
      <div className="feature-group-wrapper public-scrollbar">
        {featureTypes.map((c) => {
          return (
            groupColumns[c.value] && (
              <div className="feature-group" key={c.value}>
                <TitleBar content={c.label} />
                <div className="feature-columns">
                  {groupColumns[c.value].map((v) => (
                    <div
                      className="column-item"
                      key={v.featureCode}
                      onClick={() => handleColumnClick(v)}
                    >
                      <div
                        className={classNames("column-item-icon", {
                          active:
                            selectedFeature?.featureCode === v.featureCode,
                        })}
                      >
                        <img src={icons[v.featureCode]} width={40} />
                      </div>
                      <div className="column-item-title">{v.featureName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          );
        })}
      </div>
    </FloatBox>
  );
};

export default observer(EleStore);
