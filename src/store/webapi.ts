import globalState from "@/globalState";
import { getServerBaseUrl, request } from "@/kit";
// 获取token
export const getAccessToken = (params, url) => {
  return request.get(`${url}/auth/accessToken`, params);
};
/**
 * 获取微服务路由映射
 */
export const platformRegisterInfo = () => {
  const baseUrl = globalState.get("baseUrl");
  return request.get(`${baseUrl}/web/platform/platformRegisterInfo`);
};
/**
 * 获取云平台用户信息
 */
export const getUserBaseInfo = () => {
  const baseUrl = globalState.get("baseUrl");
  return request.get(`${baseUrl}/web/user/currentUserInfo`);
};
// 楼宇分层详情接口
export const buildingFloorDetail = (params) => {
  return request.get(`/device/buildingFloorDetail`, params);
};

export const getEventVenueInfo = (params) => {
  return request.get(`/device/eventVenue`, params);
};
export const getUserInfo = (params) => {
  return request.post(`/device/userDetail`, params);
};
// 图层查询
export const getLayerServiceQuery = (params) => {
  const CTSearchServer = getServerBaseUrl("CTSearchServer");
  return request.post(`${CTSearchServer}/gisdata/service/query`, params);
};
//图层业务数据查询
export const getLayerBusinessQuery = (params) => {
  const CTSearchServer = getServerBaseUrl("CTSearchServer");
  return request.post(`${CTSearchServer}/back/layer/query`, params);
};
