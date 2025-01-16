import { Button, ButtonProps } from "@arco-design/web-react";

// import CancelButton from "../../pages/account/component/common/CancelButton";

export interface ICustomModalButtonGroupProps {
  onOk?: () => unknown;
  onCancel?: () => unknown;
  styles?: React.CSSProperties;
  size?: ButtonProps["size"];
  confirmTitle?: string;
  cancelTitle?: string;
  confirmLoading?: boolean
  cancelLoading?: boolean
}
export default function ({
  onCancel,
  onOk,
  styles = {},
  size,
  confirmTitle = "确定",
  cancelTitle = "取消",
  confirmLoading,
  cancelLoading,
}: ICustomModalButtonGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "24px",
        gap: "12px",
        ...styles,
      }}
      className="custom-modal-button-group"
    >
      {/* <CancelButton onClick={onCancel} size={size} text={cancelTitle} loading={cancelLoading}></CancelButton> */}
      <Button type="primary" onClick={onOk} size={size} loading={confirmLoading}>
        {confirmTitle}
      </Button>
    </div>
  );
}
