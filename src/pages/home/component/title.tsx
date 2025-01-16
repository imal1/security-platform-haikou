import React from "react";
import titleArrow from "@/assets/img/home/title-arrow.png";
import classNames from "classnames";
import { Tooltip } from "@arco-design/web-react";
interface TitleProps {
  className?: string;
  title: React.ReactNode | string;
  after?: React.ReactNode;
  style?: React.CSSProperties;
  textLength?: number;
}
const Title = (props: TitleProps) => {
  const { className, title, after, style, textLength = 0 } = props;
  return (
    <div className={classNames("title-wrap", className)} style={style}>
      <div className="title-left">
        <div className="icon">
          <img src={titleArrow} />
        </div>
        <Tooltip content={textLength > 9 ? title : ""}>
          <label htmlFor="" className="text-overflow">
            {title}
          </label>
        </Tooltip>
      </div>
      {after && <div className="title-after">{after}</div>}
    </div>
  );
};
export default Title;
