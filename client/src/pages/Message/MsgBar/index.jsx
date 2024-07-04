import React, { useState, useEffect, useContext, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import store from "../../../redux/store";
import { timeFormat } from "../../../util";
import './index.scss'
import { useNavigate } from "react-router-dom";
import { getChats } from "../../../redux/actions/chats";
import { getUser } from "../../../redux/actions/user";
import { NavBar, SearchBar } from "antd-mobile";


export const DEV = process.env.NODE_ENV !== 'production';
const MsgBar = (props) => {

    const [chatList, setChatList] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getChats())
    }, [])

    useEffect(() => {
        if (selectedChat) {
            setTimeout(() => {
                navigate(`/conversation/${selectedChat.otherUser._id}`)
            }, 100)
        }
    }, [selectedChat])



    useEffect(() => {
        console.log("props.chats", props.chats)
        const list = props.chats.map((chat) => {
            let otherUserId;
            if (chat.users[0] === props.currentUser._id) {
                otherUserId = chat.users[1]
            }
            else {
                otherUserId = chat.users[0]
            }
            const otherUser = props.users.find(user => user._id === otherUserId)
            if (!otherUser) {
                dispatch(getUser(otherUserId))
                return
            }
            else {
                return { ...chat, otherUser }
            }
        })

        console.log("最新的chatlist:", list)
        setChatList(list)
    }, [props.chats, props.users, props.currentUser])



    return (
        <div className="msgBar">
            <h2 className="menu-title">我的消息</h2>
            <SearchBar placeholder="搜索联系人、聊天记录" />
            <ul className="user-list">
                {
                    chatList.length>0 && chatList.map(
                        (item, index) => {
                            if(!item) return
                            const { _id, otherUser, lastMessage, lastMessageTime, unreadMsgCnt, unreadUserId } = item

                            const curTs = new Date(new Date().toLocaleDateString()).getTime()
                            const lastMsgTs = new Date(lastMessageTime).getTime()

                            return <li key={index} id={index} className={`user-item ${_id === selectedChat?._id ? 'selectedChat' : ''}`} onClick={() => setSelectedChat(item)}>
                                <div className="left">
                                    <img src={otherUser.avatar} alt="" />
                                    {
                                        unreadUserId === props.currentUser._id && unreadMsgCnt > 0 && 
                                        <div className="notify">{unreadMsgCnt > 99 ? '99+' : unreadMsgCnt}</div>
                                    }
                                </div>

                                <div className="right">
                                    <div className="right-header">
                                        <span className="name">{otherUser?.username}</span>
                                        <span className="time">{timeFormat(lastMsgTs, curTs)}</span>
                                    </div>
                                    <div className="right-msg">{lastMessage}</div>
                                </div>
                            </li>
                        }
                    )
                }
            </ul>

        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
    chats: state.userState.chats,
    users: state.usersState.users,
    unreadMsgCnt: state.userState.unreadMsgCnt,

})
export default connect(mapStateToProps, null)(MsgBar);

