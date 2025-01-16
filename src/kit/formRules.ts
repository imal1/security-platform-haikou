import regExp from "./reg-exp";

export const formRules = {
  commonName: {
    match: regExp.LetterNumberUnderlineOrChinese,
    message: "只支持中英文、数字、下划线",
  },

  longitudeRule: {
    match: regExp.longitudeRegex,
    message: "经度范围：-180~180（保留小数点后十五位）"
  },

  latitudeRule: {
    match: regExp.latitudeRegex,
    message: "纬度范围：-90~90（保留小数点后十五位）"
  }
}