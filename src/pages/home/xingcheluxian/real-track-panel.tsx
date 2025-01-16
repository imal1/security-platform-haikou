import { observer } from "mobx-react"
import Container from "../../place-manage/component/plan/Container";
import { Grid } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import classNames from "classnames";

const { Row, Col } = Grid;

interface IPanelProps {
    total: number,
    progress: number,
    speed?: number,
    restDistance?: number,
    restTime?: number,
    restDate?: string,
    isRigth?: boolean
}

interface panelItem {
    key: string,
    label: string,
    value: string | number,
    unit?: string
}

const panelData = [
    {
        key: "total",
        label: "路线总长度",
        value: "1.56",
        unit: "km"
    },
    {
        key: "speed",
        label: "车辆行驶速度",
        value: "35.68",
        unit: "km/h"
    },
    {
        key: "restDistance",
        label: "距终点距离",
        value: "0.89",
        unit: "km"
    },
    {
        key: "restTime",
        label: "预计剩余到达时间",
        value: "6分钟"
    },
    {
        key: "expectedTime",
        label: "预计到达时间",
        value: "15:08"
    }
]

const panelValueMap = new Map();

const RealTrackPanel = (props: IPanelProps) => {

    useEffect(() => {
        // debugger
        const { total, progress, speed } = props;
        panelValueMap.set("total", (total / Math.pow(10, 5)).toFixed(2) );
        panelValueMap.set("speed", speed );
        panelValueMap.set("restDistance", ((total - progress) / Math.pow(10, 5)).toFixed(2) );
        const calcTime = Math.ceil((((total - progress) / Math.pow(10, 5)) / (speed || 60)) * 60);
        panelValueMap.set("restTime", isNaN(calcTime) ? calcTime + "分钟" : "");
        let currentTime = new Date();
        // 添加分钟
        currentTime.setMinutes(currentTime.getMinutes() + Math.ceil((((total - progress) / Math.pow(10, 5) / speed || 60) * 60)));
        // 格式化时间输出
        let hours = currentTime.getHours().toString().padStart(2, '0');
        let minutes = currentTime.getMinutes().toString().padStart(2, '0');
        panelValueMap.set("expectedTime", isNaN(calcTime) ? `${hours}:${minutes}` : "")
    }, [props])

    return (
        <>
            <Container title="车辆追踪情况" className={classNames("xclx-panel", props.isRigth ? "xclx-panel-left" : "")}>
                {panelData.map((item) =>
                    panelValueMap.get(item.key) && (<>
                        <Row gutter={[0, 20]}>
                            <Col style={{ flex: "none", width: "100px" }}>
                                <span>{item.label}</span>
                            </Col>
                            <Col span={8} offset={3}>
                                <span>{panelValueMap.get(item.key) || "--"} {item.unit || ""}</span>
                            </Col>
                        </Row>
                    </>)
                )}
            </Container>
        </>
    )
}

export default observer(RealTrackPanel);