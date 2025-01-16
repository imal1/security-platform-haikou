/**
 * 封装正则表达式
 */
export default {
  numberNotStartWithZero: /^[1-9]\d*$/, // 非零开头的整数
  natureNumber: /^([1-9]\d*|0)$/, // 自然数
  startWidthLetterOrChinese: /^[\u4e00-\u9fa5a-zA-Z]/, // 以中文或字母开头
  letterOrChinese: /^[\u4e00-\u9fa5a-zA-Z]*$/, // 中文或字母
  letterOrChineseAndNotStartWithNumber:
    /^[\u4e00-\u9fa5a-zA-Z]+[\u4e00-\u9fa5a-zA-Z0-9]*$/, // 中文或字母或数字，但不能以数字开头
  letterChineseNumber: /^[\u4e00-\u9fa5a-zA-Z0-9]*$/, // 中文或字母或数字
  LetterNumberUnderline: /^[a-zA-Z0-9\_]*$/, // 数字字母下划线
  LetterNumberUnderlineAndStartWithLetter: /^[a-zA-Z]+[a-zA-Z0-9\_]$/, // 数字字母下划线且只能以字母开头
  lngFormat:
    /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
  latFormat: /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/,
  smallLetterStart: /^[a-z]+[a-z0-9_]*$/, //请输入小写英文字母开头，包含英文或数字或“_"即可
  positiveTwoDecimal: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{2})?$/, //支持两位小数的正数
  number: /^[\d.]+$/, //数字
  LetterNumberUnderlineOrChinese: /^[\u4e00-\u9fa5a-zA-Z0-9\_.]*$/, //中文字母下划线
  passwordReg:
    /^(?!\d+$)(?![a-zA-Z]+$)(?![\s~!@#$%^&*?+=\-()\[\]{}<>.,]+$)(?!.*\s)[\w~!@#$%^&*?+=\-()\[\]{}<>.,]{8,18}$/, //至少包括字母数字特殊字符中任意2种的正则表达式长度8-18不能存在空字符
  httpUrl: /^((https|http)?:\/\/)[^\s]+/, //http or https
  lngLatStringRegex:
    /^(-?(?:1[0-7]\d(\.\d+)?|180(\.0+)?|\d{1,2}(\.\d+)?)),\s*(-?(?:[0-8]?\d(\.\d+)?|90(\.0+)?|\d{1,2}(\.\d+)?))$/, //经纬度字符串
  colorRegex: /^(#(?:[0-9a-fA-F]{3,4}){1,2}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))$/, //颜色表达式
  longitudeRegex: /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/, // 经度范围：-180~180（保留小数点后十五位）
  latitudeRegex: /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/, // 纬度范围：-90~90（保留小数点后十五位）
};
