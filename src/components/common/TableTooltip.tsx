import { Tooltip, TooltipProps } from "@arco-design/web-react";

import { ReactNode } from "react";
import { isEmptyString } from "../../kit/logic";

interface IProps extends TooltipProps {
  children?: React.ReactNode;
}
export function TableTooltip({ children, ...params }: IProps) {
  return <Tooltip {...params}>{children}</Tooltip>;
}

export const renderTableTooltip = (
  content: ReactNode,
  tooltipProps?: TooltipProps
) => {
  if (isEmptyString(content) || content === null) return <>-</>;
  return (
    <TableTooltip
      content={content}
      style={{
        wordBreak: "break-all",
        ...tooltipProps?.style,
      }}
      {...tooltipProps}
      position={tooltipProps?.position || "tl"}
    >
      {content}
    </TableTooltip>
  );
};
