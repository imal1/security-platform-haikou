/**
 * KMediaUni 组件
 */
import { useState, useEffect } from "react";
import classNames from "classnames";
import {
  loadJS,
  getProjectRelativePath,
  delScriptTag,
  // @ts-ignore
} from "@/kit";

import "./index.less";

//项目的相对地址
const projectRelativePath = getProjectRelativePath();

interface KMediaUniProps {
  id?: string;
  className?: string;
  websocketUrl?: string;
  devId?: string;
  mode?: string;
  src?: string;
  nmediaId?: string;
  startTime?: string;
  endTime?: string;
  onLoad?: (res) => void;
}

const KMediaUniContent = (props: KMediaUniProps) => {
  const {
    id = "KMediaUniId",
    websocketUrl = window.globalConfig["websocketUrl"],
    devId,
    mode,
    src,
    nmediaId,
    startTime,
    endTime,
    className,
    onLoad,
  } = props;
  const [kmediaUni, setKmediaUni] = useState(null);
  useEffect(() => {
    initialKmediaUni();
    //监听浏览器页面关闭事件
    window.addEventListener("beforeunload", () => {
      kmediaUni && kmediaUni.destroy();
    });
  }, []);
  useEffect(() => {
    return () => {
      try {
        kmediaUni && kmediaUni.destroy();
      } catch (error) {}
    };
  }, [kmediaUni]);
  useEffect(() => {
    try {
      let cfg = null;
      if (websocketUrl || devId) {
        cfg = {
          websocketUrl,
          devId,
        };
      } else {
        cfg = src;
      }
      kmediaUni &&
        kmediaUni.loadVideo({
          src: cfg,
          autoplay: true,
          muted: true,
        });
    } catch (error) {}
  }, [websocketUrl, devId, src]);
  const initialKmediaUni = () => {
    const kMediaUniServiceUrl = `${projectRelativePath}static/kmediauni/kmedia-uni.js`;
    delScriptTag(kMediaUniServiceUrl);
    //动态加载KMapUE的SDK
    loadJS(kMediaUniServiceUrl, () => {
      try {
        let cfg = null;
        const nmediaId = window["globalConfig"].nmediaId || 0;
        if (websocketUrl || devId) {
          cfg = {
            websocketUrl,
            devId,
            nmediaId,
          };
        } else {
          cfg = src;
        }
        const kmediauni = new window["KMediaUni"]({
          selector: `#${id}`,
          loading: true,
          showMessage: true,
          control: {
            hideControlsBar: false,
            tools: Object.values(window["KMediaUni"].TOOLS),
          },
          onLoad: async (res: any) => {
            console.log("kmediauni load res:", res);
            kmediauni.loadVideo({
              src: cfg,
              autoplay: true,
            });
            setKmediaUni(kmediauni);
            onLoad && onLoad(kmediauni);
          },
          error: async (err: any) => {},
        });
        kmediauni &&
          kmediauni.loadVideo({
            src: cfg,
            autoplay: true,
          });
        setKmediaUni(kmediauni);
        onLoad && onLoad(kmediauni);
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <>
      <div
        id={id}
        className={classNames("KMediaUni-content-wrap", className)}
      ></div>
    </>
  );
};
export default KMediaUniContent;
