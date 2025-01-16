import { observer } from "mobx-react";
import {Button, Form, Grid, Input, Modal, Pagination} from "@arco-design/web-react";
import TitleBar from "../../place-manage/component/title-bar";
import Draggable from "react-draggable";
import React, {ReactNode, useEffect, useMemo, useState} from "react";
const { Row, Col } = Grid;
import {IconDown,IconUp} from "@arco-design/web-react/icon";
import store from "../store";
import appStore from "@/store";
import {deep} from "../../../kit/util";
import { IconIconVideo, IconIconPhone} from "@arco-iconbox/react-hkzbh"

interface SecurityAreaModalProps{
  visible?: boolean;
  data?: Array<any>;
  setVisible: (val) => void;
}

const SecurityInfo = (props: SecurityAreaModalProps) => {
  const { data = [], setVisible, visible = false } = props;
  const [form] = Form.useForm();
  const [pageData, setPageData] = useState([]);
  const [row, setRow]:any = useState({})
  const [indexFlag, setIndexFlag] = useState(-1);

  useEffect(() => {
    pageData[indexFlag] && setRow(pageData[indexFlag]);
  }, [indexFlag]);

  useEffect(() => {
    if(visible && store.homePopSecurityAreaInfo){
      setPageData(store.homePopSecurityAreaInfo);
      setRow(store.homePopSecurityAreaInfo[0]);
      setIndexFlag(0);
    }
  }, [visible]);


  const oprateRowSimple = (params: { title: string; content: string }) => {
    const { title, content } = params;
    return (
        <Row gutter={[0, 20]} className={"police-row"}>
          <Col flex="100px">
            <div className="person-detail-title">{title}</div>
          </Col>
          <Col style={{ flex: "1", fontWeight:500}}>
            <div className="person-detail-content">
              {content}
            </div>
            </Col>
        </Row>
    );
  };
  const oprateRowNode = (params: { title: string; content: ReactNode }) => {
    const { title, content } = params;
    return (
        <Row gutter={[0, 20]} className={"police-row"}>
          <Col flex="100px">
            <div className="person-detail-title">{title}</div>
          </Col>
          <Col style={{ flex: "1", fontWeight:500}}>
            <div className="person-detail-content">
              {content}
            </div>
          </Col>
        </Row>
    );
  };
  // 高亮数字
  const highLightNum = (str) => {
    let txt = str;
    let numList = str?.match(/\d+/g);
    if(numList?.length > 0){
      numList.forEach(num => {
        txt = str.replace(num, `<span style="color:#38F0FD;font-weight: 500;">${num}</span>`);
      })
    }
    return txt;
  };

  const oprateRow = (params: {
    title: string;
    content: string;
    flag?: boolean;
    oprateIcon?: ReactNode;
    oprateLabel?: string;
    oprateFunc?: any;
  }) => {
    const { title, content, flag, oprateIcon, oprateLabel, oprateFunc } =
        params;
    return (
        <Row gutter={[0, 20]}>
          <Col flex="100px">
            <div className="person-detail-title">{title}</div>
          </Col>
          <Col style={{ flex: "1"}}>
            <div className="police-info">
              <Row>
                <Col style={{ flex: "1" }}>
                  <div title={content} onClick={(evt) => {
                    evt.stopPropagation();
                    oprateFunc && oprateFunc();
                  }}>
                    {content}
                    {oprateIcon}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
    );
  };


  return (
      <Modal
          style={{
            cursor: "move",
            top: 20,
            right: 20,
            margin: 0,
            position: "fixed",
            width: "388px"
          }}
          title="安保区域信息"
          visible={visible}
          footer={null}
          unmountOnExit={true}
          onCancel={() => {
            setVisible(false);
          }}
          autoFocus={false}
          focusLock={false}
          mask={false}
          afterClose={() => {}}
          className={"police-modal police-modal-info police-security-info-modal"}
          modalRender={(modal) => <Draggable bounds="parent">{modal}</Draggable>}
      >
        <div className={store.homePopSecurityAreaInfo?.length > 1 ? "security-info-modal-wrap security-info-modal-wrap-fix-height" : "security-info-modal-wrap"} key={"secu"}>
          <div className="security-info-content public-scrollbar">
            <TitleBar content={"责任区"} />
            <div className="person-info" >
              <div className="person-detail">
                {oprateRowSimple({
                  title: "责任区名称",
                  content:  row?.featureName || "-"
                })}
                {row?.contentList && row.contentList[0] && oprateRowNode({
                  title: row.contentList[0].key,
                  content: <div className="expand-toggle-wrap">
                    <div className="left-content" dangerouslySetInnerHTML={{ __html: highLightNum(row.contentList[0].value) }}></div>
                    {row?.contentList && row.contentList.length >= 2 && !row?.isExpanded && (
                        <span onClick={ () => {
                          let list  = deep(pageData);
                          let obj = list.find(i => i.id === row?.id);
                          if(obj){
                            obj.isExpanded = !obj.isExpanded;
                            setPageData(list);
                            setRow(obj);
                          }
                        } } className="right-icon">展开< IconDown className="arrow" />
                                </span>
                    )}
                  </div>
                })}
                {(row?.isExpanded || (row?.contentList && row.contentList.length< 2)) && row.contentList && row.contentList.slice(1).map((con, index) => (
                    oprateRowNode({
                      title: con.key,
                      content: <>
                        <div dangerouslySetInnerHTML={{ __html: highLightNum(con.value) }}></div>
                        <div className="expand-toggle-wrap">
                          <div className="left-content"></div>
                          {row?.isExpanded && row?.contentList && row.contentList.length >= 2 && index === row.contentList.length - 2 && (
                              <span onClick={ () => {
                                let list  = deep(pageData);
                                let obj = list.find(i => i.id === row?.id);
                                obj.isExpanded = !obj.isExpanded;
                                setPageData(list);
                                setRow(obj);
                              } } className="right-icon">收起< IconUp className="arrow" />
                                        </span>
                          )}
                        </div>
                        {/*警力<span style={{color:"#38F0FD",fontWeight: 500}}>57</span>人*/}
                      </>,
                    })
                ))}
              </div>
            </div>
            {row?.workGroupDeviceVOS && row.workGroupDeviceVOS?.length>0 && <TitleBar content={"工作组"} />}
            {row?.workGroupDeviceVOS && row.workGroupDeviceVOS?.length>0 &&
              row.workGroupDeviceVOS.map(item => (
                  <div className="person-info" key={item.id}>
                    <div className="person-detail">
                      {oprateRowSimple({
                        title: "工作组名称",
                        content: item.groupName || "-",
                      })}
                      {oprateRowSimple({
                        title: "责任单位",
                        content: row.responsibleUnitNames || "-",
                      })}
                      {oprateRowSimple({
                        title: "组长姓名",
                        content: item.groupLeaderName || "-",
                      })}
                      {oprateRow({
                        title: "执法仪",
                        content: item.deviceBwcName || "-",
                        oprateIcon: item.deviceBwcName ? (
                            <IconIconVideo  className="control-icon" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}}/>
                        ) : (
                            ""
                        ),
                        oprateFunc: () => {
                          store.changeState({
                            deviceVisible: true,
                            deviceCurrent: { gbid: item.deviceBwcCode, name: item.deviceBwcName },
                            onlyPlay: true,
                          });
                        },
                      })}
                      {oprateRow({
                        title: "对讲机",
                        content: item.devicePttName || "-",
                        oprateIcon: item.devicePttCode ? (
                            <IconIconPhone className="control-icon" onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
                        ) : (
                            ""
                        ),
                        oprateFunc: () => {
                          appStore.getLayerServiceQuery(
                              item.devicePttCode,
                              store.viewer
                          );
                        },
                      })}
                      {oprateRowSimple({
                        title: "警务通",
                        content: item.devicePadName || "-",
                      })}
                      {(item.policeTotal || item.auxiliaryPoliceTotal || item.policeAidTotal || item.securityStaffTotal) && oprateRowNode({
                        title: "警务人员",
                        content: <>
                          <div>民警<span style={{color:"#38F0FD",fontWeight: 500}}>{item.policeTotal}</span>人{item.auxiliaryPoliceTotal>0 && (<>,</>)}{item.auxiliaryPoliceTotal>0 && (<span>辅警<span style={{color:"#38F0FD",fontWeight: 500}}>{item.auxiliaryPoliceTotal}</span>人</span>)}</div>
                          <div>{item.policeAidTotal>0 && (<span>援警<span style={{color:"#38F0FD",fontWeight: 500}}>{item.policeAidTotal}</span>人</span>)}{item.policeAidTotal >0 && item.securityStaffTotal>0 && (<>,</>)}{item.securityStaffTotal>0 && (<span>保安<span style={{color:"#38F0FD",fontWeight: 500}}>{item.securityStaffTotal}</span>人</span>)}</div>
                        </>,
                      })}
                    </div>
                  </div>
              ))
            }
          </div>
          {pageData?.length > 1 && (
              <div className="security-info-turn-page">
                {pageData.map((item, index) =>(
                    <span key={item.id} className={index === indexFlag ? 'active':''} onClick={()=> {
                      setIndexFlag(index);
                    } }>{index+1}</span>
                ))}
              </div>
          )}
        </div>
      </Modal>
  );
};

export default observer(SecurityInfo);
