/**
 * KMapUe 组件
 */
import React, { useState, useEffect } from "react";
import {
  Ajax,
  tryGet,
  loadJS,
  errorMessage,
  getProjectRelativePath,
  delScriptTag,
  // @ts-ignore
} from "@/kit";
import { Spin } from "@arco-design/web-react";
import globalState from "@/globalState";
import "./index.less";

//项目的相对地址
const projectRelativePath = getProjectRelativePath();

interface KMapUeContentProps {
  domId?: string;
  spinClassName?: string;
  className?: string;
  solution: number;
  autoDestroy?: number;
  children?: React.ReactNode | string;
  onLoad: (res) => void;
  onDestroy?: () => void;
}
const KMapUeContent = (props: KMapUeContentProps) => {
  const {
    domId,
    spinClassName,
    className,
    solution,
    children,
    onLoad,
    onDestroy,
    autoDestroy = 0,
    ...otherProps
  } = props;

  const [loading, setLoading] = useState(true); //ue加载状态
  const [ue, setUe] = useState(null);
  useEffect(() => {
    initialKMapUe();
    //监听浏览器页面关闭事件
    window.addEventListener("beforeunload", () => {
      ue && ue.close();
    });
  }, []);
  useEffect(() => {
    return () => {
      try {
        ue && ue.close();
      } catch (error) {}
    };
  }, [ue]);

  const initialKMapUe = () => {
    const kMapUeServiceUrl = `${projectRelativePath}static/kmapue/KMapUE.js`;
    delScriptTag(kMapUeServiceUrl);
    //动态加载KMapUE的SDK
    loadJS(kMapUeServiceUrl, () => {
      //解构出云平台基础URL和用户信息
      const { baseUrl, userInfo } = globalState.get();
      //获取KMapUE配置内容
      const config = {
        portalUrl: baseUrl,
        userName: tryGet(userInfo, "userName"),
        secretKey: tryGet(userInfo, "userToken"),
      };
      try {
        const ueObj = new window["KMapUE"].ue({
          config,
          container: `${domId || "KMapUeId"}`,
          solution: solution,
          autoDestroy: autoDestroy,
          onComplete: async (res) => {
            //UE返回结果集
            const mapResult = {
              ue: ueObj,
              res,
              code: 200,
              message: "UE加载完成",
            };
            setUe(ueObj);
            onLoad && onLoad(mapResult);
            ueObj.flyTo(globalState.get("mainView"));
            const elementBatch = new window["KMapUE"].SecurityElementBatch({
              viewer: ueObj,
            });
            elementBatch.removeAll();
          },
          onPlay: async () => {
            setLoading(false);
          },
          onError: async (res) => {
            const mapResult = {
              ue: ueObj,
              res: res,
              code: 500,
            };
            setLoading(false);
            onLoad && onLoad(mapResult);
          },
          onDestroy: () => {
            onDestroy && onDestroy();
          },
        });
      } catch (error) {
        console.log(error);
      }
    });
  };
  return (
    <Spin
      className={
        spinClassName
          ? `kMapUe-content-spin ${spinClassName}`
          : "kMapUe-content-spin"
      }
      tip="场景正在加载中..."
      loading={loading}
    >
      <div
        id={domId || "KMapUeId"}
        className={
          className ? `kMapUe-content-wrap ${className}` : "kMapUe-content-wrap"
        }
      >
        {props.children}
      </div>
    </Spin>
  );
};
export default KMapUeContent;
