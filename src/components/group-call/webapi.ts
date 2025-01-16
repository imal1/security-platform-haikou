import { request } from "@/kit";

//批量添加会议成员
export const setMeetingMember = (params) => {
  const dispatchMsUrl = window.globalConfig["dispatchMsHighUrl"];
  return request.post(`${dispatchMsUrl}/meeting/meetingMember/batch`, params);
};
