import classNames from "classnames";
import styles from "./index.module.less";
import { Button } from "@arco-design/web-react";

const StepTwo = ({ onNext }) => {
  return (
    <div className={styles["guide-modal"]}>
      <div className={classNames(styles["guide-steps"], "two")}>
        <div className="guide-title">
          要素新增 <span>2/2</span>
        </div>
        <div className="guide-content">
          单击某个要素，拖动到场景内位置，填写要素属性信息；点击“保存”按钮，保存该要素到左侧“临时资源”。
        </div>
        <div className="guide-actions">
          <Button type="primary" className="step-next" onClick={onNext}>
            知道了
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
