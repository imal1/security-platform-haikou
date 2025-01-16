/*
 * @Author: 陈号
 * @Title：地图实例组件
 * @Desc：地图实例组件
 * @Props：mapStyle：地图类型：electron（二维电子地图）、satellite（二维卫星影像）、earth（三维地球）、scene（三维场景）、model（三维模型）;
 * @Props：className：样式名称;solutionId：地图服务Id;loading：地图加载状态;onLoad：地图加载完成后回调
 */

import "./index.less";

import {
  Ajax,
  delScriptTag,
  errorMessage,
  getPortalUrl,
  getProjectRelativePath,
  loadJS,
  loadLink,
  tryGet,
} from "@/kit";
import { Button, InputNumber, Empty } from "@arco-design/web-react";
import { IconMinus, IconPlus } from "@arco-design/web-react/icon";
import React, { CSSProperties, useEffect, useState } from "react";

import { Spin } from "@arco-design/web-react";
import { debounce } from "lodash";
import globalState from "@/globalState";
import { observer } from "mobx-react";
import imgUrl from "@/assets/img/no-data/no-data.png";

const changeZoom = debounce((kmap, val) => {
  kmap && kmap.zoomTo({ zoom: val });
}, 800);

interface MapContentProps {
  useDefaultCfg?: boolean;
  mapStyle?: string;
  className?: string;
  spinClassName?: string;
  mapId?: string;
  modelId?: number;
  solutionId?: string | number;
  coordinateType?: number;
  otherProps?: object;
  isPreview?: boolean;
  sceneId?: number;
  url?: string;
  zoomControl?: boolean; //是否使用自定义缩放组件
  kmapConfig?: boolean; //是否使用配置文件
  onLoad: (res) => void;
  children?: React.ReactNode | string;
  loadingText?: string;
  ogcService?: boolean;
  ogcXmlUrl?: string;
  center?: number[];
  zoom?: number;
  mapContainerStyle?: CSSProperties;
}
//项目的相对路径
const projectRelativePath = getProjectRelativePath();

const MapContent = (props: MapContentProps) => {
  const [loading, setLoading] = useState(true); //ue加载状态
  const [kmap, setKmap] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(0);
  const [message, setMessage] = useState("");
  const {
    className,
    mapContainerStyle = {},
    spinClassName,
    mapId,
    children,
    kmapConfig = true,
    loadingText = "拼命加载地图中...",
  } = props;
  useEffect(() => {
    return () => {
      setLoading(false);
      try {
        kmap && kmap.destroy();
      } catch (error) {}
    };
  }, [kmap]);
  useEffect(() => {
    //初始化地图
    try {
      initialMap();
    } catch (error) {}
  }, [props.mapStyle]);
  const initialMap = () => {
    try {
      //获取地图类型
      const { mapStyle = "electron" } = props;
      if (mapStyle === "electron" || mapStyle === "satellite") {
        //初始化二维地图（电子地图或卫星影像）
        initialElectronMap();
      } else if (mapStyle === "earth") {
        //初始化三维地球
        initialEarthMap();
      } else if (mapStyle === "scene") {
        //初始化三维场景
        initialSceneMap();
      } else if (mapStyle === "model") {
        //初始化三维模型
        initialSceneModel();
      }
    } catch (error) {}
  };
  /**
   * 初始化二维地图（电子地图或卫星影像）
   */
  const initialElectronMap = () => {
    try {
      //获取地图服务参数
      const {
        mapId,
        solutionId,
        onLoad,
        className,
        spinClassName,
        coordinateType,
        zoomControl,
        ...otherProps
      } = props;
      //获取地图SDK地址
      const kMapServiceUrl = `${projectRelativePath}static/kmap/kmap-2d/kmap-service.js`;
      let script = document.querySelector(`script[src='${kMapServiceUrl}']`);
      // delScriptTag(kMapServiceUrl);
      const initMap = () => {
        //获取地图配置内容
        Ajax.get(`${projectRelativePath}static/config/kmapue.config.json`).then(
          (config) => {
            //获取地图配置URL
            const configUrl = getMapConfig(config);
            //初始化地图实例
            const kMap = new window["KMap"]({
              configUrl: configUrl,
              containerId: mapId || "map",
              solution: solutionId,
              ...otherProps,
              onLoadMap: (res) => {
                //地图返回结果集
                setMessage("");
                const mapResult = {
                  map: kMap,
                  data: tryGet(res, "map") ? true : false,
                  status: tryGet(res, "map") ? 10 : 20,
                  code: 200,
                  message: "地图加载完成",
                };
                // 路由切换太快，导致 map 容器被销毁
                if (!document.getElementById(mapId || "map")) {
                  console.error(
                    "map is loaded after map component is destroyed"
                  );
                  return;
                }
                setKmap(kMap);
                getZoom(kMap);
                zoomControl && openZoomControl(kMap);
                //1、更新实例变量
                setLoading(false);
                Object.assign(mapResult, {
                  kmapConfig: config,
                });
                //2、完成后回调地图
                onLoad && onLoad(mapResult);
              },
              onError: (res) => {
                //地图返回结果集
                const mapResult = {
                  ...res,
                  map: null,
                  data: false,
                  status: 20,
                  message: errorMessage(res),
                };
                setMessage(res.message);
                //1、更新实例变量
                setLoading(false);

                //2、完成后回调地图
                onLoad && onLoad(mapResult);
              },
            });
          }
        );
      };
      if (script&&window["KMap"]) {
        initMap();
      } else {
        //动态加载地图SDK
        loadJS(kMapServiceUrl, () => {
          initMap();
        });
      }
    } catch (error) {}
  };
  const openZoomControl = (kmap) => {
    kmap.addEventOnMap({
      event: "moveend",
      handler: function (res) {
        getZoom(kmap);
      },
    });
  };
  const getZoom = (kmap) => {
    kmap.getZoom({
      callback: function (result) {
        setCurrentZoom(result.data.toFixed(2));
      },
    });
  };
  /**
   * 初始化三维地球
   */
  const initialEarthMap = () => {
    try {
      //获取地图服务参数
      const { onLoad, mapId, isPreview, sceneId } = props;
      //获取地图SDK地址
      const kMapEarthCssUrl = `${projectRelativePath}static/kmap/kmap-3d/earth/kmap-earth.css`;
      const kMapEarthJsUrl = `${projectRelativePath}static/kmap/kmap-3d/earth/kmap-earth.js`;
      const kMapBaseJsUrl = `${projectRelativePath}static/kmap/kmap-3d/earth/kmap-earth-base.js`;

      //动态加载地图SDK
      loadLink(kMapEarthCssUrl, () => {
        //获取地图配置内容
        Ajax.get(`${projectRelativePath}static/config/kmapue.config.json`).then(
          (config) => {
            loadJS(kMapBaseJsUrl, () => {
              loadJS(kMapEarthJsUrl, () => {
                //获取地图配置URL
                const configUrl = getMapConfig(config);
                //初始化地图实例
                const kMapEarth = window["KMapEarth"];
                // @ts-ignore
                const kMap = new KMapEarth.Viewer(mapId || "map", {
                  configUrl: configUrl,
                  isPreview: isPreview,
                  sceneId: sceneId,
                  // msaaSamples: 4,
                  onLoadMap: (res: any) => {
                    //1、更新实例变量
                    setLoading(false);
                    //2、完成后回调地图
                    onLoad && onLoad({ map: kMap, kMapEarth, ...res });
                  },
                });
              });
            });
          }
        );
      });
    } catch (error) {}
  };

  /**
   * 初始化三维场景
   */
  const initialSceneMap = () => {
    try {
      //获取地图服务参数
      const { mapId, onLoad } = props;
      //获取地图SDK地址
      const kMapSceneUrl = `${projectRelativePath}static/kmap/kmap-3d/scene/kmap-scene.js`;

      //动态加载地图SDK
      loadJS(kMapSceneUrl, () => {
        //获取地图配置内容
        Ajax.get(`${projectRelativePath}static/config/kmapue.config.json`).then(
          (config) => {
            //获取地图配置URL
            const configUrl = getMapConfig(config);
            //初始化地图实例
            // @ts-ignore
            const kMap = new KMapScene.Viewer({
              configUrl: configUrl,
              containerId: mapId || "map",
              onLoad: (res) => {
                //1、更新实例变量
                setLoading(false);

                //2、完成后回调地图
                onLoad && onLoad({ map: kMap, ...res });
              },
            });
          }
        );
      });
    } catch (error) {}
  };

  /**
   * 初始化三维模型
   */
  const initialSceneModel = () => {
    try {
      //获取地图服务参数
      const { mapId, modelId, onLoad, url } = props;
      //获取地图SDK地址
      const kMapSceneUrl = `${projectRelativePath}static/kmap/kmap-3d/scene/kmap-scene.js`;

      //动态加载地图SDK
      loadJS(kMapSceneUrl, () => {
        //获取地图配置内容
        Ajax.get(`${projectRelativePath}static/config/kmapue.config.json`).then(
          (config) => {
            //获取地图配置URL
            const configUrl = getMapConfig(config);
            //初始化地图实例
            // @ts-ignore
            const kMap = new KMapScene.Viewer({
              configUrl: configUrl,
              containerId: mapId || "map",
              isPreview: true,
              onLoad: (res) => {
                if (res.status === 10) {
                  //初始化模型实例
                  //@ts-ignore
                  const modelMap = new KMapScene.Model({
                    id: modelId,
                    url: url,
                  });
                  //添加模型到地图
                  modelMap.addToViewer({
                    viewer: kMap,
                    ended: (result) => {
                      //地图返回结果集
                      let mapResult = { map: kMap, ...res, modelRes: result };
                      if (result.status === 10) {
                        mapResult = { ...mapResult, modelMap };
                      }

                      //1、更新实例变量
                      setLoading(false);
                      //定位到合适位置
                      kMap &&
                        kMap.moveToObject({
                          object: modelMap,
                          ended: (res: any) => {
                            // console.log('定位结果', res);
                          },
                        });
                      //2、完成后回调地图
                      onLoad && onLoad(mapResult);
                    },
                  });
                } else {
                  //1、更新实例变量
                  setLoading(false);

                  //2、完成后回调地图
                  onLoad && onLoad({ map: kMap, ...res });
                }
              },
            });
          }
        );
      });
    } catch (error) {}
  };

  /**
   * 获取地图配置
   *
   * @const
   * @memberof MapContent
   */
  const getMapConfig = (defaultConfig) => {
    try {
      //地图默认的配置信息
      const earthDistUrl = "./static/kmap/kmap-3d/earth/resources";
      const sceneDistUrl = "./static/kmap/kmap-3d/scene/public";
      const distUrl = ["scene", "model"].includes(props.mapStyle)
        ? sceneDistUrl
        : earthDistUrl;
      let mapConfig = {
        ...defaultConfig,
        distUrl,
      };

      //解构出云平台基础URL和用户信息
      const { userInfo } = globalState.get();
      const portalUrl = getPortalUrl();
      if (
        !kmapConfig &&
        portalUrl &&
        userInfo &&
        tryGet(userInfo, "userName") &&
        tryGet(userInfo, "userToken")
      ) {
        //优先使用云平台传入的地图配置
        mapConfig = {
          ...mapConfig,
          portalUrl: portalUrl,
          userName: tryGet(userInfo, "userName"),
          secretKey: tryGet(userInfo, "userToken"),
        };
      }

      //是否为外网环境存在则替换
      const gatewayProxy = globalState.get("gatewayProxy");
      if (
        JSON.stringify(gatewayProxy) === "true" ||
        JSON.stringify(gatewayProxy) === "false"
      ) {
        mapConfig["gatewayProxy"] = gatewayProxy;
      }

      //传入的坐标系参数存在则替换
      const { coordinateType } = props;
      if (coordinateType && !isNaN(coordinateType)) {
        mapConfig[coordinateType] = parseInt(coordinateType + "");
      }

      //将json转换为blob
      const blob = new Blob([JSON.stringify(mapConfig)], {
        type: "application/json",
      });
      //将blob转换为临时url
      return URL.createObjectURL(blob);
    } catch (error) {}
  };
  const { zoomControl } = props;

  useEffect(() => {
    if (kmap) {
      kmap.resize();
    }
  }, [props.mapContainerStyle]);
  return (
    <Spin
      className={
        spinClassName ? `map-content-spin ${spinClassName}` : "map-content-spin"
      }
      tip={loadingText}
      loading={loading}
      style={mapContainerStyle}
    >
      <div
        id={mapId || "map"}
        className={
          className ? `map-content-wrap ${className}` : "map-content-wrap"
        }
      >
        {zoomControl && !loading && (
          <div className="zoom-control-wrap">
            <Button
              icon={<IconPlus />}
              size="large"
              onClick={() => {
                kmap && kmap.zoomIn();
              }}
              style={{
                width: 42,
                borderRadius: 0,
                color: "#fff",
                fontSize: 16,
                background: "#2F3544",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            />
            <InputNumber
              placeholder=""
              hideControl
              precision={2}
              disabled
              min={3}
              max={20}
              value={currentZoom}
              onChange={(val) => {
                if (val) {
                  setCurrentZoom(val);
                  changeZoom(kmap, val);
                  // kmap && kmap.zoomTo({ zoom: val });
                }
              }}
              size="large"
              style={{ width: 42, borderRadius: 0 }}
            />
            <Button
              icon={<IconMinus />}
              size="large"
              onClick={() => {
                kmap && kmap.zoomOut();
              }}
              style={{
                width: 42,
                borderRadius: 0,
                color: "#fff",
                fontSize: 16,
                background: "#2F3544",
                borderBottomLeftRadius: 4,
                borderBottomRightRadius: 4,
              }}
            />
          </div>
        )}
        {children}
        {message && <Empty className={'map-empty'} imgSrc={imgUrl} description={message} />}
      </div>
    </Spin>
  );
};

export default observer(MapContent);
