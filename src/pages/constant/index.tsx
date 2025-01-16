const colorBlue: string = "#0E81E2";
const colorRed: string = "#FF4448";
const colorGreen: string = "#51FFA7";
const colorYellow: string = "#FFC532";
const colorCyan: string = "#07D2E9";
export const codeMap = {
  // 蓝色
  PATROL_CAR: colorBlue,
  TOILET: colorBlue,
  PARKING_LOT: colorBlue,
  POLICE_STATION: colorBlue,
  SPECIAL_POLICE_PATROL_VEHICLE: colorBlue,
  SPECIAL_POLICE_DUTY: colorBlue,
  POLICE_FORCE_CRASH_PREVENTION: colorBlue,
  ARMED_POLICE_DUTY: colorBlue,
  // 红色
  KNIFE_REST: colorRed,
  FIRE_HYDRANT: colorRed,
  GUARDRAIL: colorRed,
  NO_PARKING: colorRed,
  EXPLOSION_PROOF_POINT: colorRed,
  COUNTER_TERRORISM_PREVENTION: colorRed,
  FIRE_PROTECTION_POINT: colorRed,
  SUBWAY_GATE_MACHINE: colorRed,
  // 绿色
  BOLLARD: colorGreen,
  GATE: colorGreen,
  STATION: colorGreen,
  VEHICLE_INSPECTION_STATION: colorGreen,
  // 青色
  TEXT: colorCyan,
  REST: colorCyan,
  UAV: colorCyan,
  // 黄色
  SECURITY_GATE: colorYellow,
  PUNCTUATION: colorYellow,
  ANTI_COLLISION: colorYellow,
  SECURITY_MACHINE: colorYellow,
  SECURITY_DISPOSAL: colorYellow,
};

export const deviceIcons = {
  IPC_1: [
    {
      IconName: "poi-qj-010",
      Filter: {
        Key: "status",
        Value: 0,
      },
    },
    {
      IconName: "poi-qj-060",
      Filter: {
        Key: "status",
        Value: 1,
      },
    },
    {
      IconName: "poi-qj-070",
      Filter: {
        Key: "status",
        Value: 2,
      },
    },
  ],
  IPC_3: [
    {
      IconName: "poi-qiangji-010",
      Filter: {
        Key: "status",
        Value: 0,
      },
    },
    {
      IconName: "poi-qiangji-060",
      Filter: {
        Key: "status",
        Value: 1,
      },
    },
    {
      IconName: "poi-qiangji-070",
      Filter: {
        Key: "status",
        Value: 2,
      },
    },
  ],
  BWC: [
    {
      IconName: "poi-zfjly-010",
      Filter: {
        Key: "status",
        Value: 0,
      },
    },
    {
      IconName: "poi-zfjly-060",
      Filter: {
        Key: "status",
        Value: 1,
      },
    },
    {
      IconName: "poi-zfjly-070",
      Filter: {
        Key: "status",
        Value: 2,
      },
    },
  ],
  TOLLGATE: [
    {
      IconName: "poi-kakou-010",
      Filter: {
        Key: "status",
        Value: 0,
      },
    },
    {
      IconName: "poi-kakou-060",
      Filter: {
        Key: "status",
        Value: 1,
      },
    },
    {
      IconName: "poi-kakou-070",
      Filter: {
        Key: "status",
        Value: 2,
      },
    },
  ],
  PAD: [
    {
      IconName: "poi-jwt-010",
      Filter: {
        Key: "status",
        Value: 0,
      },
    },
    {
      IconName: "poi-jwt-060",
      Filter: {
        Key: "status",
        Value: 1,
      },
    },
    {
      IconName: "poi-jwt-060",
      Filter: {
        Key: "status",
        Value: 2,
      },
    },
  ],
  PTT: [
    {
      IconName: "poi-djj-010",
      Filter: {
        Key: "status",
        Value: 0,
      },
    },
    {
      IconName: "poi-djj-060",
      Filter: {
        Key: "status",
        Value: 1,
      },
    },
    {
      IconName: "poi-djj-060",
      Filter: {
        Key: "status",
        Value: 2,
      },
    },
  ],
  MT:[
    {
      IconName: "poi-hyzd-010",
      Filter: {
        Key: "status",
        Value: 0,
      },
    },
    {
      IconName: "poi-hyzd-060",
      Filter: {
        Key: "status",
        Value: 1,
      },
    },
    {
      IconName: "poi-hyzd-060",
      Filter: {
        Key: "status",
        Value: 2,
      },
    },
  ],
  // TODO: 匹配字段待确认
  police: [
    {
      // 交警
      IconName: "poi-jj-000",
      Filter: {
        Key: "private_orgCode",
        Reg: "^45010043"
      },
    },
    {
      // 特巡警
      IconName: "poi-tj-000",
      Filter: {
        Key: "private_orgCode",
        Reg: "^45010050"
      },
    },
    {
      // 民警
      IconName: "poi-mj-000"
    },
  ]
};

export const qjIcon = [];

export const kakouIcon = [];

export const qiangjiIcon = [
  {
    IconName: "poi-qiangji-010",
    Filter: {
      Key: "status",
      Value: 0,
    },
  },
  {
    IconName: "poi-qiangji-060",
    Filter: {
      Key: "status",
      Value: 1,
    },
  },
  {
    IconName: "poi-qiangji-070",
    Filter: {
      Key: "status",
      Value: 2,
    },
  },
];

export const zfjlyIcon = [];

// 蓝色 PATROL_CAR TOILET PARKING_LOT POLICE_STATION
// 红色 KNIFE_REST FIRE_HYDRANT GUARDRAIL NO_PARKING
// 绿色 BOLLARD GATE STATION
// 青色 TEXT REST
