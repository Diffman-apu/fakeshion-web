import React, { useState, useEffect, useContext, useRef, createContext, useCallback } from "react";
import { connect, useDispatch } from "react-redux";
import { TypeMap, stringify, timeDifference, timeFmtForMsg, timeFormat } from "../../../util";
import * as api from '../../../api'
import './index.scss'
import { LIVE_NOTIFICATION_CHANGE, USERS_ADD_CHANGE, USER_FOLLOWINGS_STATE_CHANGE, USER_NOTIFICATIONS_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from "../../../redux/constants";
import { useNavigate } from "react-router-dom";
import { Button, NavBar } from "antd-mobile";
import { userWsContext } from "../../../App";
import { followUser, getNotifications, getUser, sendNotification, updateNotification } from "../../../redux/actions/user";
import { getUserPosts } from "../../../redux/actions/posts";

const map = new TypeMap().map;

const NotificationBar = (props) => {

    const [notificationList, setNotificationList] = useState([])
    const [selectedNotification, setSelectedNotification] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userWs = useContext(userWsContext)

    useEffect(() => {
        if (props.currentUser) {
            dispatch(getNotifications())
            dispatch(getUserPosts(props.currentUser._id))
        }


    }, [props.currentUser])



    useEffect(() => {
        const list = props.notifications.map((notification) => {
            let relatedPost
            if (notification.relatedPostId) {
                relatedPost = props.userPosts.find(post => post._id === notification.relatedPostId)
            }
            let relatedUser
            if (notification.relatedUid) {
                relatedUser = props.users.find(user => user._id === notification.relatedUid)
                if (!relatedUser) {
                    dispatch(getUser(notification.relatedUid))
                }
            }

            let isFollowing
            if (notification.type === 'follow') {
                isFollowing = props.followings.some((id) => id === notification.relatedUid)
                console.log("&&&&&&&&&&&&&&&&&&&&&&:", isFollowing, notification.relatedUid, props.followings)
            }
            return { ...notification, relatedUser, relatedPost, isFollowing }
        })

        console.log("最新的chatlist:", list)
        setNotificationList(list)
    }, [props.notifications, props.users, props.userPosts, props.followings])


    // useEffect(() => {
    //     if (selectedChat) {
    //         setTimeout(() => {
    //             navigate(`/conversation/${selectedChat.otherUser._id}`)
    //         }, 100)
    //     }
    // }, [selectedChat])

    // 点击 通知项 时
    function onClickNotify(notification) {
        setSelectedNotification(notification)
        const { type, uid, relatedUid, relatedUser, relatedPostId, relatedCommentId, _id } = notification
        console.log("================", notification)
        dispatch(updateNotification(_id, { isRead: true }))

        setTimeout(() => {
            switch (type) {
                case 'follow':
                    navigate(`/home/homeProfile/${relatedUid}`)
                    break;
                case 'like':
                    navigate(`/home/userPosts/${uid}`, {
                        state: {
                            postId: relatedPostId,
                        }
                    })
                    break;
                case 'comment':
                    navigate(`/home/userPosts/${uid}/comments/${relatedPostId}/`, {
                        state: {
                            commentId: relatedCommentId,
                        }
                    })
                    break;
                default:
                    break;
            }
        }, 100)
    }


    // 点击【关注】或 【取消关注】 按钮
    function onFollow(e, relatedUid, isFollowing) {
        e.nativeEvent.stopImmediatePropagation()

        dispatch(followUser(relatedUid))

        if (!isFollowing) {
            const notification = {
                uid: relatedUid,
                relatedUid: props.currentUser._id,
                isRead: false,
                createTime: new Date().toISOString(),
                content: '刚刚关注了你~',
                type: 'follow'
            }
            dispatch(sendNotification(relatedUid, userWs, notification))
        }
    }


    function onClickUser(e, relatedUid) {
        e.nativeEvent.stopImmediatePropagation()
        navigate(`/home/homeProfile/${relatedUid}`)
    }


    return (
        <div className="notifyBar">
            <NavBar back='返回' onBack={()=>navigate(-1)} className="menu-title">我的通知</NavBar>
            {/* <i className='iconfont icon-arrow-left' onClick={() => navigate(-1)}></i> */}
            {/* <h2 className="menu-title">我的通知</h2> */}
            <ul className="notify-list">
                {
                    notificationList.map(
                        (item, index) => {
                            const curTs = new Date(new Date().toLocaleDateString()).getTime()
                            const { _id, relatedUser, relatedPost, content, createTime, isRead, type, isFollowing, relatedUid } = item
                            const lastMsgTs = new Date(createTime).getTime()
                            const timeStr = timeDifference(lastMsgTs, curTs)
                            console.log("notify为：", item )

                            return (
                                <li key={index} id={index} className={`notify-item ${_id === selectedNotification?._id ? 'selectedNotification' : ''}`} onClick={() => onClickNotify(item)}>
                                    <div className="left">
                                        <img src={relatedUser?.avatar} alt="" onClick={(e) => { onClickUser(e, relatedUid) }} />
                                        {!isRead && <div className="notify"></div>}
                                    </div>

                                    <div className="middle">
                                        <p className="name">{relatedUser?.username}</p>
                                        <span className="content">{content}</span>
                                        <span className="time">{timeStr}</span>

                                    </div>

                                    <div className="right">
                                        {
                                            type === 'follow' && (
                                                <Button
                                                    className={`action-btn ${isFollowing ? 'followedBtn' : 'unFollowedBtn'}`}
                                                    onClick={(e) => onFollow(e, item.relatedUid, isFollowing)}
                                                    fill={isFollowing ? 'outline' : 'solid'}
                                                    color="primary"
                                                    size="mini"
                                                >
                                                    {isFollowing ? '已关注' : '关注'}
                                                </Button>
                                            )
                                        }

                                        {
                                            ['like', 'comment'].includes(type) && (
                                                <img src={relatedPost?.imageURL} alt="" />
                                            )
                                        }
                                    </div>
                                </li>
                            )

                        }
                    )
                }
            </ul>

        </div>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    userPosts: store.userState.userPosts,
    chats: store.userState.chats,
    users: store.usersState.users,
    notifications: store.userState.notifications,
    feeds: store.usersState.feeds,
    followings: store.userState.followings
})
export default connect(mapStateToProps, null)(NotificationBar);

