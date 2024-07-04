import WebSocket, { WebSocketServer } from "ws";
import schedule from "node-schedule";
import { parse, stringify, Type } from "../util/index.js";
import url from 'url'
import Chats from "../model/Chat.js";
import Users from "../model/Users.js";

const wss = new WebSocketServer({ port: 8080 });
let wsMap = new Map();

// send方法
const send = (ws, data) => {
  ws.send(stringify(data));
}

// 广播
const broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      send(client, data);
    }
  });
}


// 用户登出
const logout = (ws, data) => {
  if (!data) return;
  wsMap.delete(data._id)
}


// 转发 通知(notification)
const sendNotification = async (ws, data) => {
  const { relatedUid: creatorId, uid: receiverId, content } = data
  const creator = await Users.findById(creatorId, { followings: 0 })
  const newNotify = { ...data, creator }

  const receiveWs = wsMap.get(receiverId)


  // 转发最新通知 给消息接收者
  if (receiveWs) {
    send(receiveWs, {
      type: 18,
      data: newNotify,
      code: 0,
    });
  }


}

// 转发 消息(msg) 
const sendMessage = async (ws, data) => {
  const { chatId, creatorId, receiverId, content, tag, type } = data
  const creator = await Users.findById(creatorId, { followings: 0 })
  const newMsg = { ...data, creator }

  const newChat = await Chats.findById(chatId)
  const receiverChatList = await Chats.find({ users: { $in: [receiverId] } }, { messages: 0 }).sort({ lastMessageTime: -1 });

  const receiveWs = wsMap.get(receiverId)
  console.log("wss中最新消息的收发两端, creator:", ws, 'receivor:', receiveWs)

  // 转发最新条消息及 chatItem 给消息接收者
  if (receiveWs) {
    send(receiveWs, {
      type: 14,
      data: { newChat, newMsg },
      code: 0,
    });

    send(receiveWs, {
      type: 15,
      data: receiverChatList,
      code: 0,
    });

  }

}


// 心跳检查
const heartbeat = (ws) => {
  send(ws, {
    type: 21,
    data: 'pong',
    code: 0,
  });
}

// 定时任务
const scheduleCronstyle = () => {
  schedule.scheduleJob('0 0 * * * *', () => {
    // userList = [];
    broadcast({
      type: 23,
      data: 'timed task',
      code: 0,
    });
  });
}
scheduleCronstyle();

wss.on('open', () => {
  console.log('connected');
});

wss.on('close', () => {
  console.log('disconnected');
});

wss.on('connection', (ws, req) => {
  const params = url.parse(req.url, true).query
  if (params.userId) {
    wsMap.set(params.userId, ws)
  }


  // console.log("***************** 此时wss所有客户端连接为: ", wss.clients,'wsMap为:', wsMap)
  ws.on('message', (message) => {
    const { type, data } = parse(message);
    switch (Type[type]) {
      case 'LOGOUT':
        logout(ws, data);
        break;
      case 'SEND_MESSAGE':
        sendMessage(ws, data);
        break;
      case 'SEND_NOTIFICATION':
        sendNotification(ws, data);
        break;
      case 'PING':
        heartbeat(ws);
        break;
      case 'REPLY':
        if (!data) return;
        break;
      default:
        break;
    }
  });
});

