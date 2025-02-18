import { request,getServerBaseUrl } from 'kit';

// 获取自动化测试参数
export const getParams = (params) => {
  return request.get('/atps/testCaseTask/frontendTask', params);
};
// 获取行政区划及下属信息
export const getRegionAndChildren = (params) => {
  const CTSearchServer = getServerBaseUrl("CTSearchServer");
  return request.post(`${CTSearchServer}/region/getRegionAndChildren`, params);
};