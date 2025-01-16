//弹框详情
import React from "react";
import "./index.less";

interface DetailsItem {
  label: React.ReactNode;
  value: React.ReactNode;
  isHide?: boolean;
}
interface DetailsProps {
  data: Array<DetailsItem>;
  className?: string;
}
const Details = (porps: DetailsProps) => {
  const { data, className = '' } = porps;
  return (
    <div className={`pgis-details-wrap ${className}`}>
      {data?.filter(i => i.isHide !== true).map((item, index) => (
          <div className="pgis-details-li" key={`${item.label}-${index}`}>
          <div className="pgis-details-li-label">{item.label}</div>
          <div className="pgis-details-li-value">{item.value || "-"}</div>
        </div>
      ))}
    </div>
  );
};
export default Details;
