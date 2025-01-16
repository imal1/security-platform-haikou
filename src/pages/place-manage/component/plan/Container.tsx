import classNames from "classnames";
import styles from "./Container.module.less";
import React from "react";

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
        <div className="pic1" />
        <div className="pic2" />
        <div className="pic3" />
        <div className="pic4" />
        <div className="title">{title}</div>
        {onClose && <div className="close" onClick={onClose} />}
      </div>
      <div className="children">{children}</div>
      <div className="footer">
        <div className="pic1" />
        <div className="pic2" />
        <div className="pic3" />
      </div>
    </div>
  );
};

export default Container;
