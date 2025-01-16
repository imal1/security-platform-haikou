/**
 * 
 */

import React from "react";
import "./index.less";
import {
    Select
} from "@arco-design/web-react";

interface DetailsItem {
    label: React.ReactNode;
    value: React.ReactNode;
    isHide?: boolean;
}
interface DetailsProps {
    data: Array<DetailsItem>;
    className?: string;
}

const arrangeList = [
    {
        label: "查看详情",
        value: "1",
    },
    {
        label: "编辑要素",
        value: "2",
    },
    {
        label: "位置纠偏",
        value: "3",
    },
];
const contextMenu = (porps: DetailsProps) => {
    const handleSelect = () => {
    }
    const { data, className = '' } = porps;
    return (
        <div className={`pgis-details-wrap ${className}`}>
            <Select
                className="select"
                options={arrangeList}
                size="large"
                onChange={handleSelect}
            />

        </div>
    );
};
export default contextMenu;