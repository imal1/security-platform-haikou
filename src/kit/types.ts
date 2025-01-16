/**
 * 2023年10月30日09:50:05
 * 保存通用的类型定义
 */

import { TableColumnProps } from "@arco-design/web-react";

export enum EElementZIndex {
  ARCO_DRAWER = 99999, // 抽屉组件
  MESSAGE_TIP = 999999, // 全局提示框
}

export interface TKArcoTableColumnType<T = any> extends TableColumnProps<T> {
  autoEllipsisCheck?: boolean; // 是否自动省略
}

// 我服了，没人写类型，这玩意我放这里，其实是警务设备值班详情的类型
export interface Icr {
  type_name: string;
  gpsReportType: string;
  timingModeFI: string;
  voiceEncodeType_name: string;
  storage: string;
  type: string;
  voiceEncodeType: string;
  gpsReportFlag_name: string;
  sc: string;
  storage_name: string;
  siteReportType_name: string;
  gpsReportFlag: string;
  gpsReportType_name: string;
  siteReportType: string;
  distanceModeFI: string;
}

export interface DeviceAttr {
  icr: Icr;
}

export interface IDutyDevice {
  altitude: string;
  private_policeCode: string;
  role: string[];
  gbid: string;
  departmentCode: string;
  onlineStatus: boolean;
  groupId: string;
  latitude: number;
  departmentPath: string;
  private_postName: string;
  gpsTimestamp: number;
  userCode: string;
  speed: string;
  id: string;
  longitude: number;
  direction: string;
  deviceType: string;
  deviceAttr: DeviceAttr;
  currentStatus: string;
  appName: string;
  carrierType: number;
  ctServerInfo: string;
  targetType?: any;
  locationpoint: number[];
  serviceName: string;
  typeCode: number;
  civilCode: string;
  isGpsSource: number;
  private_paccPoliceName: string;
  private_policeName: string;
  name: string;
  gpsType: number;
  status: number;
}

export interface IDutyDetail {
  status: 0 | 1;
  name: string; // 单位
  device_type: string; // 设备类型
  // 采集时间
  gpsTimestamp?: number;
  userList: IDutyUser[];
  orgName: string
}

export interface IDutyUser {
  deptName: string;
  postName: string;
  telephone?: any;
  postId: number;
  userName: string;
  deptCode: string;
  username: string;
}


export interface Device {
	callCode?: any;
	dataSource: string;
	deviceName: string;
	deviceType: string;
	gbid: string;
	havePtt?: any;
	id: string;
	ipcTollgateId?: any;
	laneApeId?: any;
	laneApeViidId?: any;
	laneNo?: any;
	parentId?: any;
	phoneType?: any;
	pttUserCode?: any;
	status: number;
}

export interface DutyDevice {
	callCode?: any;
	dataSource: string;
	deviceName: string;
	deviceType: string;
	gbid: string;
	havePtt?: any;
	id: string;
	ipcTollgateId?: any;
	laneApeId?: any;
	laneApeViidId?: any;
	laneNo?: any;
	parentId?: any;
	phoneType?: any;
	pttUserCode?: any;
	status: number;
}

export interface IDutyUserResult {
	address?: any;
	beginTime: string;
	code: string;
	deptId: string;
	deptPath: string;
	deviceCount?: any;
	devices: Device[];
	dsJjxxAndUser?: any;
	dutyDevices: DutyDevice[];
	dutyPostIds: string;
	email?: any;
	endTime: string;
	extendedField?: any;
	id: string;
	identity?: any;
	initials: string;
	leader: string;
	loginDevice?: any;
	moveStatus: string;
	name: string;
	namePinyin: string;
	nextDay: string;
	nickName?: any;
	onDeviceCount?: any;
	onDuty: string;
	onStatus: string;
	onlineStatus: string;
	phone: string;
	photo?: any;
	policeNo: string;
	policeType?: any;
	position?: any;
	postName: string;
	pttStatus?: any;
	schemeList: any[];
	sex: number;
	sortCode?: any;
	status: string;
	telephone?: any;
	userDevices: any[];
	username: string;
	workStatus?: any;
	workStatusName?: any;
	workTime?: any;
}

