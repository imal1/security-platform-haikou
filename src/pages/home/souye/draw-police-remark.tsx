import React, { memo, useEffect, useState } from "react";
import { observer } from "mobx-react";
import store, {deviceIcons} from "@/pages/home/store";
import { getPlanId, getVenueId } from "../../../kit/util";

import {getSecurityInfoByPos} from "../store/policeRemarkApi";

let geometryUtilFrame: any = null;
let geometry: any = null;
let currentPolice: any = null;
let planId: any = null;
let venueId = '';
const DrawPoliceRemark = () => {
  const { viewer} = store;
  let geometryData = {};

  const pageDrawMark = () => {
    // 提示鼠标半径
    geometryUtilFrame?.updateTips("distance");
    geometryUtilFrame?.draw({
      type: window["KMapUE"].GeometryType.CIRCLE,
      drawTip: '鼠标单击选定警情标注点，按esc键退出',
      geometryStyle: { fillColor: "rgba(255,0,0,0.18)", outlineColor: "#FF0000", outlineWidth: 0.4},
      onComplete: (res) => {
        geometry = res;
        geometryData = res.getData();
        geometryUtilFrame.updateTips("distance");
        // 获取圆的中心点，
        let centerPoint = geometry.getCenter();
        geometry.edit();
        //  再次编辑触发
        geometry.on("editdata", () => {
          finishDraw(geometry.getEditData(), centerPoint);
        });
        finishDraw(geometry.getEditData(), centerPoint);
        // 当前绘制的圆心用图标打点标注
        currentPolice = new window["KMapUE"].CustomOverlay({
          viewer: store.viewer,
          options: {
            id: 'current-police-remark',
            isFixedScale: true,
            position: centerPoint,
            element: getElement(),
            onComplete: (res) => {
            },
            onError: (err?) => {}
          }
        });
      },
      onError: (res) => {
      }
    });
  };
  const getElement = () => {
    // 当前正在绘制的圆心点标志
    let imgUrl = `${window.location.origin}${window.location.pathname}static/police-remark-flag.png`;
    return '<img style="width: 48px;height: 48px;" src="'+imgUrl+'" alt=""/>';
  };
  const remove = () => {
    geometry?.remove();
    geometry = null;
  };
  const finishDraw = (location, centerPoint) => {
    // 保存位置信息， 图上框选列表打开的时候对应位置的设备上图
    store.location = location;
    // 左侧需展示图上框选列表
    store.homeLeftSideActive="3";
    store.leftVisible = true;
    // 处理警情新增弹窗& 责任区范围弹窗
    searchSecurityArea(location, centerPoint);
  };

  // 查询范围交集的责任区，需要高亮责任区范围、
  const searchSecurityArea = async (location, centerPoint) => {
    const planId = await getPlanId();
    const venueId = getVenueId();
    const param = {
      // 只查中心点
      point: [centerPoint.lng, centerPoint.lat],
      planId: planId,
      venueId: venueId
    };
    let res = await getSecurityInfoByPos(param);
    (res || []).forEach(i => {
      i.isExpanded = false;
      //处理content内容
      let conListStr = i.popFrameStyles?.map(t => t.content);
      let conList = [
        {
          key: '责任单位',
          value: i.responsibleUnitNames
        }
      ];
      conListStr?.forEach(con => {
        let arr = con && JSON.parse(con);
        if(Array.isArray(arr)){
          conList = conList.concat(arr);
        }
      })
      //过滤掉无值的情况-无值就不展示该字段
      i.contentList = conList.filter(i => i.value !== null && i.value !== undefined && i.value !== '');
    } );
    store.homePopSecurityAreaInfo = res || [];
    // 弹出警情新增弹窗
    openAddPoliceRemarkModal(res || [], location, centerPoint, {planId, venueId});
    // 绘制责任区
    if(res?.length){
      drawSecurityArea(res);
    }
  };
  // 绘制责任区
  const drawSecurityArea = (res) => {
    // 统一方法绘制， 直接传入数据
    store.featureDiagram(res, true, (res) => {
      // res-> 对应的id， 展示责任区弹窗
      store.homeSecurityInfoVisible = true;
      store.policeMarkLinkFeatures = res;
    });
    store.homeSecurityInfoVisible = true;
    store.policeMarkLinkFeatures = res;
  };

  //新增警情弹窗（弹窗均支持拖拽显示位置
  const openAddPoliceRemarkModal = (securityInfo, geometry, position, planIdInfo) => {
    let address = "";
    if(securityInfo?.length){
      // 警情发生地字段值是责任区名称，多个责任区名就直接拼接
       address = securityInfo.map(i => i.featureName).join(',');
    }
    // 新增的时候初始化数据结构
    store.selectedPoliceRemark = {
      "name": "",
      "type": "",
      "dealStatus": "0",
      position,
      geometry,
      planId: planIdInfo.planId,
      venueId: planIdInfo.venueId,
      "createdTime":"",
      "description": "",
      "dealDescription": "",
      address
    };
    store.homePoliceRemarkVisible = true;
  };

  useEffect(() => {
    remove();
    store.removeSecurityAreaFeature();
  }, [])


  useEffect(() => {
    if (store.toolActive == "policeRemark") {
      geometryUtilFrame = new window["KMapUE"].GeometryUtil({ viewer });
      pageDrawMark();
    }
  }, [store.toolPoliceRemarkClickTime, store.toolActive]);

  useEffect(() =>{
    // 弹窗关闭， 之前画的消失
    if(!store.homePoliceRemarkVisible){
      remove();
      currentPolice && currentPolice.remove && currentPolice.remove();
    }
  }, [store.homePoliceRemarkVisible]);
  useEffect(() => {
    if (!store.location) {
      remove();
      // 移除绘制的责任区
      store.removeSecurityAreaFeature();
    }
  }, [store.location]);

  return (<></>);
};
export default observer(DrawPoliceRemark);
