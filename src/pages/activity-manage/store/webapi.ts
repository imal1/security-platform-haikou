import { getServerBaseUrl, request } from "kit";

// 获取自动化测试参数
export const getParams = (params) => {
  return request.get("/atps/testCaseTask/frontendTask", params);
};
// 获取行政区划及下属信息
export const getRegionAndChildren = (params) => {
  const CTSearchServer = getServerBaseUrl("CTSearchServer");
  return request.post(`${CTSearchServer}/region/getRegionAndChildren`, params);
};
//获取部门树(责任单位)
export const getRbacDepartmentTree = () => {
  return request.get(`/rbac/department/tree`);
};
//获取活动类型
export const getActivityTypes = () => {
  return request.get(`/activity/info/types`);
};
//获取活动人员规模
export const getActivityPersonSize = () => {
  return request.get(`/activity/info/personSize`);
};
//获取活动安保等级
export const getActivitySecurityLevel = () => {
  return request.get(`/activity/info/securityLevel`);
};
//获取举办方类型
export const getSceneList = () => {
  return request.get(`/scene/info/list`);
};
//获取场景列表
export const getActivityOrganizerTypes = () => {
  return request.get(`/activity/info/organizerTypes`);
};
//获取举办方类型
export const addActivity = (params) => {
  return request.post(`/activity/info/add`,params);
};
