import { request } from 'kit';

// 获取自动化测试参数
export const getParams = (params) => {
  return request.get('/atps/testCaseTask/frontendTask', params);
};
//获取活动列表
export const getActivityList = (params) => {
  return request.post(`/activity/info/list`, params);
};
//获取活动类型
export const getActivityTypes = () => {
  return request.get(`/activity/info/types`);
};