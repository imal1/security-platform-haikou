import classNames from "classnames";
import styles from "./index.module.less";
import { Button } from "@arco-design/web-react";

const StepOne = ({ onCreate, onNext }) => {
  return (
    <div className={styles["guide-modal"]}>
      <div className={classNames(styles["guide-steps"], "one")}>
        <div className="guide-title">
          创建方案 <span>1/2</span>
        </div>
        <div className="guide-content">
          单击“新增方案”，填写方案基本信息， 创建安保方案。
        </div>
        <div className="guide-actions">
          <Button className="now-create" onClick={onCreate}>
            立即创建
          </Button>
          <Button type="primary" className="step-next" onClick={onNext}>
            下一步
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
