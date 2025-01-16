import { needEllipsis } from "../kit";
import { Tooltip } from "@arco-design/web-react";

export const TableTooltip = (text, width, ...other) => {
  const tdWidth = width - 22 - 16 - 1; //减除td左右间距
  const isEllipsis = needEllipsis(text, tdWidth, ...other);
  return isEllipsis ? (
    <Tooltip content={text} position="tl">
      <span>{text || "-"}</span>
    </Tooltip>
  ) : (
    <span>{text || "-"}</span>
  );
};
