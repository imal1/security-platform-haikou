import { request } from 'kit';

/**
 * 获取场景列表
 */
export const getSceneList = () => {
  return request.get('/scene/info/list');
};