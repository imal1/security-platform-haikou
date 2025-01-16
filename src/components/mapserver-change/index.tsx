/**
 * 地图服务列表切换
 */
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import "./index.less";
import { tryGet, request } from "@/kit";
import globalState from "@/globalState";
interface MapServerChangeProps {
  kmap: any;
  solutionId: string | number;
  id:string;
  onChange?: (val) => void;
}
const MapServerChange = (props: MapServerChangeProps) => {
  const { onChange, kmap, solutionId,id="mapserverListWrap" } = props;
  const [mapServerList, setMapServerList] = useState([]);
  const baseUrl = window['globalConfig'].portalUrl;
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    try {
      let data = await getSystemMapSolutionList();
      setMapServerList(data || []);
    } catch (error) {}
  };
  useEffect(() => {
    if (mapServerList.length && solutionId) {
      const row = getCheckSolution(solutionId);
      globalState.set({ spriteType: row.spriteType });
    }
  }, [solutionId, mapServerList]);
  const mapStyleChange = (val) => {
    kmap &&
      kmap.setMapStyle({
        solution: val,
        ended: () => {
          onChange && onChange(val);
        },
      });
  };
  const getCheckSolution = (solutionId) => {
    let row = mapServerList.find((item) => item.solutionId === solutionId);
    return row;
  };
  const getSystemMapSolutionList = () => {
    return request.get("/kd/2d/getSystemMapSolutionList");
  };
  return (
    <div
      className="mapserver-list-wrap"
      id={id}
      onMouseOver={(e) => {
        const dom = document.getElementById(id);
        dom.style.width = `${(mapServerList?.length || 0) * 98 - 4 + 8}px`;
      }}
      onMouseOut={() => {
        const dom = document.getElementById(id);
        dom.style.width = `102px`;
      }}
    >
      <div className="mapserver-list-con">
        {mapServerList?.length > 0 &&
          mapServerList?.map((item) => (
            <div
              className={`mapserver-list-li ${
                item.solutionId === solutionId ? "active" : ""
              }`}
              key={item.solutionId}
              onClick={() => {
                mapStyleChange(item.solutionId);
              }}
            >
              <img src={baseUrl + item.thumbnail} alt="" />
              <div
                className="mapserver-name text-overflow"
                title={item.solutionName?.length > 4 ? item.solutionName : ""}
              >
                {item.solutionName}
              </div>
            </div>
          ))}
      </div>
      {mapServerList?.length > 0 && (
        <div className="mapserver-check-con">
          {solutionId && (
            <div className="mapserver-list-li active">
              <img
                src={
                  baseUrl + tryGet(getCheckSolution(solutionId), "thumbnail")
                }
                alt=""
              />
              <div
                className="mapserver-name text-overflow"
                title={
                  tryGet(getCheckSolution(solutionId), "solutionName")?.length >
                  4
                    ? tryGet(getCheckSolution(solutionId), "solutionName")
                    : ""
                }
              >
                {tryGet(getCheckSolution(solutionId), "solutionName")}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default observer(MapServerChange);
