import JX from "@/assets/img/place-manage/icons/JX.png";
import CIRCLE from "@/assets/img/place-manage/icons/CIRCLE.png";
import DBX from "@/assets/img/place-manage/icons/DBX.png";

import QY from "@/assets/img/place-manage/icons/QY.png";
import LX from "@/assets/img/place-manage/icons/LX.png";
import ZRQ from "@/assets/img/place-manage/icons/ZRQ.png";
import Q from "@/assets/img/place-manage/icons/Q.png";
import SJZ from "@/assets/img/place-manage/icons/SJZ.png";
import XLC from "@/assets/img/place-manage/icons/XLC.png";
import JM from "@/assets/img/place-manage/icons/JM.png";
import FCZ from "@/assets/img/place-manage/icons/FCZ.png";
import CRK from "@/assets/img/place-manage/icons/CRK.png";
import AJM from "@/assets/img/place-manage/icons/AJM.png";
import XFS from "@/assets/img/place-manage/icons/XFS.png";
import HL from "@/assets/img/place-manage/icons/HL.png";
import BD from "@/assets/img/place-manage/icons/BD.png";
import WB from "@/assets/img/place-manage/icons/WB.png";
import XX from "@/assets/img/place-manage/icons/XX.png";
import GC from "@/assets/img/place-manage/icons/GC.png";
import TCC from "@/assets/img/place-manage/icons/TCC.png";
import JZTC from "@/assets/img/place-manage/icons/JZTC.png";
import JWZ from "@/assets/img/place-manage/icons/JWZ.png";
import YZ from "@/assets/img/place-manage/icons/YZ.png";
import AJJ from "@/assets/img/place-manage/icons/AJJ.png";
import CJZ from "@/assets/img/place-manage/icons/CJZ.png";
import FBD from "@/assets/img/place-manage/icons/FBD.png";
import FKFFD from "@/assets/img/place-manage/icons/FKFFD.png";
import TJXLC from "@/assets/img/place-manage/icons/TJXLC.png";
import TQZQD from "@/assets/img/place-manage/icons/TQZQD.png";
import WJFCZC from "@/assets/img/place-manage/icons/WJFCZC.png";
import WJZQD from "@/assets/img/place-manage/icons/WJZQD.png";
import WRJFZD from "@/assets/img/place-manage/icons/WRJFZD.png";
import XFD from "@/assets/img/place-manage/icons/XFD.png";
import ZACZD from "@/assets/img/place-manage/icons/ZACZD.png";
import ZJ from "@/assets/img/place-manage/icons/ZJ.png";

import ZFJLYON from "@/assets/img/place-manage/icons/ZFJLY-ON.png";
import ZFJLYOFF from "@/assets/img/place-manage/icons/ZFJLY-OFF.png";
import ZFJLYDAULT from "@/assets/img/place-manage/icons/KK-DAULT.png";
import KKON from "@/assets/img/place-manage/icons/KK-ON.png";
import KKOFF from "@/assets/img/place-manage/icons/KK-OFF.png";
import KKDAULT from "@/assets/img/place-manage/icons/KK-DAULT.png";
import QIUJION from "@/assets/img/place-manage/icons/QIUJI-ON.png";
import QIUJIOFF from "@/assets/img/place-manage/icons/QIUJI-OFF.png";
import QIUJIDAULT from "@/assets/img/place-manage/icons/QIUJI-DAULT.png";
import QJON from "@/assets/img/place-manage/icons/QJ-ON.png";
import QJOFF from "@/assets/img/place-manage/icons/QJ-OFF.png";
import QJDAULT from "@/assets/img/place-manage/icons/QJ-DAULT.png";


import LP from "@/assets/img/place-manage/icons/LP.png";

export const icons = {
  JX,
  CIRCLE,
  DBX,
  AREA: QY,
  ROUTE: LX,
  AOR: ZRQ,
  WALL: Q,
  BOLLARD: SJZ,
  PATROL_CAR: XLC,
  KNIFE_REST: JM,
  ANTI_COLLISION: FCZ,
  GATE: CRK,
  SECURITY_GATE: AJM,
  FIRE_HYDRANT: XFS,
  GUARDRAIL: HL,
  PUNCTUATION: BD,
  TEXT: WB,
  REST: XX,
  TOILET: GC,
  PARKING_LOT: TCC,
  NO_PARKING: JZTC,
  POLICE_STATION: JWZ,
  STATION: YZ,
  SIGNPOST: LP,
  SECURITY_MACHINE: AJJ,
  VEHICLE_INSPECTION_STATION: CJZ,
  SUBWAY_GATE_MACHINE: ZJ,
  SPECIAL_POLICE_PATROL_VEHICLE: TJXLC,
  POLICE_FORCE_CRASH_PREVENTION: WJFCZC,
  EXPLOSION_PROOF_POINT: FBD,
  FIRE_PROTECTION_POINT: XFD,
  UAV: WRJFZD,
  COUNTER_TERRORISM_PREVENTION: FKFFD,
  SPECIAL_POLICE_DUTY: TQZQD,
  ARMED_POLICE_DUTY: WJZQD,
  SECURITY_DISPOSAL: ZACZD,

  // 设备
  IPC_1: QIUJIOFF,
  IPC_1_ON:QIUJION,
  IPC_3: QJOFF,
  IPC_3_ON: QJON,
  BWC: ZFJLYOFF,
  BWC_ON: ZFJLYON,
  TOLLGATE: KKOFF,
  TOLLGATE_ON: KKON,
};

export const featureTypes = [
  {
    label: "全部",
    value: "all",
  },
  {
    label: "场地绘制",
    value: "SITE_DRAWING",
  },
  {
    label: "物防",
    value: "PHYSICAL_DEFENSE",
  },
  {
    label: "场所设施",
    value: "VENUE_FACILITY",
  },
];

export enum GeometryType {
  /**
   * 	矩形	0
   *  @constant KMapUE.GeometryType.RECTANGLE
   */
  RECTANGLE = "RECTANGLE",
  /**
   * 	圆形	1
   *  @constant KMapUE.GeometryType.CIRCLE
   */
  CIRCLE = "CIRCLE",
  /**
   * 	椭圆	2
   *  @constant KMapUE.GeometryType.ELLIPTIC
   */
  ELLIPTIC = "ELLIPTIC",
  /**
   * 	多边形	3
   *  @constant KMapUE.GeometryType.POLYGON
   */
  POLYGON = "POLYGON",
  /**
   * 	弓形	4
   *  @constant KMapUE.GeometryType.ARCUATE
   */
  ARCUATE = "ARCUATE",
  /**
   * 	扇形	5
   *  @constant KMapUE.GeometryType.SECTOR
   */
  SECTOR = "SECTOR",
  /**
   * 	墙	6
   *  @constant KMapUE.GeometryType.WALL
   */
  WALL = "WALL",
}

export enum ElementType {
  /**
   * 升降柱
   * @constant KMapUE.ElementType.BOLLARD
   */
  BOLLARD = "BOLLARD",
  /**
   * 巡逻车
   * @constant KMapUE.ElementType.PATROL_CAR
   */
  PATROL_CAR = "PATROL_CAR",
  /**
   * 拒马
   * @constant KMapUE.ElementType.KNIFE_REST
   */
  KNIFE_REST = "KNIFE_REST",
  /**
   * 防冲撞
   * @constant KMapUE.ElementType.ANTI_COLLISION
   */
  ANTI_COLLISION = "ANTI_COLLISION",
  /**
   * 出入口
   * @constant KMapUE.ElementType.GATE
   */
  GATE = "GATE",
  /**
   * 安检口
   * @constant KMapUE.ElementType.SECURITY_GATE
   */
  SECURITY_GATE = "SECURITY_GATE",
  /**
   * 消防栓
   * @constant KMapUE.ElementType.FIRE_HYDRANT
   */
  FIRE_HYDRANT = "FIRE_HYDRANT",
  /**
   * 护栏
   * @constant KMapUE.ElementType.GUARDRAIL
   */
  GUARDRAIL = "GUARDRAIL",
  /**
   * 标点
   * @constant KMapUE.ElementType.PUNCTUATION
   */
  PUNCTUATION = "PUNCTUATION",
  /**
   * 休憩
   * @constant KMapUE.ElementType.REST
   */
  REST = "REST",
  /**
   * 公厕
   * @constant KMapUE.ElementType.TOILET
   */
  TOILET = "TOILET",
  /**
   * 停车场
   * @constant KMapUE.ElementType.PARKING_LOT
   */
  PARKING_LOT = "PARKING_LOT",
  /**
   * 禁止停车
   * @constant KMapUE.ElementType.NO_PARKING
   */
  NO_PARKING = "NO_PARKING",
  /**
   * 警务站
   * @constant KMapUE.ElementType.POLICE_STATION
   */
  POLICE_STATION = "POLICE_STATION",
  /**
   * 驿站
   * @constant KMapUE.ElementType.STATION
   */
  STATION = "STATION",
  /**
   * 安检机
   * @constant KMapUE.ElementType.SECURITY_MACHINE
   */
  SECURITY_MACHINE = "SECURITY_MACHINE",
  /**
   * 车检站
   * @constant KMapUE.ElementType.VEHICLE_INSPECTION_STATION
   */
  VEHICLE_INSPECTION_STATION = "VEHICLE_INSPECTION_STATION",
  /**
   * 闸机
   * @constant KMapUE.ElementType.SUBWAY_GATE_MACHINE
   */
  SUBWAY_GATE_MACHINE = "SUBWAY_GATE_MACHINE",
  /**
   * 特警巡逻车
   * @constant KMapUE.ElementType.SPECIAL_POLICE_PATROL_VEHICLE
   */
  SPECIAL_POLICE_PATROL_VEHICLE = "SPECIAL_POLICE_PATROL_VEHICLE",
  /**
   * 武警防冲撞车
   * @constant KMapUE.ElementType.POLICE_FORCE_CRASH_PREVENTION
   */
  POLICE_FORCE_CRASH_PREVENTION = "POLICE_FORCE_CRASH_PREVENTION",
  /**
   * 防爆点
   * @constant KMapUE.ElementType.EXPLOSION_PROOF_POINT
   */
  EXPLOSION_PROOF_POINT = "EXPLOSION_PROOF_POINT",
  /**
   * 消防点
   * @constant KMapUE.ElementType.FIRE_PROTECTION_POINT
   */
  FIRE_PROTECTION_POINT = "FIRE_PROTECTION_POINT",
  /**
   * 无人机反制点
   * @constant KMapUE.ElementType.UAV
   */
  UAV = "UAV",
  /**
   * 反恐防范点
   * @constant KMapUE.ElementType.COUNTER_TERRORISM_PREVENTION
   */
  COUNTER_TERRORISM_PREVENTION = "COUNTER_TERRORISM_PREVENTION",
  /**
   * 特警执勤点
   * @constant KMapUE.ElementType.SPECIAL_POLICE_DUTY
   */
  SPECIAL_POLICE_DUTY = "SPECIAL_POLICE_DUTY",
  /**
   * 武警执勤点
   * @constant KMapUE.ElementType.ARMED_POLICE_DUTY
   */
  ARMED_POLICE_DUTY = "ARMED_POLICE_DUTY",
  /**
   * 治安处置点
   * @constant KMapUE.ElementType.SECURITY_DISPOSAL
   */
  SECURITY_DISPOSAL = "SECURITY_DISPOSAL",
}
