import styles from "./Deploying.module.less";
import { observer } from "mobx-react";
import store from "../../store/index";
import { Button } from "@arco-design/web-react";

interface DeployingProps {
  onDeply: () => void;
  onExit: () => void;
}

const Deploying: React.FC<DeployingProps> = ({ onDeply, onExit }) => {
  const { status, plans } = store;

  const { title, btn, action } = {
    readonly: {
      title: "方案查看中",
      btn: "部署",
      action: onDeply,
    },
    editable: {
      title: "方案部署中",
      btn: "退出",
      action: onExit,
    },
  }[status];

  if (!plans.length) return null;

  return (
    <div className={styles["deploying"]}>
      <div className="text-center">{title}</div>
      <Button className="btn-status" onClick={action}>
        {btn}
      </Button>
    </div>
  );
};

export default observer(Deploying);
