import "./index.less";

import { ReactNode, useMemo } from "react";

import Details from "../details";
import { IconClose } from "@arco-design/web-react/icon";
import { createPortal } from "react-dom";
import headerBg from "@/assets/img/common/tooltip-header.svg";

interface DetailsItem {
  label: React.ReactNode;
  value: React.ReactNode;
  isHide?: boolean;
}
interface IProps {
  data?: Array<DetailsItem>;
  title: string;
  visible: boolean;
  children?: ReactNode;
  className?: string;
  left?: string;
  top?: string;
  onClose?: () => void;
  parentNodeSelector?: string;
  styles?: React.CSSProperties;
  position?: "b" | "l" | "r";
}
export default function (props: IProps) {
  const {
    title,
    data = [],
    visible,
    className,
    left,
    top,
    onClose,
    parentNodeSelector,
    styles,
    children,
    position = "l",
  } = props;
  const node = useMemo(() => {
    if (!visible) return null;
    const container = document.querySelector(parentNodeSelector ?? "body");
    return createPortal(
      <div
        className={`custom-detail-tooltip ${className ?? ""} pos-${position}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          left,
          top: `calc(${top} - 40px)`,
          position: "absolute",
          ...styles,
        }}
      >
        <div className="detail-tooltip-wrap">
          <div
            className="tooltip-header"
            style={{
              background: `url(${headerBg})`,
              backgroundSize: "cover",
            }}
          >
            <div className="tit flex-aic" onClick={() => {}}>
              <span>{title ?? "标题"}</span>
              <IconClose
                onClick={onClose}
                style={{
                  marginLeft: "auto",
                  cursor: "pointer",
                  position: "relative",
                  left: 6,
                }}
              />
            </div>
          </div>
          <div className="detail-tooltip-content">
            {children ? children : <Details data={data} />}
          </div>
        </div>
      </div>,
      container
    );
  }, [props]);
  return node;
}
