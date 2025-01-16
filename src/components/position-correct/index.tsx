import "./index.less";
import { Button } from "@arco-design/web-react";
import { debounce } from "lodash";
import { useEffect } from "react";

interface PositionCorrectProps {
  onOk: () => void;
  onCancel: () => void;
}

export const PositionCorrect = ({ onOk, onCancel }: PositionCorrectProps) => {
  return (
    <div className="wrapper">
      <div className="tip-text">位置纠偏</div>
      <div className="group">
        <Button className="cancel btn" onClick={debounce(onCancel, 600)}>
          取消
        </Button>
        <Button type="primary" className="btn" onClick={debounce(onOk, 600)}>
          确认
        </Button>
      </div>
    </div>
  );
};

export default PositionCorrect;
