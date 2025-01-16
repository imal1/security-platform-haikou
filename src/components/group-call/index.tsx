import { delLink, delScriptTag, loadJS, loadLink } from "@/kit";
import { Button, Message, Modal, Spin } from "@arco-design/web-react";
import classNames from "classnames";
import { ReactNode, memo, useEffect, useRef, useState } from "react";
import "./index.less";
import * as webApi from "./webapi";
import store from "../../pages/home/store";
import { configure } from "mobx";
configure({ isolateGlobalState: true });
import localChat from "@/assets/img/local-chat.png";
interface GroupCallProps {
  className?: string;
  visible: boolean;
  setVisible: (val) => void;
  title?: ReactNode;
  onLoad?: (res) => void;
  params?: any;
}

const GroupCall = (props: GroupCallProps) => {
  const {
    className,
    visible,
    setVisible,
    title = "组群通话",
    onLoad,
    params = {},
  } = props;
  const [meetingId, setMeetingId] = useState<string>("");
  const [meetingIns, setMeetingIns] = useState(null);
  const dispatchMsUrl = window.globalConfig["dispatchMsUrl"];
  const dispatchVersion = window.globalConfig["dispatchVersion"] || "v3.2.0";
  const dispatchUserName = window.globalConfig["dispatchUserName"] || "";
  const cssUrl = `${dispatchMsUrl}/static/kConference/theme/blue/index.css`;
  const vueUrl = `${dispatchMsUrl}/static/kConference/vue.min.js`;
  const kChatUrl = `${dispatchMsUrl}/static/kchat/KChat-${dispatchVersion}.js`;
  const configUrl = `${dispatchMsUrl}/static/kConference/kd-dispatch-conference.config.js`;
  const conferenceUrl = `${dispatchMsUrl}/static/kConference/kd-dispatch-conference.js?v=${new Date().getTime()}`;
  const meetingTimerRef = useRef(null);
  const [meetingState, setMeetingState] = useState<boolean>(false);
  const [meetingTime, setMeetingTime] = useState<string>("00:00");
  const [meetingMembers, setMeetingMembers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // console.log('visible', visible);
    // visible && initial();
    return () => {
      onCancel();
    };
  }, []);
  useEffect(() => {
    // console.log('meetingMember',params.meetingMember);
    if (!visible) {
      return;
    }
    if (params.meetingMember.length === 1) {
      if (!dispatchUserName) {
        return Message.error("未配置用户信息，请检查!");
      }
      const tempMeetingMember = [
        { id: dispatchUserName, type: "LOCAL_KEDACHAT", index: 0 },
        {
          id: params.meetingMember[0].gbid || params.meetingMember[0].id,
          type: "TEMP_GB",
          index: 1,
        },
      ];
      setMeetingMembers(tempMeetingMember);
      initial(tempMeetingMember);
    }
    if (params.meetingMember.length > 1) {
      const tempMeetingMember = params.meetingMember.map((item, index) => {
        item.type = "TEMP_GB";
        item.index = index;
        return item;
        // if (item.type?.toLocaleUpperCase() === "BWC") {
        //   item.type = "TEMP_GB";
        //   item.index = index;
        //   return item;
        // }
        // if (item.type?.toLocaleUpperCase() === "PTT") {
        //   item.type = "TEMP_PTT";
        //   item.index = index;
        //   return item;
        // }
        // if (item.type?.toLocaleUpperCase() === "PAD") {
        //   item.type = "TEMP_KEDACHAT";
        //   item.index = index;
        //   return item;
        // }
      });
      setMeetingMembers(tempMeetingMember);
      initial(tempMeetingMember);
    }
  }, [params.meetingMember]);

  useEffect(() => {
    if (params.addMeetingMember.length > 0) {
      // console.log('addMeetingMember',params.addMeetingMember);
      const result = params.addMeetingMember.filter(
        (item) => !meetingMembers.some((val) => val.id === item.id)
      );
      if (result.length === 0) {
        return Message.warning("请勿重复添加！");
      }
      if (meetingMembers.length + result.length > 25) {
        return Message.warning("组会人数超过25人!");
      }
      const tempMeetingMember = result.map((item) => {
        if (item.type.toLocaleUpperCase() === "BWC") {
          item.type = "TEMP_GB";
          return item;
        }
        if (item.type.toLocaleUpperCase() === "PTT") {
          item.type = "TEMP_PTT";
          return item;
        }
        if (item.type.toLocaleUpperCase() === "PAD") {
          item.type = "TEMP_KEDACHAT";
          return item;
        }
      });
      setMeetingMembers(meetingMembers.concat(tempMeetingMember));
      // setMeetingMemberAdd([{ "id": "32057100001327000042", "type": "TEMP_GB" }], meetingId)
      if (meetingId) {
        setMeetingMemberAdd(tempMeetingMember, meetingId);
      }
    }
  }, [params.addMeetingMember]);

  const padNum = (num: number) => {
    return num < 10 ? "0" + num : num;
  };
  const startTimer = () => {
    let seconds = 0;
    meetingTimerRef.current = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      setMeetingTime(`${padNum(minutes)}:${padNum(remainingSeconds)}`);
      if (!meetingState) {
        setMeetingTime("00:00");
        clearInterval(meetingTimerRef.current);
      }
    }, 1000);
  };

  useEffect(() => {
    if (meetingState) {
      const fn = () => {
        store.addOrInvite = 1;
        if (store.memberType == "police") {
          store.selectMemberVisible = true;
        } else {
          store.selectMemberDeviceVisible = true;
        }
        // setMeetingMemberAdd([{ "id": "32057100001327000042", "type": "TEMP_GB", "index": 3 }], meetingId)
        // setMeetingMemberAdd([{"id":"avcs010","type":"TEMP_KEDACHAT","index":3}], meetingId)
      };
      insertInviteMemberBtn(fn);
      meetingTimerRef.current && clearInterval(meetingTimerRef.current);
      setMeetingTime("00:00");
      startTimer();
    }
    return () => {
      meetingTimerRef.current && clearInterval(meetingTimerRef.current);
      setMeetingTime("00:00");
    };
  }, [meetingState]);
  const initial = (meetingMembersData) => {
    try {
      const loadDependencies = () => {
        clearLink();
        // 加载 CSS
        loadLink(cssUrl);
        // 加载 JS 依赖项
        loadJS(vueUrl, () => {
          loadJS(kChatUrl, () => {
            loadJS(configUrl, () => {
              loadJS(conferenceUrl, () => {
                createMeet(meetingMembersData);
              });
            });
          });
        });
      };

      loadDependencies();
    } catch (error) {
      console.error("加载脚本时出错", error);
    }
  };
  const clearLink = () => {
    [vueUrl, kChatUrl, configUrl, conferenceUrl].forEach((item) =>
      delScriptTag(item)
    );
    delLink(cssUrl);
  };
  const createMeet = (meetingMembersData) => {
    try {
      if (window["kdDispatchConference"]) {
        const options = {
          access_type: 2,
          key: window.globalConfig["Apikey"],
          windowTools: [],
          bottomTools: ["call", "hangup", "mute", "silence"],
          devices: meetingMembersData,
          layout: "AUTO",
          // [
          // {id: '10.67.11.64', type: 'LOCAL_KEDACHAT', index: 0},
          // {
          //   id: "32057100001327000042",
          //   type: "TEMP_GB",
          //   index: 0,
          // },
          // {
          //   id: "32057100001327000049",
          //   type: "TEMP_GB",
          //   index: 0,
          // },
          // {
          //   id: "32050700001320000021",
          //   type: "TEMP_GB",
          //   index: 1,
          // },
          // { "id": "avcs009", "type": "LOCAL_KEDACHAT", "index": 2 }
          // ],
          ptz_lock_function: 0,
          canHandle: true,
          theme: "blue",
          isDemo: true,
          canCall: false,
          visibleHttpsTips: false,
          ...params,
        };
        closeMeet();
        // 创建组会
        const meetingInsObj = new window["kdDispatchConference"].createMeeting(
          "#groupCallCon",
          options,
          (data, name) => {
            // data 回调数据  name 回调事件名称
            // console.log("回调数据", data, name);
            // console.log(meetingInsObj, "meetingInsObj");
            if (name === "meetingLoad") {
              // data.groupId 用于还原调度组组件或者调用http高级接口
              // console.log("组件Id", data.groupId);
              setMeetingIns(meetingInsObj);
              setMeetingId(data.groupId);
              setLoading(false);
            }
            // if (name === 'callSuccess') {

            // }
            // if (name === 'callError') {
            //   removeInviteMemberBtn();
            //   onCancel();
            // }
            if (name === "kMediaOnload") {
              setMeetingState(true);
            }

            if (name === "statusChange" && data.status === 13) {
              removeInviteMemberBtn();
              onCancel();
            }

            onLoad &&
              onLoad({
                meetingIns: meetingInsObj,
                data,
                name,
              });
          }
        );
      } else {
        console.error("kdDispatchConference 未定义");
      }
    } catch (error) {
      Message.error("发起会议报错，请检查！");
      onCancel();
    }
  };
  //添加入会
  const setMeetingMemberAdd = async (deviceList, meetingId) => {
    try {
      const params = {
        groupId: meetingId,
        deviceList: deviceList,
        meetMember: true,
      };
      let res = await webApi.setMeetingMember(params);
    } catch (error) {
      console.log(error);
    }
  };
  const insertInviteMemberBtn = (fn) => {
    const inviteBtnStr = `<div class="item" style="order: 0;"><span class="out on"><span class="icon avcsfont avcsfont-add"></span></span><span>添加入会</span></div>`;
    const domPaser = new DOMParser();
    const domNode = domPaser.parseFromString(inviteBtnStr, "text/html");
    const inviteBtnDom = domNode.querySelector(".item");
    inviteBtnDom.addEventListener("click", fn);
    const container = document.querySelector(".btnList").innerHTML;
    if (!container.includes("avcsfont-add")) {
      document.querySelector(".btnList").lastChild["style"].order = 1;
      document.querySelector(".btnList").append(inviteBtnDom);
    }
  };
  const removeInviteMemberBtn = () => {
    const container = document.querySelector(".btnList");
    container && container.lastChild.remove();
  };
  const closeMeet = () => {
    try {
      if (!meetingIns) return;
      meetingIns.closeMeeting();
      setMeetingIns(null);
      meetingTimerRef.current && clearInterval(meetingTimerRef.current);
      setMeetingTime("00:00");
      setMeetingState(false);
    } catch (error) {
      console.error("关闭会议时出错", error);
    }
  };
  const onCancel = () => {
    closeMeet();
    clearLink();
    store.selectedMembers = [];
    store.addSelectedMemberKeys = [];
    setMeetingMembers([]);
    setVisible(false);
  };

  return (
    <Modal
      title={
        <div>
          <span className="call-modal-title">{title}</span>
          {meetingState && (
            <Button
              type="outline"
              size="small"
              className="call-modal-title-time"
            >
              {`进行中 ${meetingTime}`}
            </Button>
          )}
        </div>
      }
      mask={false}
      visible={visible}
      className={classNames("group-call-wrap", className)}
      onCancel={onCancel}
      footer={null}
      autoFocus={false}
      focusLock={true}
    >
      <Spin className={"map-content-spin"} tip={"拼命加载中"} loading={loading}>
        {" "}
        {visible && <div className="group-call-con" id="groupCallCon"></div>}
      </Spin>
    </Modal>
  );
};
const GroupCallBox = memo(GroupCall);
export default GroupCallBox;
