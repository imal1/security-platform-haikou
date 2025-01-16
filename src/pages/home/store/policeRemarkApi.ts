import { request, getServerBaseUrl } from "@/kit";

// 警情类型下拉选项 http://10.68.8.24/kmeta-security-server/police/instance/thingType
export const policeTypeEnum = () => {
  return request.get("/police/instance/thingType", {});

};

// 添加警情实例 http://10.68.8.24/kmeta-security-server/police/instance/add
export const addPoliceRemark = (params) => {
  return request.post(`/police/instance/add`, params);
};

// 编辑警情 /kmeta-security-server/police/instance/update
export const editPoliceRemark = (params) => {
  return request.post(`/police/instance/update`, params);
};

// 更新状态  http://10.68.8.24/kmeta-security-server/police/instance/changeStatus
export const modifyPoliceRemarkStatus = (params) => {
  return request.post(`/police/instance/changeStatus`, params);
};

//删除 http://10.68.8.24/kmeta-security-server/police/instance/delete/{id}
export const deletePoliceRemark = (id) => {
  return request.delete(`/police/instance/delete/${id}`);
}

// 查询列表 http://10.68.8.24/kmeta-security-server/police/instance/pages
export const getPoliceRemarkList = (params) => {
  if(params.dealStatus?.length === 0){
    return Promise.resolve({
      data: []
    })
  }else{
    return request.post(`/police/instance/page`, params);
  }
};

// 根据坐标点查询责任安保去信息  http://10.68.8.24/kmeta-security-server/device/relationAreaByPoliceInstance
export const getSecurityInfoByPos = (params) => {
  return request.post(`/device/relationAreaByPoliceInstance`, params);
};
