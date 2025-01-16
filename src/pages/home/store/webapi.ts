import { request, getServerBaseUrl } from "@/kit";

// 获取自动化测试参数
export const getParams = (params) => {
  return request.get("/atps/testCaseTask/frontendTask", params);
};
// 物防数据统计
export const getPhysicalDefenseDataStatistics = (eventId, venueId) => {
  return request.get(
    `/displayScreen/physicalDefenseDataStatistics/${eventId}/${venueId}`
  );
};
// 设备统计
export const getDeviceDataStatistics = (eventId, venueId) => {
  return request.get(
    `/displayScreen/deviceDataStatistics/${eventId}/${venueId}`
  );
};
// 获取固有资源要素信息列表-树
export const getInherentTree = (venueId) => {
  return request.get(`/feature/inherent/tree/${venueId}`);
};
// 获取固有资源要素信息列表-树 带设备
export const getInherentTreeWithDevices = (venueId,params?) => {
  return request.get(`/feature/inherent/treeWithDevices/${venueId}`,params);
};
// 获取临时资源要素信息列表-树
export const getTemporaryTree = (planId) => {
  return request.get(`/feature/temporary/tree/${planId}`);
};
// 获取固有资源要素信息列表-树 带设备
export const getTemporaryTreeWithDevices = (planId,params?) => {
  return request.get(`/feature/temporary/treeWithDevices/${planId}`,params);
};
//获取警力部署
export const getWorkGroup = (planId,params) => {
  return request.get(`/device/departmentTreeByWorkGroups/${planId}`,params);
};
// 获取设备类型列表
export const getDeviceTypes = () => {
  return request.get(`/device/types`);
};
// 获取行车路线
export const getLeadershipRoute = (id) => {
  return request.get(`/feature/temporary/leadershipRoute?id=${id}`);
};

// 获取固有行车路线
export const getInherentLeadershipRoute = (id) => {
  return request.get(`/feature/inherent/leadershipRoute?id=${id}`);
};
// 获取行车路线设备
export const getDeviceRoute = (params) => {
  return request.get(`/feature/temporary/deviceRoute`, params);
};
// 获取行车路线设备
export const getInherentDeviceRoute = (params) => {
  return request.get(`/feature/inherent/deviceRoute`, params);
};

// 获取设备
export const deviceRoute4Menu = (params) => {
  return request.get(`/feature/temporary/deviceRoute4Menu`, params);
};
const featureCode = {
  featureCode: "WALL",
};

// 获取核心圈数据
export const coreDetail = (venueId, planId) => {
  return request.get(`/device/coreDetail/${planId}/${venueId}`, featureCode);
};

// 获取核心圈弹窗详情
export const frameDetail = (venueId, planId) => {
  return request.get(`/popFrame/style/detail/${venueId}/${planId}`);
};

// 获取核心圈设备
export const deviceNumById = (venueId, planId) => {
  return request.get(`/popFrame/style/deviceNumById/${venueId}/${planId}`);
};
// 获取临时资源要素信息详情
export const getTemporaryFeatureDetail = (id) => {
  return request.get(`feature/temporary/detail/${id}`);
};
// 获取固有资源要素信息详情
export const getInherentFeatureDetail = (id) => {
  return request.get(`/feature/inherent/detail/${id}`);
};

// 列出活动
export const deviceActivity = (eventId) => {
  return request.get(`/device/activity/${eventId}`);
};
// 一级菜单接口
export const getFirstMenu = () => {
  return request.get(`/feature/inherent/firstMenu`);
};
// 二级菜单接口
export const getSecondMenu = (type, planId) => {
  return request.get(`/device/secondMenu/${type}/${planId}`);
};
// 列出活动
export const workGroupStatics = (eventId) => {
  return request.get(`/device/workGroupStatics/${eventId}`);
};
//三级页面
export const getThreePage = (params) => {
  return request.post(`/device/threePage`, params);
};
//责任单位
export const getRelationResponsibilityArea = (params) => {
  return request.post(`/device/relationResponsibilityArea`, params);
};
// 根据组ID查询工作组
export const wordGroupByGroupId = (params) => {
  return request.get(`/device/wordGroupByGroupId`, params);
};
// 获取头像
export const userInfoExtend = (params) => {
  return request.get(`/device/userInfoExtend`, params);
};
// 获取头像
export const userProfile = (params) => {
  return request.get(`/device/userProfile`, params);
};
// 根据设备分组类型查询用户组树
export const getDeviceGroup = (params) => {
  return request.get(`/tyResourceAuth/user/deviceGroup/cdevice`, params);
};
// 根据设备分组Id查询展示所属设备
export const getdeviceGroupList = (params, groupId) => {
  return request.get(
    `tyResourceAuth/user/deviceGroup/device/${groupId}`,
    params
  );
};
// 根据指定字段统计设备数据
export const getDeviceStatistical = (params) => {
  return request.get(`/tyResourceAuth/user/device/dynamic/statistical`, params);
};
// 根据指定字段统计各分组设备数据
export const getDevicesStatistical = (params) => {
  return request.get(
    `/tyResourceAuth/user/deviceGroup/cdevice/dynamic/statistical`,
    params
  );
};