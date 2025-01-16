import { Trigger, TriggerProps } from "@arco-design/web-react";
import { IconClose } from "@arco-design/web-react/icon";
import filterUrl from "@/assets/img/filter.png";
import filterHoverUrl from "@/assets/img/filter-hover.png";
import "./index.less";
import React from "react";
import classNames from "classnames";
interface filterModal {
  className?: string;
  triggerProps?: TriggerProps;
  children?: React.ReactNode | string;
  title?: string;
  width?: number;
  height?: number;
  filterDom?: React.ReactNode;
  defaultVisible?: boolean;
  popupDom?: React.ReactNode;
}
const FilterModal = (props: filterModal) => {
  const {
    className,
    triggerProps,
    children,
    title = "筛选",
    width = 380,
    height = 300,
    filterDom,
    defaultVisible = false,
    popupDom,
  } = props;
  const [visible, setVisible] = React.useState(defaultVisible);
  return (
    <Trigger
      popupVisible={visible}
      onVisibleChange={(visible) => {
        setVisible(visible);
      }}
      trigger="click"
      position="br"
      popupAlign={{
        bottom: [0, 10],
      }}
      {...triggerProps}
      popup={() =>
        popupDom ? (
          popupDom
        ) : (
          <div
            className="filter-trigger-popup"
            style={{ width: width, height: height }}
          >
            <div className="trigger-header">
              <div className="trigger-title">{title}</div>
              <div
                className="trigger-close-icon"
                onClick={() => {
                  setVisible(false);
                }}
              >
                <IconClose />
              </div>
            </div>
            <div className="trigger-con public-scrollbar">{children}</div>
          </div>
        )
      }
      //   getPopupContainer={() => document.querySelector(".police-deployment")}
    >
      {filterDom ? (
        <div
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {filterDom}
        </div>
      ) : (
        <div
          className={classNames(
            "filter-modal-wrap",
            visible && "active",
            className
          )}
          onClick={() => {
            setVisible(!visible);
          }}
        >
          <img src={filterUrl} className="pic" alt="" />
          <img src={filterHoverUrl} className="pic-hover" alt="" />
        </div>
      )}
    </Trigger>
  );
};
export default FilterModal;
