import { Tooltip,TooltipProps } from "@arco-design/web-react";

import { IconQuestionCircle } from "@arco-design/web-react/icon";
import { TooltipPosition } from "@arco-design/web-react/es/Slider/interface";

interface IProps extends TooltipProps {
  position?: TooltipPosition
}

export default function (props: IProps) {
  return (
    <Tooltip {...props}>
      <IconQuestionCircle className="hover-theme-color" />
    </Tooltip>
  );
}
