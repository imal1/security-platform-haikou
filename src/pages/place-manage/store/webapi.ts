import { getServerBaseUrl, request } from "@/kit";
import { getEventId, getVenueId } from "../../../kit/util";
import { planData } from "../../../mockData";
import { childrenMergeDevices } from "../component/FloatLeft/utils";

// 添加弹出框信息
export const addFrame = (params) => {
  return request.post("/popFrame/style/add", params);
};

// 方案列表
export const planList = () => {
  const eventId = getEventId();
  const venueId = getVenueId();
  return request
    .get(`/plan/info/list/${eventId}/${venueId}`)
    .catch(() => planData);
};

// 新增方案
export const addPlan = (params) => {
  return request.post("/plan/info/add", params);
};

// 编辑方案
export const updatePlan = (params) => {
  return request.post("/plan/info/update", params);
};

// 删除方案
export const deletePlan = (params) => {
  return request.delete(`/plan/info/delete/${params}`);
};

// 复制方案
export const copyPlan = (params) => {
  return request.post(`/plan/info/copy`, params);
};

// 方案详情
export const planDetail = (params) => {
  return request.get(`/plan/info/detail/${params}`);
};

// 方案启停
export const planStart = (params) => {
  return request.post("/plan/info/planStart", params);
};

// 查询要素库
export const featureList = () => {
  return request.get("/feature/library/list");
  // .catch(() => featureData);
};

// 固有资源的元素和设备统计
export const statistics = () => {
  const eventId = getEventId();
  const venueId = getVenueId();
  return request.get(`/plan/info/statistics/feature/${venueId}`);
};

// 包含固有资源和临时资源的元素和设备统计
export const temporaryStatistics = (planId) => {
  const eventId = getEventId();
  const venueId = getVenueId();
  return request.get(
    `/plan/info/temporaryStatistics/feature/${planId}/${venueId}`,
  );
  // .catch(() => guyouLinshi);
};

// 获取固有资源要素信息列表-树
export const inherentTree = (venueId) => {
  return request.get(`/feature/inherent/tree/${venueId}`);
  // .catch(() => inherentTreeData);
};

// 获取临时资源要素信息列表-树
export const temporaryTree = (planId) => {
  return request.get(`/feature/temporary/tree/${planId}`);
  // .then(() => temporaryTreeData);
  // .catch(() => temporaryTreeData);
};

// 获取固有资源要素信息列表-树 带设备
export const inherentTreeDevices = (params) => {
  const eventId = getEventId();
  const venueId = getVenueId();
  return request
    .get(`/feature/inherent/treeWithDevices/${venueId}`, params)
    .then((res) => childrenMergeDevices(res));
  // .catch(() => childrenMergeDevices(jfData));
};

// 获取临时资源要素信息列表-树 带设备
export const temporaryTreeDevices = ({ planId, ...params }) => {
  return request
    .get(`/feature/temporary/treeWithDevices/${planId}`, params)
    .then((res) => childrenMergeDevices(res, "temporary"));
  // .catch(() => childrenMergeDevices(jfData));
};

// 新增固有资源要素信息
export const inherentAdd = (params) => {
  return request.post("/feature/inherent/add", params);
};

// 新增临时资源要素信息
export const temporaryAdd = (params) => {
  return request.post("/feature/temporary/add", params);
};

// 删除临时资源要素
export const temporaryDelete = (params) => {
  return request.delete(`/feature/temporary/delete/${params}`);
};
// 获取设备类型列表
export const getDeviceTypes = () => {
  return request.get(`/device/types`);
};
// 查询所有标签列表
export const getTagList = (params) => {
  return request.post(`/tyResourceAuth/tag/list`, params);
};
// 新增固有资源要素信息
export const addInherentFeature = (params) => {
  return request.post(`/feature/inherent/add`, params);
};
// 更新固有资源要素信息
export const updateInherentFeature = (params) => {
  return request.post(`/feature/inherent/update`, params);
};
// 获取固有资源要素信息详情
export const getInherentFeatureDetail = (id) => {
  return request.get(`/feature/inherent/detail/${id}`);
};
// 新增临时资源要素信息
export const addTemporaryFeature = (params) => {
  return request.post(`feature/temporary/add`, params);
};
// 获取临时资源要素信息详情
export const getTemporaryFeatureDetail = (id) => {
  return request.get(`feature/temporary/detail/${id}`);
};
// 更新临时资源要素信息
export const updateTemporaryFeature = (params) => {
  return request.post(`/feature/temporary/update`, params);
};

// 更新临时资源位置信息
export const updateIconPosition = (params) => {
  return request.post(`/feature/temporary/updateIconPosition`, params);
};

//获取部门树(责任单位)
export const getRbacDepartmentTree = () => {
  return request.get(`/rbac/department/tree`);
};
// 根据指定字段统计设备数据
export const getDeviceStatistical = (params) => {
  return request.get(`/tyResourceAuth/user/device/dynamic/statistical`, params);
};
// 根据指定字段统计各分组设备数据
export const getDevicesStatistical = (params) => {
  return request.get(
    `/tyResourceAuth/user/deviceGroup/cdevice/dynamic/statistical`,
    params,
  );
};

// 全量设备
export const getDeviceAll = (params) => {
  return request.get(`/tyResourceAuth/user/deviceGroup/device/all`, params);
};

export const getAllDevice = (params) => {
  return request.post(`/device/deviceAll`, params);
};

// 根据设备分组类型查询用户组树
export const getDeviceGroup = (params) => {
  return request.get(`/tyResourceAuth/user/deviceGroup/cdevice`, params);
};
// 根据设备分组Id查询展示所属设备
export const getdeviceGroupList = (params, groupId) => {
  return request.get(
    `tyResourceAuth/user/deviceGroup/device/${groupId}`,
    params,
  );
};

// 下载模板

export const downloadTemplate = () => {
  return request.get(`/device/downloadTemplate`);
};

// 纠偏
export const updateLocation = (baseUrl, params) => {
  return request.post(`${baseUrl}/dt/device/updateLocation`, params);
};

// 更新设备楼层信息
export const updateDeviceBuildingInfo = (baseUrl, params) => {
  return request.post(`${baseUrl}/storage/batchStore`, params);
};

//工作组
export const getWorkGroupList = (eventId) => {
  return request.get(
    `/device/workGroupList/${eventId == "eventId" ? 90 : eventId}`,
  );
};
// 临时资源的排序
export const reSequence = (params) => {
  return request.put(`/feature/temporary/reSequence`, params);
};
//图层业务数据查询
export const getLayerBusinessQuery = (params) => {
  const CTSearchServer = getServerBaseUrl("CTSearchServer");
  return request.post(`${CTSearchServer}/back/layer/query`, params);
};
