import Axios from "axios";

export async function getMediaConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
        Axios.get(`${window["globalConfig"].videoFusionUrl}/matching/config/getPullUrl`).then((res) => {
            if (!res.data) reject(null);
            // get config: tag and deviceId
            console.log("res data: ", res.data);
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })

}

export async function getNodeConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
        Axios.get(`${window["globalConfig"].videoFusionUrl}/matching/config/getNode`).then((res) => {
            if (!res.data) reject(null);
            // get config: tag and deviceId
            console.log("res data: ", res.data);
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })

}

// 开始推流
export async function getMediaAddress(deviceId: string) {
    Axios.put(`${window["globalConfig"].videoFusionUrl}/MediaTransform/push/deviceId/${deviceId}`).then((res) => {
        if (!res.data) return;
        // return media rtsp address
    })
}

// 开始推流
export async function getMediaAddressByTag(tag: string) {
    Axios.put(`${window["globalConfig"].videoFusionUrl}/MediaTransform/push/panelTag/${tag}`).then((res) => {
        if (!res.data) return;
        // return media rtsp address
    })
}

// 结束推流
export function stopMediaPush(deviceId: string) {
    Axios.put(`${window["globalConfig"].videoFusionUrl}/MediaTransform/stop/deviceId/${deviceId}`).then((res) => {
        if (!res.data) return;
        // stop media
    })
}

export function getVideoPageUrl(deviceId: string, width?: number, height?: number) {
    return `${window["globalConfig"].videoFusionUrl}/html/webrtc/${deviceId}?width=${width}&height=${height}`;
}