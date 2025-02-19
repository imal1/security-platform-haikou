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
//获取活动状态
export const getActivityStatus = () => {
  return request.get(`/activity/info/activityStatus`);
};
//新增活动
export const addActivity = (params) => {
  return request.post(`/activity/info/add`, params);
};
//编辑活动
export const updateActivity = (params) => {
  return request.put(`/activity/info/update`, params);
};
//删除活动
export const deleteActivity = (id) => {
  return request.delete(`/activity/info/${id}`, null);
};
//获取活动列表
export const getActivityList = (params) => {
  return request.post(`/activity/info/list`, params);
};
//获取活动信息详情
export const getActivityInfo = (id) => {
  return request.get(`/activity/info/${id}`);
};
