import styles from "./index.module.less"

import Container from "../plan/Container";
import { Input, Button, Message } from "@arco-design/web-react";
import React, { useEffect, useState } from "react";
import { formRules } from "@/kit/formRules";
import classNames from "classnames";
import { debounce } from "lodash";
interface CorrectionProps {
    coordinate: {
        lng: string,
        lat: string,
        alt: string,
    },
    confirm: (coordinate: any) => void;
    onCancel?: () => void;
    onSave?: () => void;
    isRight?: boolean;
    isTop?: boolean;
}

const Correction: React.FC<CorrectionProps> = ({
    coordinate,
    confirm,
    onCancel,
    onSave,
    isRight = false,
    isTop = false
}) => {
    
    const [longitude, setLongitude] = useState<string>();
    const [latitude, setLatitude] = useState<string>();
    const [altitude, setAltitude] = useState<string>();
    useEffect(() => {
        const { lng, lat, alt } = coordinate;
        setLongitude(lng);
        setLatitude(lat);
        setAltitude(alt);
    }, [coordinate]);
    useEffect(debounce(() => {
        handleConfirm();
    }, 1000), [longitude, latitude, altitude]);
    const handleConfirm = () => {
        console.log("longitude, latitude, altitude : ", longitude, latitude, altitude);
        if(!longitude && !latitude && !altitude) return;
        let validateFlag = true;
        if(!formRules.longitudeRule.match.test(longitude)){
            validateFlag = false;
            Message.warning({
                content: "经度范围：-180~180（至少保留小数点后八位）"
            })
        }

        if(!formRules.latitudeRule.match.test(latitude)){
            validateFlag = false;
            Message.warning({
                content: "纬度范围：-90~90（至少保留小数点后八位）"
            })
        }

        validateFlag && confirm({lng: Number(longitude), lat: Number(latitude), alt: Number(altitude)});
    }
    return (
        <>
            <Container title={"位置纠偏"} className={classNames(styles["correction-container"], isRight ? styles["corection-right"] : styles["corection-left"], isTop ? styles["corection-top"] : styles["corection-up"])} >
                <Input addBefore="经度：" value={longitude} onChange={setLongitude} size="small"/>
                <Input addBefore="纬度：" value={latitude} onChange={setLatitude} size="small"/>
                <Input addBefore="高度(m): " value={altitude} onChange={setAltitude} size="small"/>
                <div className="correction-btn">
                    <Button onClick={onCancel}>取消</Button>
                    <Button type="primary" style={{ marginLeft: 10 }} onClick={onSave}>确认</Button>
                </div>
            </Container>
        </>
    )
}

export default Correction;