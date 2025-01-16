import classNames from "classnames";

import styles from "./index.module.less";

interface TitleBarProps {
  content: React.ReactNode;
  style?: React.CSSProperties;
  children?:React.ReactNode;
}

const TitleBar: React.FC<TitleBarProps> = ({ content, style,children }) => {
  return (
    <div className={classNames(styles["title-bar"], "title-bar")} style={style}>
      {content}

       <> {children}</>
    </div>
  );
};

export default TitleBar;
