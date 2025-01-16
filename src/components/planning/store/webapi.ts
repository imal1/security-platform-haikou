import { request } from "@/kit";
// 获取行政规划数据
export const getJurisdictionArea = (params) => {
  return request.post("/jurisdiction/areas", params);
};