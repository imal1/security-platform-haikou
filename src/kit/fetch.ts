import axiosInstance from './axios';

/**
 * 封装Fetch请求
 *
 * @export
 * @class Fetch
 */
export default class Fetch {
  /**
   * POST请求
   *
   * @static
   * @param {any} params 请求参数
   * @param {object} [config] 请求配置
   * @returns {any} 返回结果
   * @memberof Fetch
   */
  static post(params: any, config?: object): any {
    return new Promise((resolve) => {
      axiosInstance
        .post(params, config)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          resolve(err);
        });
    });
  }

  /**
   * GET请求
   *
   * @static
   * @param {any} params 请求参数
   * @param {object} [config] 请求配置
   * @returns {any} 返回结果
   * @memberof Fetch
   */
  static get(params: any, config?: object): any {
    return new Promise((resolve) => {
      axiosInstance
        .get(params, config)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          resolve(err);
        });
    });
  }

  /**
   * DELETE请求
   *
   * @static
   * @param {any} params 请求参数
   * @param {object} [config] 请求配置
   * @returns {any} 返回结果
   * @memberof Fetch
   */
  static delete(params: any, config?: object): any {
    return new Promise((resolve) => {
      axiosInstance
        .delete(params, config)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          resolve(err);
        });
    });
  }

  /**
   * PUT请求
   *
   * @static
   * @param {any} params 请求参数
   * @param {object} [config] 请求配置
   * @returns {any} 返回结果
   * @memberof Fetch
   */
  static put(params: any, config?: object): any {
    return new Promise((resolve) => {
      axiosInstance
        .put(params, config)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err: any) => {
          resolve(err);
        });
    });
  }
}
