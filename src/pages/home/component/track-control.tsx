import { observer } from "mobx-react"
import "./device-icon.less"
import { Slider } from "@arco-design/web-react";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import classNames from "classnames";

interface TrackControlProps {
    track?: any;
    isRight?: boolean;
}

const TrackControl: React.FC<TrackControlProps> = ({
    track,
    isRight = false
}) => {
    const [speed, setSpeed] = useState<number>(1);
    const [sliderVisible, setSliderVisible] = useState<boolean>(false);
    const [startFlag, setStartFlag] = useState<boolean>(false);
    useEffect(() => {
        const handleDocMouseUp = () => {
            if(startFlag) {
                onMouseUp();
            }
        }
        document.addEventListener('mouseup', handleDocMouseUp);
        return (() => {
            document.removeEventListener('mouseup', handleDocMouseUp);
        })
    }, [])

    useEffect(() => {
        track && track.setSpeed(speed);
    }, [track])

    const onFrontMouseDown = () => {
        track && track.play(true);
        setStartFlag(true);
    }

    const onMouseUp = () => {
        setTimeout(() => {
            track && track.pause();
            setStartFlag(false);
        }, 200);
    }

    const onBackMouseDown = () => {
        track && track.reverse(true);
        setStartFlag(true);
    }

    // const onPanelLeave = () => {
    //     track && track.pause();
    // }

    return (
        <>
            <div onMouseLeave={onMouseUp} className={classNames("track-control-wrap", isRight ? "wrap-right" : "wrap-left")}>
                {sliderVisible && (<div className="track-control-speed">
                    <div className="track-control-speed-range" style={{marginBottom: "5px"}}>3 m/s</div>
                    <Slider
                        value={speed}
                        max={3}
                        min={0}
                        step={0.1}
                        vertical
                        onChange={debounce((val) => {
                            if (val) {
                                setSpeed(val)
                                track && track.setSpeed(val);
                            }

                        }, 600)}
                        // tooltipVisible={true}
                        formatTooltip={
                            (value: number) => {
                                return value
                            }
                        }
                        getTooltipContainer={() => document.querySelector(".track-box")}
                    />
                    <div className="track-control-speed-range">0 m/s</div>
                </div>)}
                <div className="track-control-panel">
                    <div className="track-control-front" onMouseDown={onFrontMouseDown} onMouseUp={onMouseUp}></div>
                    <div className={classNames("track-control-speed", sliderVisible ? "track-control-speed-active" : "")} onClick={() => setSliderVisible(!sliderVisible)}>
                        <div style={{margin: "auto", padding: "18px"}}>
                            <div className="track-control-speed-title">速度</div>
                            <div className="track-control-speed-value">{speed}m/s</div>
                        </div>
                        
                    </div>
                    <div className="track-control-back"  onMouseDown={onBackMouseDown} onMouseUp={onMouseUp}></div>
                </div>
            </div>

        </>
    )
}

export default observer(TrackControl);