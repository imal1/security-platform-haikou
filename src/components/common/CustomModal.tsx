import { Modal, ModalProps } from "@arco-design/web-react";

import ModalButtonGroup from "./ModalButtonGroup";

export interface ICustomModalProps extends ModalProps {
  children?: React.ReactNode;
  footerStyle?: React.CSSProperties;
  height?: number;
  parentSelector?: string;
  customFooter?: React.ReactNode;
  contentStyle?: React.CSSProperties;
  confirmLoading?: boolean;
}
export default function ({
  children,
  footerStyle,
  parentSelector,
  customFooter,
  contentStyle,
  confirmLoading,
  ...props
}: ICustomModalProps) {
  if (!!props.visible === false) return null;
  return (
    <Modal
      focusLock={false}
      visible={true}
      getPopupContainer={() =>
        document.querySelector(parentSelector || "body") as HTMLElement
      }
      {...props}
      footer={null}
      className={
        props.className ? `${props.className} custom-modal` : "custom-modal"
      }
      data-custom-modal
    >
      <div
        style={{
          height: props.height ? `${props.height - 112}px` : "auto",
          overflow: "auto",
          ...contentStyle,
        }}
        className="public-modal-scrollbar"
      >
        {children}
      </div>
      {customFooter !== undefined ? (
        customFooter
      ) : (
        <ModalButtonGroup
          onCancel={props.onCancel}
          onOk={props.onOk}
          styles={{ paddingRight: 8 }}
          confirmLoading={confirmLoading}
          confirmTitle={props.okText as any}
          cancelTitle={props.cancelText as any}
        />
      )}
    </Modal>
  );
}
