import Ajax from "./ajax";
import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";
import { Message } from "@arco-design/web-react";
import { createHashHistory } from "history";
import errorBgUrl from "@/assets/img/error-bg.svg";
import globalState from "../globalState";
import packageJson from "../../package.json";
import queryString from "query-string";
// import { downloadExcelTempApi } from "@/store/webapi";
// import { showErrorMessage } from "./message";
import { axios, request } from "../kit";

//@ts-ignore

export const customHistory = createHashHistory();

/**
 * 获取项目名称、版本号、描述
 */
const {
  name: microAppName,
  version: microAppVersion,
  description: microAppDesc,
} = packageJson;

/**
 * 获取项目标识（项目名称）
 */
export const projectIdentify = `${microAppName}`;

/**
 * 获取项目描述（项目描述）
 */
export const projectName = `${microAppDesc}`;

/**
 * 获取路由基础配置
 */
const routeBaseConfig = { routeBaseName: "" };

/**
 * 获取路由根路径地址
 * @param {any} defaultConfig 默认配置
 * @returns {string} 返回路由根路径地址
 */
export const getRouteBaseName = (defaultConfig?: any) => {
  try {
    let routeBaseName = "";
    let qiankunBaseName = "";
    if (defaultConfig && defaultConfig.hasOwnProperty("defaultName")) {
      routeBaseName = defaultConfig.defaultName;
      qiankunBaseName = defaultConfig.defaultName;
    }

    //如果是乾坤运行项目
    if (window["__POWERED_BY_QIANKUN__"]) {
      //获取基础路由地址（从全局状态中获取）
      const { currentApp } = globalState.get();
      if (currentApp) {
        qiankunBaseName = currentApp.webActiveRule;
      }

      const basePrefix =
        qiankunBaseName && qiankunBaseName.startsWith("/")
          ? "/micro-app"
          : "/micro-app/";
      routeBaseName = `${basePrefix}${qiankunBaseName || projectIdentify}`;
      routeBaseConfig.routeBaseName = routeBaseName;
    }

    return routeBaseName;
  } catch (error) {
    return "";
  }
};

/**
 * 获取当前项目的相对地址
 * @param {any} defaultConfig 默认配置
 * @returns {string} 返回当前项目的相对地址
 */
export const getProjectRelativePath = (defaultConfig?: any) => {
  try {
    const publicPathField = "microAppPublicPath";
    let relativePath = "./";
    // 如果传入的对象包含默认路径则使用传入的
    if (defaultConfig && defaultConfig.hasOwnProperty("defaultPath"))
      relativePath = defaultConfig.defaultPath;
    if (window["__POWERED_BY_QIANKUN__"]) {
      // 如果是乾坤子应用运行
      // 如果window路径对象还没初始化则先初始化
      if (!window[publicPathField]) window[publicPathField] = {};
      if (window[publicPathField][projectIdentify]) {
        // 如果找到了子项目路径 返回结果
        relativePath = window[publicPathField][projectIdentify];
      } else {
        // 如果是开发环境
        window[publicPathField][projectIdentify] =
          window["__INJECTED_PUBLIC_PATH_BY_QIANKUN__"];
        relativePath = window[publicPathField][projectIdentify];
      }
    }
    // 如果不是乾坤子应用运行 直接返回
    return relativePath;
  } catch (error) {
    return "./";
  }
};

/**
 * 处理异常
 * @param {string} error 错误信息
 * @returns
 */
export const dealError = (error) => {
  console.log(`error: ${error}`);
};

/**
 * 错误信息
 * @param {object} data 对象数据
 * @returns
 */
export const errorMessage = (data) => {
  return typeof data === "object"
    ? data.code && data.message && !verifyCode(data.code)
      ? `【${data.code}】${data.message}`
      : data.message
    : data;
};

/**
 * 全局配置注入window
 * @param {string} url 请求地址
 * @returns
 */
export const getConfig = async (url?) => {
  try {
    const data = await Ajax.get(
      url || `${getProjectRelativePath()}static/config/global.json`
    );
    //全局配置注入window
    window["globalConfig"] = data;
  } catch (error) {}
};

/**
 * 补上不存在的字段 并返回undefined
 * @param {object} obj 对象数据
 * @param {string} key 对象属性
 * @returns {any} 返回数据
 */
export const tryGet = (obj: object, key: string) => {
  return key.split(".").reduce(function (o, x) {
    return typeof o == "undefined" || o === null ? o : o[x];
  }, obj);
};

/**
 * 生成唯一guid
 * @returns {string}} 返回唯一guid
 */
export const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 数据深拷贝（暂不能拷贝函数）
 * @param {object} data 对象数据
 * @returns {object}} 返回数据
 */
export const deep = (data) => {
  try {
    if (typeof data === "object") {
      return Object.assign(JSON.parse(JSON.stringify(data)));
    } else {
      return JSON.parse(JSON.stringify(data));
    }
  } catch (error) {
    return data;
  }
};

/**
 * 对象深拷贝（暂不能拷贝函数）
 * @param {object} obj 对象数据
 * @returns {object}} 返回数据
 */
export const copy = (obj) => {
  try {
    let newObj = obj.constructor === Array ? [] : {};
    if (typeof obj !== "object") {
      return;
    }

    for (let i in obj) {
      newObj[i] = typeof obj[i] === "object" ? copy(obj[i]) : obj[i];
    }
    return newObj;
  } catch (error) {
    return obj;
  }
};

/**
 * 对象深拷贝（b的值复制给a，但是继承的属性不会被拷贝）
 * @param {object} a 被复制对象数据
 * @param {object} b 复制的对象数据
 * @returns {object} 返回新对象数据
 */
export const extend = (a, b) => {
  try {
    for (let key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  } catch (error) {
    return a;
  }
};

/**
 * 数组去重
 * @param {Array} arr 数组
 * @returns {Array} 返回去重后数组
 */
export const unique = (arr) => {
  try {
    let arr1 = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      if (!arr1.includes(arr[i])) {
        // 检索arr1中是否含有arr中的值
        arr1.push(arr[i]);
      }
    }
    return arr1;
  } catch (error) {
    return arr;
  }
};
/**
 * 对象数组去重
 * @param arr
 * @param key
 * @returns
 */
export const objectArrUnique = (arr, key) => {
  const uniqueArr = arr.reduce((acc, current) => {
    if (!acc.some((item) => item[key] === current[key])) {
      acc.push(current);
    }
    return acc;
  }, []);
  return uniqueArr;
};
/**
 * 两个数组对象取不同
 * @param {Array} arr1 数组1
 * @param {Array} arr2 数组2
 * @param {string} field 字段
 * @returns {Array} 返回取不同后数组
 */
export const getArrDiff = (arr1, arr2, field) => {
  try {
    let result = [];
    for (let i = 0; i < arr1.length; i++) {
      let obj = arr1[i];
      let value = obj[field];
      let isExist = false;
      for (let j = 0; j < arr2.length; j++) {
        let aj = arr2[j];
        let n = aj[field];
        if (n === value) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        result.push(obj);
      }
    }
    return result;
  } catch (error) {
    return [];
  }
};

/**
 * 两个数组对象取相同
 * @param {Array} arr1 数组1
 * @param {Array} arr2 数组2
 * @param {string} field 字段
 * @returns {Array} 返回取相同后数组
 */
export const getArrEqual = (arr1, arr2, field) => {
  try {
    let result = [];
    for (let i = 0; i < arr1.length; i++) {
      let obj = arr1[i];
      let value = obj[field];
      let isExist = false;
      for (let j = 0; j < arr2.length; j++) {
        let aj = arr2[j];
        let n = aj[field];
        if (n === value) {
          isExist = true;
          break;
        }
      }
      if (isExist) {
        result.push(obj);
      }
    }
    return result;
  } catch (error) {
    return [];
  }
};

/**
 * CryptoJS加密
 * @param {string} word 字符串
 * @param {string} keyStr 密钥
 * @returns {string} 返回加密后数据
 */
export const encrypt = (word, keyStr) => {
  keyStr = keyStr || "uU_ud-a.fgUys@sL";
  let key = CryptoJS.enc.Utf8.parse(keyStr); // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

/**
 * CryptoJS解密
 * @param {string} word 字符串
 * @param {string} keyStr 密钥
 * @returns {string} 返回解密后数据
 */
export const decrypt = (word, keyStr) => {
  keyStr = keyStr || "uU_ud-a.fgUys@sL";
  let key = CryptoJS.enc.Utf8.parse(keyStr); // Latin1 w8m31+Yy/Nw6thPsMpO5fg==
  let decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};

/**
 * SHA256加密
 * @param {string} code 数据
 * @param {string} key 密钥
 * @returns {string} 返回加密后数据
 */
export const encodeWithSHA256 = (code: string, key?: string) => {
  const secret = key || "QtPxnSTvZBBXGftg87DQ";
  return CryptoJS.HmacSHA256(code, secret).toString();
};

/**
 * RSA加密
 * @param {string} code 数据
 * @param {string} publicKey 密钥
 * @returns {string} 返回加密后数据
 */
export const encodeWithRSA = (code, publicKey) => {
  const jsEncrypt = new JSEncrypt();
  jsEncrypt.setPublicKey(publicKey);
  return jsEncrypt.encrypt(code);
};

/**
 * AES加密
 * @param {string} code 数据
 * @param {string} key 密钥
 * @returns {string} 返回加密后数据
 */
export const encodeWithAES = (code: string, key?: string) => {
  return CryptoJS.AES.encrypt(code, key || projectIdentify).toString();
};

/**
 * AES解密
 * @param {string} code 数据
 * @param {string} key 密钥
 * @returns {string} 返回解密后数据
 */
export const decodeWithAES = (code: string, key?: string) => {
  const bytes = CryptoJS.AES.decrypt(code, key || projectIdentify);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

/**
 * 获取URL参数
 * @param {string} url 地址
 * @param {string} key 参数
 * @returns {string} 返回参数值
 */
export const getQueryString = (url, key) => {
  if (url && url.indexOf("?") > -1 && key) {
    const search = url.split("?")[1];
    const regExp = new RegExp(`(^|&)${key}=([^&]*)(&|$)`);
    const values = search.match(regExp);
    if (values != null) return decodeURIComponent(values[2]);
  }
  return null;
};

/**
 * 替换参数列表
 * @param {Array} params 参数列表
 * @param {boolean} create 不存在是否新增
 * @returns
 */
export const replaceQueryString = (
  params: Array<{
    key: string;
    value: string;
  }>,
  create: boolean = true
) => {
  try {
    if (!params || !tryGet(params, "length")) return;

    const hash = window.location.hash.split("#")[1];
    if (hash) {
      const search = hash.split("?")[1];
      let queryString = search ? search : "";

      //参数存在则进行替换
      const paramsList = search ? search.split("&") : [];
      if (!!paramsList && !!tryGet(paramsList, "length")) {
        paramsList.some((paramsStr) => {
          const filter = params.find(
            (e) => e && e.key === paramsStr.split("=")[0]
          );
          if (filter) {
            const reg = new RegExp(tryGet(filter, "key") + "=[^&]*", "gi");
            queryString = queryString.replace(
              reg,
              tryGet(filter, "key") + "=" + tryGet(filter, "value")
            );
          }
        });
      }

      if (create) {
        //若不存在则进行新增
        params.some((paramsStr) => {
          const { key, value } = paramsStr;
          const filter = paramsList.find((e) => e && e.split("=")[0] === key);
          if (!filter) {
            queryString += `${queryString ? "&" : ""}${key}=${value}`;
          }
        });
      }
      microAppHistory.replace(
        `${hash.split("?")[0]}${queryString ? "?" + queryString : ""}`
      );
    }
  } catch (error) {}
};

/**
 * 删除指定参数列表
 * @param {Array} params 参数列表
 * @returns
 */
export const removeQueryString = (params: Array<string>) => {
  try {
    if (!params || !tryGet(params, "length")) return;

    const hash = window.location.hash.split("#")[1];
    if (hash) {
      let queryString = "";
      const search = hash.split("?")[1];
      const paramsList = search ? search.split("&") : [];
      if (!!paramsList && !!tryGet(paramsList, "length")) {
        //动态移除参数列表
        paramsList.some((paramsStr) => {
          const [key, value] = paramsStr.split("=");
          const filter = params.find((e) => e === key);
          if (!filter) {
            queryString += `${key}=${value}&`;
          }
        });

        //最后一个字符为&则移除
        if (
          queryString &&
          queryString.substring(queryString.length - 1) === "&"
        ) {
          queryString = queryString.substring(0, queryString.length - 1);
        }
      }

      microAppHistory.replace(
        `${hash.split("?")[0]}${queryString ? "?" + queryString : ""}`
      );
    }
  } catch (error) {}
};

/**
 * 获取字符串长度（区别中英文）
 * @param {string} str 字符串
 * @returns {number} 返回字符串长度
 */
export const getLen = (str) => {
  try {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
        len += 2;
      } else {
        len++;
      }
    }
    return len;
  } catch (error) {
    return tryGet(str, "length");
  }
};

/**
 * 返回指定长度字符串
 * @param {string} str 字符串
 * @param {string} len 长度
 * @returns {string} 返回截取后字符串
 */
export const subStr = (str, len) => {
  try {
    let str_length = 0;
    let str_len = 0;
    let str_cut = "";
    str_len = str.length;
    for (let i = 0; i < str_len; i++) {
      let a = str.charAt(i);
      str_length++;
      if (escape(a).length > 4) {
        //中文字符的长度经编码之后大于4
        str_length++;
      }
      str_cut = str_cut.concat(a);
      if (str_length >= len) {
        str_cut = str_cut.concat("...");
        return str_cut;
      }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
      return str;
    }
  } catch (error) {
    return str;
  }
};

/**
 * 根据指定宽度截取字符串（会影响性能）
 * @param {string} str 字符串
 * @param {number} width 宽度
 * @param {string} fontsize 文字大小
 * @param {string} fontFamily 文字字体
 * @param {string} letterSpacing 文字间距
 * @returns {string} 返回截取后字符串
 */
export const getStrByWith = (
  str,
  width,
  fontsize,
  fontFamily?,
  letterSpacing?
) => {
  try {
    let span = document.createElement("span");
    span.id = "cut";
    span.style.visibility = "hidden";
    span.style.fontSize = fontsize;
    span.style.fontFamily = fontFamily || "PingFangSC-Regular";
    span.style.letterSpacing = letterSpacing || "0";
    span.style.whiteSpace = "normal";
    document.body.appendChild(span);
    let boo = false;
    let temp = ""; // 存放截断字符串
    for (let j = 0; j < str.length; j++) {
      // str是目标字符串，
      temp += str[j];
      span.innerText = temp + "...";
      if (span.offsetWidth > width) {
        boo = true;
        temp = temp.replace(str[j], "");
        break;
      }
    }
    document.body.removeChild(span);
    if (boo) temp += "...";
    return temp;
  } catch (error) {
    return str;
  }
};
/**
 * 计算字符串在容器的高度
 * @param {*} el 字符串
 * @param {*} text 字符串
 * @param {*} fontSize 文本大小
 * @param {*} lineHeight 行高
 * @returns size
 */
export function getTextSize(el, text, fontSize, lineHeight = 28) {
  let dom = document.querySelector(el);
  if (!dom) return 0;
  let domWidth = dom.clientWidth;
  let span = document.createElement("div");
  let result: any = {};
  result.height = span.offsetWidth;
  span.style.visibility = "hidden";
  span.style.fontSize = fontSize + "px";
  span.style.width = domWidth + "px";
  span.style.lineHeight = lineHeight + "px";
  document.body.appendChild(span);
  if (typeof span.textContent != "undefined") {
    span.textContent = text;
  } else {
    span.innerText = text;
  }
  result.height = span.offsetHeight - result.height;
  span.parentNode.removeChild(span);
  return result.height;
}
/**
 * 判断在固定宽度的空间内文字是否需要省略
 * @param {string} text 目标字符串
 * @param {number} width 容器宽度
 * @param {string} fontFamily 文字字体
 * @param {number} fontSize 文字大小
 * @param {number} letterSpacing 文字间隔
 * @returns {boolean} 是否需要省略
 */
export const needEllipsis = (
  text,
  width,
  fontFamily = "PingFangSC-Regular",
  fontSize = 14,
  letterSpacing = 0
) => {
  let span = document.createElement("span");
  span.style.whiteSpace = "normal";
  span.style.visibility = "hidden";
  span.style.position = "absolute";
  span.style.top = "-9999px";
  span.style.left = "-9999px";
  span.style.fontSize = fontSize + "px";
  span.style.lineHeight = "28px";
  span.style.width = "auto";
  span.style.maxWidth = "none";
  span.style.display = "inline-block";
  span.style.fontFamily = fontFamily;
  span.style.letterSpacing = letterSpacing + "px";
  document.body.appendChild(span);
  span.textContent = text;
  let needEllipsis = span.offsetWidth > width;
  document.body.removeChild(span);
  return needEllipsis;
};

/**
 * 下载文件（url资源）
 * @param {string} url 请求地址
 * @param {string} name 文件名称
 * @param {string} ext 文件类型
 * @returns
 */
export const downLoadUrl = (url, name, ext?) => {
  try {
    let link = document.createElement("a");
    link.download = `${name}${ext && `.${ext}`}`;
    link.href = url;
    link.click();
    setTimeout(() => {
      link.remove();
    }, 100);
  } catch (error) {}
};

/**
 * 下载文件（数据内容）
 * @param {any} data 数据内容
 * @param {string} name 文件名称
 * @param {string} ext 文件地址
 * @param {string} type 数据类型
 * @returns
 */
export const downLoadFile = (data, name, ext?, type?) => {
  try {
    //数据内容转变成blob地址
    const blob = new Blob([data], type && { type });
    const objectUrl = window.URL.createObjectURL(blob);
    downLoadUrl(objectUrl, name, ext);
  } catch (error) {}
};
// 下载模板
export const downloadExcelTempApi = (url, opts) => {
  const { method = "get", fileType = "xlsx", params } = opts;
  const contentTypeObj = {
    xlsx: "application/vnd.ms-excel",
    zip: "application/zip",
    json: "application/json",
    pdf: "application/pdf",
  };
  if (method === "get") {
    return axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": contentTypeObj[fileType],
      },
    });
  } else {
    return axios.post(url, params, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": contentTypeObj[fileType],
      },
    });
  }
};
/**
 * 下载excel模板
 * @param url
 * @param opts
 */
export const downloadExcelTemp = async (
  url,
  opts: { method: string; params: any; fileName: string; fileType: string }
) => {
  const { fileName = "template", fileType = "xlsx" } = opts;
  const res = await downloadExcelTempApi(url, opts);
  const uint8Array = new Uint8Array(res);
  const blob = new Blob([uint8Array], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.${fileType}`; // 设置下载的文件名
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
/**
 * 下载文件（url请求）
 * @param {string} url 请求地址
 * @param {string} name 文件名称
 * @param {string} ext 文件类型
 * @returns
 */
export const downLoadRequest = (url, name, ext?) => {
  try {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";

      //token存在进行请求头处理
      const token = globalState.get("token");
      if (token) {
        xhr.setRequestHeader("jwt-token", token);
      }
      //token不存在并且是开发环境
      else if (
        !token &&
        process.env &&
        process.env.NODE_ENV === "development"
      ) {
        xhr.setRequestHeader(
          "User-Name",
          localStorage.getItem(`${projectIdentify}-name`) || "admin"
        );
        xhr.setRequestHeader(
          "Verified-Key",
          "92ccff426e7042a28f7c03fef286f8ff"
        );
      }

      //服务基础地址存在则添加请求头
      const baseUrl = globalState.get("baseUrl");
      if (baseUrl) {
        xhr.setRequestHeader("base-url", baseUrl);
      }

      //是否外网环境存在则添加请求头
      const gatewayProxy = globalState.get("gatewayProxy");
      if (
        JSON.stringify(gatewayProxy) === "true" ||
        JSON.stringify(gatewayProxy) === "false"
      ) {
        xhr.setRequestHeader("gateway-proxy", gatewayProxy);
      }

      //地图坐标系类型存在则添加请求头
      const coordinateType =
        globalState.get("coordinateType") ||
        localStorage.getItem(`${projectIdentify}-coordinateType`);
      if (coordinateType && !isNaN(coordinateType)) {
        xhr.setRequestHeader("coordinateType", coordinateType);
      }

      xhr.onload = () => {
        if (
          (xhr.readyState === 4 && xhr.status === 200) ||
          xhr.status === 304
        ) {
          const blob = xhr.response;
          const objectUrl = window.URL.createObjectURL(blob);
          downLoadUrl(objectUrl, name, ext);
          resolve({
            code: xhr.status,
            message: "下载成功",
          });
        } else {
          reject({
            code: xhr.status,
            result: "下载失败",
          });
        }
      };
      xhr.send();
    });
  } catch (error) {}
};

/**
 * 替换字符串
 * @param {string} s 源字符串
 * @param {string} n 目标字符串
 * @returns {string} 返回替换后字符串
 */
export const replaceFun = (s, n) => {
  var j = s.substring(s.indexOf(n), n.length);
  return s.replace(j, "");
};

/**
 * 获取base64图片
 * @param {object} file 文件
 * @returns
 */
export const getBase64 = (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {}
};

/**
 * 文件转成为字符串
 * @param {object} file 文件
 * @returns
 */
export const fileString = (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {}
};

/**
 * 将base64转换为file文件
 * @param {string} dataUrl 数据地址
 * @param {string} filename 文件名称
 * @returns {any} 返回文件
 */
export const dataURLtoFile = (dataUrl, filename) => {
  try {
    let arr = dataUrl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (error) {}
};

/**
 * 根据每行元素所占高度获取首屏加载的数量
 * @param {number} topHeight 除内容区域外高度
 * @param {number} singleHeight 单行所占高度
 * @param {number} rowCount 每行数量
 * @returns {string} 返回页码
 */
export const getPageSize = (topHeight, singleHeight, rowCount) => {
  try {
    //实际内容高度
    const height = document.documentElement.clientHeight - topHeight;

    //首屏多少行
    const number = Math.ceil(height / singleHeight);

    //首屏真实数量
    return number * parseInt(rowCount);
  } catch (error) {}
};

/**
 * 获取分页数据
 * @param {object} res 对象数据
 * @returns {any} 返回分页数据
 */
export const pageData = (res) => {
  if (!res) return;
  return {
    current: res.pageNo,
    pageSize: res.pageSize,
    total: res.total,
  };
};

/**
 * 动态引入link
 * @param {string} url 资源地址
 * @param {function} callback 回调事件
 * @returns
 */
export const loadLink = (url, callback) => {
  try {
    let link: any = document.createElement("link"),
      fn = callback || function () {};
    link.rel = "stylesheet";
    link.type = "text/css";
    //IE
    if (link.readyState) {
      link.onreadystatechange = function () {
        if (link.readyState === "loaded" || link.readyState === "complete") {
          link.onreadystatechange = null;
          fn();
        }
      };
    } else {
      //其他浏览器
      link.onload = function () {
        fn();
      };
    }
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  } catch (error) {}
};
export const delLink = (url) => {
  try {
    const link = document.querySelector(`link[href='${url}']`);
    link && link.remove();
  } catch (error) {}
};
/**
 * 动态引入script
 * @param {string} url 资源地址
 * @param {function} callback 回调事件
 * @returns
 */
export const loadJS = (url, callback, tag = "head") => {
  try {
    let script: any = document.createElement("script"),
      fn = callback || function () {};
    script.type = "text/javascript";
    //IE
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          fn();
        }
      };
    } else {
      //其他浏览器
      script.onload = function () {
        fn();
      };
    }
    script.src = url;
    document.getElementsByTagName(tag)[0].appendChild(script);
  } catch (error) {}
};
/**
 * 删除script标签
 * @param srcUrl
 */
export const delScriptTag = async (srcUrl) => {
  try {
    let script = document.querySelector(`script[src='${srcUrl}']`);
    script && script.remove();
  } catch (error) {}
};
/**
 * 获取图标中文
 * @param {string} str 图标名称
 * @returns {string} 返回图标中文
 */
export const getChinese = (str) => {
  try {
    let arr = str.split("-");
    if (arr && arr.length > 0) {
      return arr[0];
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
};

/**
 * 获取图标英文
 * @param {string} str 图标名称
 * @returns {string} 返回图标英文
 */
export const getEnglish = (str) => {
  try {
    let arr = str.split("-");
    if (arr && arr.length > 1) {
      return str.replace(`${arr[0]}-`, "");
    } else {
      return "";
    }
  } catch (error) {
    return "";
  }
};

/**
 * 输入字符验证
 * @param {string} rule 规则
 * @param {string} value 数据
 * @param {function} callback 回调函数
 * @returns
 */
export const inputValidator = (_rule, value, callback) => {
  try {
    if (value && !/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/g.test(value)) {
      callback("请输入中文、英文、数字或下划线组合！");
    }

    //必须总是返回一个callback，否则 validateFields 无法响应
    callback();
  } catch (error) {
    callback();
  }
};

/**
 * 图标中文字符验证
 * @param {string} value 数据
 * @returns {boolean} 返回验证结果
 */
export const chineseValidator = (value) => {
  try {
    if (value && !/^[\u4e00-\u9fa5a-zA-Z0-9、_（）]+$/g.test(value)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 图标英文字符验证
 * @param {string} value 数据
 * @returns {boolean} 返回验证结果
 */
export const englishValidator = (value) => {
  try {
    if (value && !/^[a-zA-Z0-9]+$/g.test(value)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 判断是否为纯色
 * @param {string} color 颜色值
 * @returns {boolean} 返回验证结果
 */
export const judgePurity = (color) => {
  try {
    return color === "rgb(255,255,255)" ? true : false;
  } catch (error) {
    return false;
  }
};

/**
 * 十六进制颜色添加前缀
 * @param {string} value 颜色值
 * @returns {boolean} 返回颜色值
 */
export const prefixHex = (value) => {
  if (!value) return value;

  let color = value;
  if (color.substring(0, 1) !== "#") {
    color = `#${color}`;
  }

  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  if (reg.test(color.toLowerCase())) {
    return color;
  }

  return value;
};

/**
 * 合并数组单元格
 * @param {Array} data 数组
 * @param {string} field 需要合并的字段
 * @returns {Array} 返回合并后数组
 */
export const formatDataSource = (data, field) => {
  if (!data) {
    return;
  }

  if (!field) {
    return data;
  }

  return data
    .reduce((result, item) => {
      //首先将name字段作为新数组result取出
      if (result.indexOf(item[field]) < 0) {
        result.push(item[field]);
      }
      return result;
    }, [])
    .reduce((result, value) => {
      //将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
      const children = data.filter((item) => item[field] === value);
      result = result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0, //将第一行数据添加rowSpan字段
        }))
      );
      return result;
    }, []);
};
/**
 * 格式化Json字符串 不转为json纯字符串
 * type 为true 格式化，为false 去除格式化
 */
export const checkJsonCode = (strJsonCode, type) => {
  if (!type) {
    return strJsonCode
      .replace(/\r\n/g, "")
      .replace(/\n/g, "")
      .replace(/"/g, "")
      .replace(/\s+/g, " ");
  }
  let res = "";
  try {
    for (let i = 0, j = 0, k = 0, ii, ele; i < strJsonCode.length; i++) {
      ele = strJsonCode.charAt(i);
      if (j % 2 === 0 && ele === "}") {
        // eslint-disable-next-line no-plusplus
        k--;
        for (ii = 0; ii < k; ii++) ele = `    ${ele}`;
        ele = `\n${ele}`;
      } else if (j % 2 === 0 && ele === "{") {
        ele += "\n";
        // eslint-disable-next-line no-plusplus
        k++;
        for (ii = 0; ii < k; ii++) ele += "    ";
      } else if (j % 2 === 0 && ele === ",") {
        ele += "\n";
        for (ii = 0; ii < k; ii++) ele += "    ";
        // eslint-disable-next-line no-plusplus
      } else if (ele === '"') j++;
      res += ele;
    }
  } catch (error) {
    res = strJsonCode;
  }
  return res;
};

/**
 * 格式化Json
 * @param {string} str JSON字符串
 * @param {boolean} compress 是否压缩为一行
 * @returns {any} 返回格式化Json
 */
export const formatJson = (str, compress = false) => {
  try {
    const jsonObject = JSON.parse(str);
    const indentationNum = compress ? 0 : 2; //缩进级别
    return JSON.stringify(jsonObject, null, indentationNum);
  } catch (error) {
    return str;
  }
};

/**
 * 格式化时间
 * @param {string} time 时间
 * @param {string} format 格式化：yyyy-MM-dd hh:mm:ss
 * @returns {string} 返回格式化后的时间
 */
export const formatDate = (time, format = "yyyy-MM-dd hh:mm:ss") => {
  let date = new Date(time);
  let o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return format;
};
// 将秒转换为时分秒格式的函数
export const formatSeconds = (seconds: number) => {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - hour * 3600) / 60);
  const second = seconds - hour * 3600 - minute * 60;
  return `${hour.toString().padStart(2, "0")}小时${minute
    .toString()
    .padStart(2, "0")}分钟${second.toString().padStart(2, "0")}秒`;
};
/**
 * 根据对象获取新的字段不为空的参数对象
 * @param {object} params 对象数据
 * @returns {object} 返回不为空的对象数据
 */
export const getExistFieldParams = (params) => {
  const paramsResult = {};
  Object.entries(params).forEach((fieldInfo) => {
    const [key, value] = fieldInfo;
    if (value !== "" && value !== undefined) paramsResult[key] = value;
  });
  return paramsResult;
};

/**
 * 设置路由地址
 */
export const microAppHistory = {
  push(url) {
    return customHistory.push(`${routeBaseConfig.routeBaseName}${url}`);
  },
  replace(url) {
    return customHistory.replace(`${routeBaseConfig.routeBaseName}${url}`);
  },
};

/**
 * 本地缓存（加密）
 */
export const localStorageEncryption = {
  getItem(key: string, isObject?: boolean) {
    const storageResult = localStorage.getItem(key);
    const result = storageResult
      ? decodeWithAES(localStorage.getItem(key))
      : isObject
      ? "{}"
      : "";
    return isObject ? JSON.parse(result) : result;
  },
  setItem(key: string, value: any, isObject?: boolean) {
    if (!value) return;
    const result = encodeWithAES(isObject ? JSON.stringify(value) : value);
    return localStorage.setItem(key, result);
  },
  removeItem(key: string) {
    return localStorage.removeItem(key);
  },
};
//获取baseUrl地址
export const getBaseUrl = () => {
  try {
    let baseUrl = window["globalConfig"]["BASE_URL"];
    if (
      baseUrl &&
      !baseUrl.includes("http://") &&
      !baseUrl.includes("https://")
    ) {
      if (baseUrl === "/") {
        baseUrl = window.location.origin;
      } else {
        baseUrl = window.location.origin + baseUrl;
      }
    }
    return baseUrl;
  } catch (error) {
    return "";
  }
};
//获取portalUrl地址
export const getPortalUrl = () => {
  try {
    const portalUrl = globalState.get("baseUrl");
    return portalUrl;
  } catch (error) {
    return "";
  }
};
//获取项目路由基本地址
export const getRouteUrl = () => {
  try {
    const href = window.location.href;
    return href.split("#")[0];
  } catch (error) {
    return "";
  }
};
/**
 * 获取服务基础URL
 * @param {string} serviceUrlSign 微服务网关标识
 * @returns {string} 返回服务基础URL
 */
export const getServerBaseUrl = (serviceUrlSign: string) => {
  try {
    const portalUrl = getPortalUrl();
    const serviceRoutes = globalState.get("serviceRoutes");
    if (serviceRoutes && serviceRoutes[serviceUrlSign]) {
      return `${portalUrl}/${serviceRoutes[serviceUrlSign]}`;
    }
    return `${portalUrl}/${serviceUrlSign}`;
  } catch (error) {
    return "";
  }
};

/**
 * 获取服务基础URL(不走网关时)
 * @param {string} serviceUrlSign 服务标识
 * @returns {string} 返回服务基础URL
 */
export const getServerBaseUrlNoPortal = (serviceUrlSign: string) => {
  const serviceRoutes = globalState.get(serviceUrlSign);
  return serviceRoutes;
};
/**
 * 改变路由参数（添加默认navigationCode）
 * @param {any} event 路由事件对象
 * @returns
 */
export const changeParams = (event: any) => {
  try {
    const { newURL } = event;
    const newHash = newURL.split("#")[1];

    //获取当前菜单信息
    const { currentMenu } = globalState.get();
    if (!currentMenu) return;

    //获取当前路由和参数
    const pathname = newHash.split("?")[0];
    const search = newHash.split("?")[1];
    const urlParams = queryString.parse(search);

    //navigationCode不存在则添加默认navigationCode
    if (!tryGet(urlParams, "navigationCode")) {
      let menuInfo = null;
      if (pathname.startsWith(currentMenu.redirectUrl)) {
        menuInfo = currentMenu;
      }
      if (!menuInfo) {
        const { children } = currentMenu;
        menuInfo =
          children &&
          children.filter((e) => pathname.startsWith(e.redirectUrl))[0];
      }

      if (menuInfo && tryGet(menuInfo, "navigationCode")) {
        const { navigationCode } = menuInfo;
        let params = `navigationCode=${navigationCode}`;
        if (search) {
          params = `${params}&${search}`;
        }
        microAppHistory.replace(`${pathname}?${params}`);
      }
    }
  } catch (error) {}
};

/**
 * 获取地图类型标识
 * @param {Array} solutionList 地图服务列表
 * @param {string|number} solutionId 地图服务ID
 * @returns {number} 返回地图类型标识
 */
export const getMapTypeFlag = (solutionList, solutionId) => {
  try {
    //定义初始地图类型标识
    let mapTypeFlag = -1;

    //地图服务ID转换为数字
    const iSolutionId =
      solutionId && !isNaN(solutionId) ? parseInt(solutionId) : solutionId;

    //优先从地图服务详情获取
    solutionList &&
      solutionList.forEach((item) => {
        item.solutions.forEach((child) => {
          if (
            child.mapTypeFlag &&
            child.solutionId &&
            !isNaN(child.solutionId) &&
            parseInt(child.solutionId) === iSolutionId
          ) {
            mapTypeFlag = child.mapTypeFlag;
          }
        });
      });

    //根据接口定义类型获取
    if (mapTypeFlag === -1) {
      if (iSolutionId < 20000) {
        //矢量地图
        mapTypeFlag = 0;
      } else if (iSolutionId > 20000 && iSolutionId < 30000) {
        //栅格地图
        mapTypeFlag = 1;
      } else if (iSolutionId > 30000 && iSolutionId < 40000) {
        //影像地图
        mapTypeFlag = 2;
      } else if (iSolutionId > 80000 && iSolutionId < 90000) {
        //矢栅地图
        mapTypeFlag = 3;
      } else if (iSolutionId > 40000 && iSolutionId < 50000) {
        //三方地图
        mapTypeFlag = 4;
      }
    }

    //返回地图类型标识
    return mapTypeFlag;
  } catch (error) {
    return -1;
  }
};

/**
 * 清除本地缓存（权限信息）
 * @returns
 */
export const clearPermissionInfo = () => {
  try {
    //移除权限的缓存信息
    const TOKEN_KEY: string = process.env.TOKEN_KEY || `${projectIdentify}-key`;
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {}
};

/**
 * 设置本地缓存（权限信息）
 * @param {string} token 用户密钥
 * @param {string} role 用户角色
 * @param {string} name 用户名称
 * @returns
 */
export const setPermissionInfo = (
  token: string,
  role: string,
  name: string
) => {
  try {
    //移除上次的缓存信息
    clearPermissionInfo();

    //设置最新的缓存信息
    const TOKEN_KEY: string = process.env.TOKEN_KEY || `${projectIdentify}-key`;
    localStorage.setItem(
      `${projectIdentify}-baseUrl`,
      window["globalConfig"] ? window["globalConfig"].BASE_URL : ""
    );
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(
      `${projectIdentify}-power`,
      encrypt(role, "uU_ud-a.fgUys@sL")
    );
    localStorage.setItem(`${projectIdentify}-name`, name);
    localStorage.setItem(`${projectIdentify}-version`, microAppVersion);
  } catch (error) {}
};

/**
 * 清空平台缓存信息
 * @returns
 */
export const clearPlatformStorage = () => {
  try {
    //清除本地缓存（权限信息）
    clearPermissionInfo();
    //清除平台其他缓存
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (
        (key.includes(projectIdentify) || key.includes("kgis:")) &&
        !key.includes("solutionId")
      ) {
        window.localStorage.removeItem(key);
      }
    }

    //清除全局globalState
    globalState.set({
      userInfo: null,
    });
  } catch (error) {}
};

/**
 * 自动跳转到登录页
 * @param {boolean} qiankun 乾坤运行
 * @returns
 */
export const redirectToLogin = (qiankun = false) => {
  try {
    //获取回调地址
    const redirectUrl = window.location.hash.replace("#", "");
    let userType = localStorage.getItem("userType");

    //清空平台缓存信息
    if (!qiankun) clearPlatformStorage();
    if (userType) {
      //跳转到登录页（优先全局）
      microAppHistory.push(
        `/login?backUrl=${redirectUrl?.replace(/\?backUrl.*$/, "")}`
      ); // 直接把重复的参数去掉，防止重复的url信息
    }
    // else if (userType === "rbac") {
    //   const returnUrl = encodeURIComponent(window.location.href);
    //   window.location.href = `${window.globalConfig["BASE_URL"]}/oauth2/authorizeUrl?returnUrl=${returnUrl}`;
    // }
    else {
      //跳转到登录页（优先全局）
      microAppHistory.push("/login");
    }
  } catch (error) {
    dealError(error);
  }
};
/**
 * 获取token
 * @returns {string} 返回用户密钥
 */
export const getToken = () => {
  const TOKEN_KEY: string = process.env.TOKEN_KEY || `${projectIdentify}-key`;
  const token = localStorage.getItem(TOKEN_KEY);
  return token;
};

/**
 * 获取用户角色
 * @returns {string} 返回用户角色
 */
export const getUserRole = () => {
  try {
    const userRole = decrypt(
      localStorage.getItem(`${projectIdentify}-power`),
      "uU_ud-a.fgUys@sL"
    );

    return userRole;
  } catch (error) {
    return "";
  }
};

/**
 * 验证是否是管理员角色
 * @param {string} userRole 用户角色
 * @returns {boolean} 返回验证结果
 */
export const verifyAdmin = (userRole?) => {
  try {
    const userInfo = globalState.get("userInfo");
    let { roleCode } = userInfo || {};
    if (userRole) {
      roleCode = userRole;
    }
    if (!roleCode) return false;

    if (
      roleCode.toUpperCase().includes("ADMIN") ||
      roleCode.toUpperCase().includes("SUPER_ADMIN")
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/**
 * 验证是否是普通员角色
 * @param {string} userRole 用户角色
 * @returns {boolean} 返回验证结果
 */
export const verifyGeneral = (userRole?) => {
  try {
    const realUserRole = userRole || getUserRole();
    if (!realUserRole) return false;

    if (realUserRole.toUpperCase().includes("GENERAL")) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/**
 * 验证服务是否成功返回
 * @param {string|number} code 服务编码
 * @returns {boolean} 返回验证结果
 */
export const verifyCode = (code: any) => {
  try {
    return code === "200" || code === 200 || code === "0" || code === 0;
  } catch (error) {
    return false;
  }
};

/**
 * 验证是否为有效的JSON字符串
 * @param {string} str JSON字符串
 * @returns {boolean} 返回验证结果
 */
export const verifyJSON = (str) => {
  if (typeof str == "string") {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
};
/**
 * 获取arco组件Descriptions的data数据
 * @param data 数据列表
 * @param keysList key值列表
 */
export const getDescriptionsData = (data, keysList) => {
  data.map((item) => {
    let row = keysList.map((child) => {
      return {
        ...child,
        value: item[child.key] || "-",
      };
    });
    item.descData = row;
  });
  return data;
};
/**
 * 替换图片地址
 * @param url
 * @param defaultUrl
 * @returns
 */
export const getImgUrl = (url, defaultUrl) => {
  if (url) {
    return window["globalConfig"]?.BASE_URL + url;
  } else {
    return defaultUrl;
  }
};
/**
 * 图片加载失败
 * @param e
 */
export const imgOnError = (e, defaultImgUrl?) => {
  // let errorUrl = require("@/assets/img/error-img.png");
  e.target.src = defaultImgUrl || errorBgUrl;
};
/**
 * 写入cookies
 * @param {string} c_name 名称
 * @param {string} value 值
 * @param {string} expireDays 天数
 * @returns
 */
export const setCookie = (c_name, value, expireDays) => {
  try {
    let exDate: any = new Date();
    exDate.setDate(exDate.getDate() + expireDays);
    document.cookie =
      c_name +
      "=" +
      value +
      (expireDays == null ? "" : ";expires=" + exDate.toGMTString());
  } catch (error) {}
};

/**
 * 读取cookies
 * @param {string} name 名称
 * @returns {any} 返回数据
 */
export const getCookie = (name) => {
  try {
    let arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return arr[2];
    else return null;
  } catch (error) {
    return null;
  }
};

/**
 * 删除cookies
 * @param {string} name 名称
 * @returns
 */
export const delCookie = (name) => {
  try {
    let exp: any = new Date();
    exp.setTime(exp.getTime() - 1);
    let cVal = getCookie(name);
    if (cVal != null)
      document.cookie = name + "=" + cVal + ";expires=" + exp.toGMTString();
  } catch (error) {}
};
/**
 * 复制到剪切板
 * @param {string} text 文字
 * @returns
 */
export const copyToClipboard = (text) => {
  try {
    if (document.hasFocus() && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  } catch (error) {}
};
/**
 * 判断对象是否有参数有值
 * @param obj
 * @returns
 */
export const hasValue = (obj: any): boolean => {
  for (const key in obj) {
    if (obj[key] || obj[key] === 0) {
      return true;
    }
  }
  return false;
};
/**
 * 根据文件大小动态显示为KB、MB、GB等单位
 * @param size
 * @returns
 */
export const formatFileSize = (size) => {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
};
/**
 * json文件转成为字符串
 * @param {object} file 文件
 * @returns
 */
export const fileJsonString = (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(formatJson(reader.result, true));
      reader.onerror = (error) => reject(error);
    });
  } catch (error) {}
};

// 展示登录过期提示
export const showLoginExpired = (message: string) => {
  const isLoginExpired = localStorage.getItem("isLoginExpired");
  Message.clear();
  if (isLoginExpired !== "true") {
    localStorage.setItem("isLoginExpired", "true");
    Message.error(message);
  }
};

// 地图添加雪碧图
export function addImageToMap(
  url: string,
  kmap: any,
  maxWidth = 30,
  maxHeight = 60
) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute("crossOrigin", "Anonymous");
    image.src = url;
    image.onload = function () {
      // 检查图像是否超过最大宽度
      if (image.width > maxWidth) {
        // 调整宽度并等比例调整高度
        image.width = maxWidth;
        image.height = (image.width / image.naturalWidth) * image.naturalHeight;
      }

      // 检查图像是否超过最大高度
      if (image.height > maxHeight) {
        // 调整高度并等比例调整宽度
        image.height = maxHeight;
        image.width = (image.height / image.naturalHeight) * image.naturalWidth;
      }
      const imageId = String(new Date().getTime());
      kmap.addImage({
        imageId,
        image,
        callback() {},
      });

      resolve(imageId);
    };

    image.onerror = function () {
      reject("Failed to load image");
    };
  });
}
/**
 * 判断数据类型
 * params data 判断的数据
 * 返回小写的数据类型如string、number、regexp、date
 */
export const getTypeof = (data) => {
  var s = Object.prototype.toString.call(data);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};
/**
 * 获取表格滚动高度
 * @param selector
 * @returns
 */
export const getTableScrollHeight = (selector) => {
  try {
    const dom = document.querySelector(selector);
    if (dom) {
      return dom.clientHeight - 136;
    } else {
      return null;
    }
  } catch (error) {}
};
/**
 * 写一个延时器
 * @param {number} ms 延时时间
 * @returns {Promise<void>} 返回一个 Promise
 */
export const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
/**
 * 计算表格y轴滚动高度
 * @param selector
 * @param subtractHeight
 * @returns
 */
export const getTableScrollYHeight = (selector, subtractHeight = 136) => {
  try {
    let dom = document.querySelector(selector);
    let height = dom ? dom.clientHeight - subtractHeight : 0;
    return height;
  } catch (error) {}
};
/**
 * 获取活动id
 * @returns
 */
export const getEventId = () => {
  const eventId = localStorage.getItem(`${projectIdentify}-eventId`) || "90";
  return eventId;
};
/**
 * 获取场所id
 * @returns
 */
export const getVenueId = () => {
  const venueId = localStorage.getItem(`${projectIdentify}-venueId`) || "61";
  return venueId;
};
// 方案列表
const planList = () => {
  const eventId = getEventId();
  const venueId = getVenueId();
  return request.get(`/plan/info/list/${eventId}/${venueId}`);
};
/**
 * 获取方案id
 * @returns
 */
export const getPlanId = async () => {
  try {
    const res: any = await planList();
    const enabledPlan = res.find((v) => v.enable === 1);
    return enabledPlan?.id;
  } catch (error) {}
};
/**
 * 获取要素类型名称
 * @param featureCode
 * @returns
 */
export const getFeatureName = (featureCode) => {
  const options = [
    {
      label: "区域",
      value: "AREA",
    },
    {
      label: "路线",
      value: "ROUTE",
    },
    {
      label: "责任区",
      value: "AOR",
    },
    {
      label: "墙",
      value: "WALL",
    },
    {
      label: "升降柱",
      value: "BOLLARD",
    },
    {
      label: "巡逻车",
      value: "PATROL_CAR",
    },
    {
      label: "拒马",
      value: "KNIFE_REST",
    },
    {
      label: "防冲撞",
      value: "ANTI_COLLISION",
    },
    {
      label: "出入口",
      value: "GATE",
    },
    {
      label: "安检站",
      value: "SECURITY_GATE",
    },
    {
      label: "消防栓",
      value: "FIRE_HYDRANT",
    },
    {
      label: "护栏",
      value: "GUARDRAIL",
    },
    {
      label: "安检机",
      value: "SECURITY_MACHINE",
    },
    {
      label: "车检站",
      value: "VEHICLE_INSPECTION_STATION",
    },
    {
      label: "闸机",
      value: "SUBWAY_GATE_MACHINE",
    },
    {
      label: "特警巡逻车",
      value: "SPECIAL_POLICE_PATROL_VEHICLE",
    },
    {
      label: "武警防冲撞车",
      value: "POLICE_FORCE_CRASH_PREVENTION",
    },
    {
      label: "标点",
      value: "PUNCTUATION",
    },
    {
      label: "文本",
      value: "TEXT",
    },
    {
      label: "休憩",
      value: "REST",
    },
    {
      label: "公厕",
      value: "TOILET",
    },
    {
      label: "停车场",
      value: "PARKING_LOT",
    },
    {
      label: "禁止停车",
      value: "NO_PARKING",
    },
    {
      label: "警务站",
      value: "POLICE_STATION",
    },
    {
      label: "驿站",
      value: "STATION",
    },
    {
      label: "路牌",
      value: "SIGNPOST",
    },
    {
      label: "防爆点",
      value: "EXPLOSION_PROOF_POINT",
    },
    {
      label: "消防点",
      value: "FIRE_PROTECTION_POINT",
    },
    {
      label: "无人机反制点",
      value: "UAV",
    },
    {
      label: "反恐防范点",
      value: "COUNTER_TERRORISM_PREVENTION",
    },
    {
      label: "特警执勤点",
      value: "SPECIAL_POLICE_DUTY",
    },
    {
      label: "武警执勤点",
      value: "ARMED_POLICE_DUTY",
    },
    {
      label: "治安处置点",
      value: "SECURITY_DISPOSAL",
    },
  ];
  const index = options.findIndex((item) => item.value === featureCode);
  if (index > -1) {
    return options[index].label;
  }
};
/**
 * 处理要素树数据
 * @param obj
 */
export const getFeatureTreeData = (obj) => {
  const list = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const item = obj[key];
      const children = item.map((row) => {
        return {
          ...row,
          parentId: key,
          type: "feature",
        };
      });
      let featureType = "";
      if (["AREA", "ROUTE", "AOR", "WALL"].includes(key)) {
        featureType = "SITE_DRAWING";
      }
      const featureName = getFeatureName(key);
      const child = {
        id: key,
        featureName,
        featureCode: key,
        featureType,
        parentId: -1,
        children,
        type: "classify",
      };
      list.push(child);
    }
  }
  return list;
};
/**
 * 获取设备类型
 * @param data
 * @returns
 */
export const getDeviceType = (data) => {
  if (data.deviceType === "IPC") {
    const cameraForm = tryGet(data, "deviceAttr.ipc.cameraForm");
    const deviceType = ["1", "2"].includes(cameraForm) ? "IPC_1" : "IPC_3";
    return deviceType;
  } else {
    return data.deviceType;
  }
};
