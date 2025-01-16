import "./index.less";

import { Empty, EmptyProps } from "@arco-design/web-react";

import React from "react";
import { generateCustomCSSAttr } from "../../kit/logic";
import { isString } from "lodash";
import noDataUrl from "@/assets/img/no-data/no-data.svg";
import noSearchUrl from "@/assets/img/common/not-search-found.svg";
import imgUrl from "@/assets/img/no-data/no-data.png";

interface NoDataProps extends EmptyProps {
  status?: boolean; //是否存在搜索条件
  height?: number | string;
  styles?: React.CSSProperties;
  className?: string;
  image_width?: string;
  image_height?: string;
  isAnbo?: boolean;
}
const NoData = (props: NoDataProps) => {
  const {
    status = false,
    height,
    styles = {},
    className = "",
    image_height,
    image_width,
    isAnbo = false,
  } = props;
  const {
    imgSrc = isAnbo ? imgUrl : status ? noSearchUrl : noDataUrl,
    description = status ? "搜索无结果" : "暂无数据",
  } = props;
  return (
    <div
      className={`no-data-wrap ${className}`}
      style={{
        height: height ? (isString(height) ? height : `${height}px`) : "100%",
        ...styles,
      }}
    >
      <Empty
        imgSrc={imgSrc}
        description={props?.description ?? description}
        style={generateCustomCSSAttr({
          "--no-data-img-height": image_height,
          "--no-data-img-width": image_width,
        })}
      />
    </div>
  );
};

export default NoData;
