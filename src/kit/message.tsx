import { CheckPassIcon, RejectIcon } from "../components/common/StatusIcon";
import { Message, MessageProps } from "@arco-design/web-react";

import { debounce } from "lodash";

export const showSaveSuccess = (
  text?: string,
  config?: Partial<MessageProps>
) => {
  Message.success({
    content: text ?? "保存成功",
    icon: <CheckPassIcon />,
    ...config,
  });
};

export const showSuccessMsg = (
  msg?: string,
  config?: Partial<MessageProps>
) => {
  Message.success({
    content: msg ?? "操作成功",
    icon: <CheckPassIcon />,
    ...config,
  });
};

export const showErrorMessage = debounce(
  (msg?: string, config?: Partial<MessageProps>) => {
    Message.error({
      content: msg ?? "操作失败",
      icon: <RejectIcon />,
      ...config,
    });
  },
  300
);

export const showInfoMessage = (msg: string, config?: Partial<MessageProps>) =>
  Message.info({
    content: msg,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 48 48"
      >
        <circle cx="24" cy="24" r="21" fill="#2196F3" />
        <path fill="#fff" d="M22 22h4v11h-4z" />
        <circle cx="24" cy="16.5" r="2.5" fill="#fff" />
      </svg>
    ),
    ...config,
  });

export const clearAllMessage = () => Message.clear();
