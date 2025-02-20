import { request } from 'kit';

export interface ISceneInfo {
  /**
   * 场景ID
   *
   * @type {string}
   * @memberof SceneInfo
   */
  id?: string;
  /**
   * 场景名称
   * 
   * @type {string}
   * @memberof SceneInfo
   */
  sceneName: string;
  /**
   * 场景类型
   * 
   * @type {string}
   * @memberof SceneInfo
   */
  sceneType: string;
  /**
   * 场景服务编码
   * 
   * @type {string}
   * @memberof SceneInfo
   */
  sceneServiceCode: string;
  /**
   * 场景服务名称
   * 
   * @type {string}
   * @memberof SceneInfo
   */
  sceneServiceName: string;
  /**
   * 场景中心点
   *
   * @type {string}
   * @memberof SceneInfo
   */
  sceneCenter: string;
  /**
   * 行政区域ID
   *
   * @type {string}
   * @memberof SceneInfo
   */
  regionId: string;
  /**
   * 行政区域名称
   *
   * @type {string}
   * @memberof SceneInfo
   */
  regionName: string;
  /**
   * 场景面积
   *
   * @type {number}
   * @memberof SceneInfo
   */
  sceneArea?: number;
  /**
   * 场景图片文件
   *
   * @type {File}
   * @memberof SceneInfo
   */
  thumbnailFile?: File;
  /**
   * 场景图片
   *
   * @type {string}
   * @memberof SceneInfo
   */
  sceneThumbnail?: string;
  /**
   * 场景说明
   *
   * @type {string}
   * @memberof SceneInfo
   */
  remark?: string;
}

/**
 * 获取场景列表
 */
export const getSceneList = () => {
  return request.get('/scene/info/list');
};

/**
 * 获取场景服务列表
 */
export const getSceneServiceList = (params: { ueUserName: string, ueUserRole: string }) => {
  return request.get('/scene/info/sceneServiceList', params);
}

/**
 * 获取场景类型
 */
export const getSceneTypes = () => {
  return request.get('/scene/info/types');
}

/**
 * 获取场景信息详情
 */
export const getSceneInfo = (sceneInfoId: string) => {
  return request.get(`/scene/info/${sceneInfoId}`);
}

/**
 * 新增场景
 */
export const addScene = (data: ISceneInfo) => {
  return request.post('/scene/info/add', data);
}

/**
 * 编辑场景
 */
export const editScene = (data: ISceneInfo) => {
  return request.put('/scene/info/update', data);
}

/**
 * 删除场景
 */
export const deleteScene = (sceneInfoId: string) => {
  return request.delete(`/scene/info/${sceneInfoId}`);
}