import { request } from 'kit';

// 获取自动化测试参数
export const getParams = (params) => {
  return request.get('/atps/testCaseTask/frontendTask', params);
};
