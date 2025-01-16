import { dealError, verifyCode } from "./util";

import axiosInstance from "./axios";
import { showErrorMessage } from "./message";

/**
 * 获取请求方法
 * @param {string} method 方法名称
 * @returns {any} 返回结果
 */
const getAxiosRequest = (method: string) => {
  const that = this;
  return <T = unknown>(url: any, params = undefined, config = {}) => {
    return new Promise((resolve, reject) => {
      let axiosParams = [url];

      // 用于在路由 pathname 改变的时候，取消请求，避免成功的回调函数执行
      const controller = new AbortController();

      if (globalThis["__axios_controller_list__"] === undefined) {
        globalThis["__axios_controller_list__"] = [];
      }
      globalThis["__axios_controller_list__"].push(controller);

      if (method === "get") {
        axiosParams.push({
          ...config,
          params,
          signal: controller.signal, // 添加信号
        });
      } else {
        if (params) axiosParams.push(params);
        if (config)
          axiosParams.push({
            ...config,
            signal: controller.signal, // 添加信号
          });
      }

      axiosInstance[method]
        .apply(that, axiosParams)
        .then((response: any) => {
          if (response.data && response.status) {
            response = response.data;
          }
          const { code, result, message: errorMessage } = response;
          if (verifyCode(code)) {
            resolve(result);
          } else {
            // 不在这里处理登录已过期提示错误，拦截器已经做了处理
            if (code !== "S209102") {
              showErrorMessage(errorMessage || "网络异常", {
                duration: 3000,
              });
            }
            reject(errorMessage);
            dealError(errorMessage);
          }
        })
        .catch((error: any) => {
          reject(error);
          if (error["code"] === "ERR_NETWORK") {
            showErrorMessage(error["message"] || "网络错误");
          }
          dealError(
            typeof error === "object"
              ? error.message
                ? error.message
                : error
              : error
          );
        });
    }) as Promise<T>;
  };
};

/**
 * 封装Request方法
 */
export default {
  get: getAxiosRequest("get"),
  post: getAxiosRequest("post"),
  put: getAxiosRequest("put"),
  delete: getAxiosRequest("delete"),
};

export const abortAllRequest = () => {
  if (globalThis["__axios_controller_list__"] !== undefined) {
    const controllerList = globalThis[
      "__axios_controller_list__"
    ] as AbortController[];
    controllerList.forEach((item) => {
      item.abort();
    });
    globalThis["__axios_controller_list__"] = [];
  }
};
