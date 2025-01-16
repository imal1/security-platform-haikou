import classNames from "classnames";
import styles from "./Container.module.less";
import React from "react";
import PicBlock from "@/assets/img/place-manage/fangan-box/top-block.png";

interface ContainerProps {
  className: string;
  title: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
}

const Container: React.FC<ContainerProps> = ({
  className,
  title,
  children,
  onClose,
}) => {
  return (
    <div className={classNames(styles["container"], className)}>
      <div className="header">
        <img className="block" src={PicBlock} />
        <div className="title">{title}</div>
        {onClose && <div className="close" onClick={onClose} />}
      </div>
      <div className="children">{children}</div>
      <div className="footer"></div>
    </div>
  );
};

export default Container;
