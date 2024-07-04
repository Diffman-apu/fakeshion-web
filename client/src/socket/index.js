import { parse, stringify, TypeMap } from "../util";
import store from "../redux/store";
import { LIVE_MESSAGE_CHANGE, LIVE_NOTIFICATION_CHANGE, USER_CHATS_STATE_CHANGE } from "../redux/constants";

const map = new TypeMap().map;

class Ws {
  constructor(url) {
    this.ws = new WebSocket(url);

    // 断线重连
    this.url = url;
    this.lockReconnect = false;
    this.timer = null;
    this.limit = 0;

    // 心跳检测
    this.heartbeatTimer = null;
    this.receiveTimer = null;
  }

  initWs() {
    // 连接成功, 开始通讯
    this.ws.onopen = () => {
      this.checkHeartbeat();
      this.limit = 0;
    }

    // 客户端接收服务端发送的消息
    this.ws.onmessage = (event) => {
      const data = parse(event.data);
      console.log("客户端接收服务端发送的消息类型: ", map.get(data.type.toString()))
      switch (map.get(data.type.toString())) {
        // case 'UPDATE_MESSAGE_LIST':
        //   updateMEssageList(data);
        //   break;
        // case 'UPDATE_CHAT_LIST':
        //   updateChatList(data);
        //   break;
        case 'BROADCAST_MESSAGE':
          receiveMessage(data);
          break;
        case 'BROADCAST_NOTIFICATION':
          receiveNotification(data);
          break;
        case 'PONG':
          this.resetHeartbeat();
          break;
        case 'TASK':
          this.timedTask();
          break;
        default:
          break;
      }
    }

    // 连接关闭后的回调函数
    this.ws.onclose = (event) => {
      console.log('已断开连接', event);
      this.reconnect();
    }

    // 捕获错误
    this.ws.onerror = () => {
      console.log('出错了');
      this.reconnect();
    }
  }

  close() {
    this.send(stringify({ type: map.get('LOGOUT'), data: this.getUserInfo() }));
    this.ws.close();
  }

  send(data) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(data);
    }
  }

  reconnect() {
    if (this.lockReconnect) return;
    this.lockReconnect = true;

    clearTimeout(this.timer);
    if (this.limit < 12) {
      this.timer = setTimeout(() => {
        this.ws = new WebSocket(this.url);
        this.initWs();
        this.lockReconnect = false;
        this.limit += 1;
      }, 5000)
    }
  }

  checkHeartbeat() {
    this.ws.heartbeatTimer = setTimeout(() => {
      this.send(stringify({ type: map.get('PING'), data: 'ping' }));
      this.ws.receiveTimer = setTimeout(() => {
        this.ws.close();
      }, 20000);
    }, 20000);
  }

  resetHeartbeat() {
    this.ws.heartbeatTimer && clearTimeout(this.ws.heartbeatTimer);
    this.ws.receiveTimer && clearTimeout(this.ws.receiveTimer);
    this.checkHeartbeat();
  }

  timedTask() {
    this.send(stringify({ type: map.get('REPLY'), data: this.getUserInfo() }));
  }

  getUserInfo() {
    const userInfo = store.getState().userState.currentUser;
    return userInfo?.id ? userInfo : undefined;
  }
}



// 更新消息列表
const updateMEssageList = (data) => {
  store.dispatch({
    type: 'UPDATE_MESSAGE_LIST',
    messageList: data.data,
  });
}

// 更新消息列表
const updateChatList = (data) => {
  console.log("返回的chatlist是:", data.data)
  store.dispatch({
    type: USER_CHATS_STATE_CHANGE,
    data: data.data,
  });
}


// 接收消息
const receiveMessage = (data) => {
  console.log("收到了UPDATE_MESSAGE")
  store.dispatch({
    type: LIVE_MESSAGE_CHANGE,
    data: data.data,
  });
}

// 接收通知
const receiveNotification = (data) => {
  console.log("收到了UPDATE_NOTIFICATION")
  store.dispatch({
    type: LIVE_NOTIFICATION_CHANGE,
    data: data.data,
  });
}


export default Ws;
