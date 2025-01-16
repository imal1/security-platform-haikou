import { Tooltip, Typography } from "@arco-design/web-react";

/**
 * 补上不存在的字段 并返回undefined
 * @param {object} obj
 * @param {string} key
 * @returns
 */
export const tryGet = (obj: object, key: string) => {
  return key.split(".").reduce(function (o, x) {
    return typeof o == "undefined" || o === null ? o : o[x];
  }, obj);
};

/**
 * 获取字符串长度（区别中英文）
 *
 * @returns
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
 *
 * @returns
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
 *
 * 点点点
 */
const GetTableColumnConfig = (
  text,
  showTooltipTextLength,
  overlayClassName?,
  overlayStyle?,
  cutByte?
) => {
  let textMiddle;
  let cutText;
  if (text) {
    textMiddle = text.toString().replace(/\n/g, "");
    if (cutByte) {
      const textArr = textMiddle.split(cutByte);
      cutText = () => (
        <>
          {textArr.map((it) =>
            it ? <p style={{ marginBottom: 0 }}> {it + cutByte}</p> : ""
          )}
        </>
      );
    }
    // console.log(getLen(textMiddle));
  }
  return (
    <div className="table-text one-line-text">
      {getLen(textMiddle) > showTooltipTextLength ? (
        <Tooltip
          trigger="hover"
          position="tl"
          className={overlayClassName}
          style={overlayStyle ? overlayStyle : {}}
          content={cutByte ? cutText : textMiddle}
        >
          <span className="table-cursor-pointer kid-title">
            {subStr(textMiddle, showTooltipTextLength)}
          </span>
        </Tooltip>
      ) : (
        <span className="kid-title">{textMiddle || "-"}</span>
      )}
    </div>
  );
};

export default GetTableColumnConfig;
