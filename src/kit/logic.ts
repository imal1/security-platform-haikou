import { Form, Input, InputProps, PaginationProps } from "@arco-design/web-react";
import { format } from 'date-fns'
import { isString } from "lodash";
import { CSSProperties } from "react";

// import { CustomInput, CustomInputNumber } from "../pages/account/component/common/CustomInput";
import { TKArcoTableColumnType } from "./types"

export const getRandomString = (length = 12) => {


  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = chars.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export const asyncSleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 给空字符串或者undefined返回默认值，默认是短横线
 * @param str origin string or number
 * @param backup default is '-'
 * @returns string
 */
export const replaceEmptyValueToDefaultString = <T = string | number>(str?: string | number, backup: string = '-') => (str === 0 ? str : (str || backup)) as T

export const getRandom4NumberString = () => {
  try {
    let number1 = Math.round(Math.random() * 8 + 1);
    let number2 = Math.round(Math.random() * 8 + 1);
    let number3 = Math.round(Math.random() * 8 + 1);
    let number4 = Math.round(Math.random() * 8 + 1);
    return String(number1) + String(number2) + String(number3) + String(number4);
  } catch (error) { }
};

// 给空字符串或者undefined加上默认值
export const coverEmptyStringOrFalsyToTarget = (str: string | undefined | null, target: any) => {
  if (!str || str.length === 0) {
    return target
  }
  return str
}

// 最多展示12个字符，超过的部分用...代替
export const getShortString = (str: string, length = 12) => {
  if (str.length > length) {
    return str.slice(0, length) + '...'
  }
  return str
}

export const getTitleWhenStringIsTooLong = (str: string, length = 12) => {
  if (str.length > length) {
    return str
  }
  return undefined
}

// JSON 格式校验
export const isValidJSONString = (str: string) => {
  if (typeof str !== 'string') return false

  try {
    var obj = JSON.parse(str);
    if (typeof obj == 'object' && obj) {
      return true;
    }
    return false;
  } catch (error) {
    return false
  }
}

// 通用的 arco 组件配置
export const arcoInputConfig = {
  allowClear: true,
  autoComplete: 'off',
} as InputProps

// 默认的分页查询配置
export const defaultPaginationConfig = {
  pageNo: 1,
  pageSize: 20
}

// 通用的 arco 表格分页配置
export const getArcoTablePaginationConfig = (params: { pageSize: number }) => {
  return {
    hideOnSinglePage: params.pageSize === 20,
    defaultPageSize: 20,
    showJumper: true,
    showTotal: true,
    pageSizeChangeResetCurrent: true,
    sizeCanChange: true,
  } as PaginationProps
}
// 通用的 arco 组件
export const SearchInput = Input.Search
export const FormItem = Form.Item
export const InputTextArea = Input.TextArea

// 获取表单实例
export const initFormInstance = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const instance = Form.useForm()[0]
  return ({
    instance,
    Form,
    FormItem,
    // CustomInput,
    // CustomInputNumber,
    InputTextArea
  })
}

export type TTimestampType = 1 | 2 | 3

// 根据传入的参数，获取时间戳对象
/**
 * Returns an object with start and end date strings based on the given timestamp type.
 * @param type - The timestamp type. 1 for last week, 2 for last month, 3 for last year.
 * @returns An object with start and end date strings in the format 'yyyy-MM-dd HH:mm:ss'.
 * @throws An error if the type parameter is invalid.
 */
export const getTimestampObject = (type: TTimestampType) => {
  const obj = {
    startDate: '',
    endDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  }
  if (type === 1) {
    // 近一周
    obj.startDate = format(new Date().getTime() - 7 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd HH:mm:ss')
  } else if (type === 2) {
    // 近一月
    obj.startDate = format(new Date().getTime() - 30 * 24 * 60 * 60 * 1000, 'yyyy-MM-dd HH:mm:ss')
  } else if (type === 3) {
    // 近一年
    obj.startDate = format(new Date().getTime() - 365 * 24 * 60 * 60 * 1000 / 2, 'yyyy-MM-dd HH:mm:ss')
  } else {
    throw new Error('getTimestampObject: type 参数错误')
  }
  return obj
}
export const generateTableColumnsFromTwoDimensionalArray = <T>(arr: [string, string, Partial<TKArcoTableColumnType<T>>?][]) => {
  return arr.map(([dataIndex, title, config = {}]) => {
    return {
      dataIndex,
      title,
      fieldName: dataIndex, // 给封装的 KArcoTable
      key: dataIndex,
      render: (value: any) => replaceEmptyValueToDefaultString(value), // 默认的空字符串、falsy值显示“-”
      // @ts-ignore
      ...config,
    };
  });
}

export const calcDeviceType = () => {
  const windowWidth = window.innerWidth
  if (windowWidth <= 1440) {
    return 'small'
  } else if (windowWidth <= 1920) {
    return 'middle'
  } else {
    return 'large'
  }
}

/**
 * 简单的生成自定义 css 样式属性的方法
 * @param key string
 * @param value string
 * @returns custom css attr object
 */
export const generateCustomCSSAttr = (obj: Record<string, string>) => {
  const result: any = {}
  for (const key in obj) {
    result[`${key}`] = obj[key]
  }
  return result as CSSProperties
}

export const repeatArrayItem = <T>(arr: T[], times: number) => {
  const result = []
  for (let i = 0; i < times; i++) {
    result.push(...arr)
  }
  return result
}

export const isEmptyString = (str: any) => typeof str === 'string' && str.length === 0

// 转化超大数字为带单位的字符串
export const convertLargeNumberToString = (num: number) => {
  if (num < 10000) {
    return num.toString()
  } else if (num < 10000 * 10000) {
    return `${(num / 10000).toFixed(2)?.replace(/\.00$/, '')}万`
  } else {
    return `${(num / 10000 / 10000).toFixed(2)?.replace(/\.00$/, '')}亿`
  }
}


// 经纬度检查，为空则返回 - ，否则保持六位小数
export const checkLatOrLng = (str?: string) => {
  try {
    console.log(str)
    if (str === undefined || str === '' || str === null) {
      return '-'
    }
    return Number(str).toFixed(6)
  } catch (error) {
    console.log('经纬度转换失败:', error, str)
    return '-'
  }
}