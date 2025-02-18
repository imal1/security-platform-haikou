import { request } from 'kit';

/**
 * 获取登录密钥
 */
export const getLoginSecret = () => {
  return request.get('/auth/rsaEncryptKey');
};

/**
 * 加密登录账户
 */
export const encodeLogin = (params) => {
  return request.post('/auth/sysLogin', params);
};

/**
 * 获取登录权限
 */
export const loginAccess = () => {
  return request.get('/auth/loginAccessStatus');
};
