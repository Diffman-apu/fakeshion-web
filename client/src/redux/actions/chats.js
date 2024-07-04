import * as api from "../../api";
import { USER_CHATS_STATE_CHANGE, USER_CHAT_STATE_CHANGE } from "../constants";
import { TypeMap, stringify } from "../../util";
const map = new TypeMap().map;

export const getChat = (id) => async (dispatch) => {
    try {
        const { data } = await api.fetchChat(id)
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 服务端返回的chat为：", data)
        dispatch({
            type: USER_CHAT_STATE_CHANGE,
            data: data,
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const getChats = () => async (dispatch) => {
    try {
        const { data: chats } = await api.fetchChats()
        console.log("服务端返回的chats是：", chats)
        dispatch({
            type: USER_CHATS_STATE_CHANGE,
            data: chats,
        });
    } catch (error) {
        console.log(error.message);
    }
};



export const sendMsg = (id, ws, message) => async (dispatch) => {
    try {
        const { data: chat } = await api.sendMsg(id, message)
        dispatch({ type: USER_CHAT_STATE_CHANGE, data: chat })
        ws.send(stringify({
            type: map.get('SEND_MESSAGE'),
            data: message
        }))

    } catch (error) {
        console.log(error.message);
    }
};


