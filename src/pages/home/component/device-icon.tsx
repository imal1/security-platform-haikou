import "./device-icon.less"

const DeviceIcon = ({ type, num }) => {
    let labelName = "枪机";
    switch (type) {
        case "IPC_3":
            labelName = "枪机";
            break;
        case "IPC_1":
            labelName = "球机";
            break;
        case "BWC":
            labelName = "执法记录仪";
            break;
        case "PTT":
            labelName = "对讲机";
            break;
        case "PAD":
            labelName = "警务通";
            break;
        case "MT":
            labelName = "会议终端";
            break;
        default:
            break;
    }
    return (
        <div className="device-icon-wrap">
            <div className="device-icon-bg">
                <div className={`device-icon device-icon-${type}`}></div>
            </div>
            <div className="device-label-bg">
                <div className="device-label-tit">{labelName}</div>
                <div className="device-label-con">{num}</div>
            </div>
        </div>
    )
}

export default DeviceIcon;