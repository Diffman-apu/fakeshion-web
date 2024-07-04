import React, { useContext, useEffect, useRef, useState } from 'react'
import './index.scss'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, Button, Mask } from 'antd-mobile'
import { connect, useDispatch } from 'react-redux'
import Share from '../../Message/Share'
import Comment from './Comment'
import * as api from '../../../api'
import { USER_STATE_CHANGE } from '../../../redux/constants'
import { userWsContext } from '../../../App'
import { stringify, TypeMap, RetinaRegex } from "../../../util";
import { followUser, getNotifications, getUser, getUsers, sendNotification } from '../../../redux/actions/user'
import { getPosts, likePost } from '../../../redux/actions/posts'
import { getChats } from '../../../redux/actions/chats'
import PostFeeds from './PostFeeds'
const map = new TypeMap().map;


function HomeIndex(props) {
    const navigate = useNavigate()
    const [feeds, setFeeds] = useState(props.feeds)
    const userWs = useContext(userWsContext)
    const feedsRef = useRef()
    const dispatch = useDispatch()
    const {pathname} = useLocation()
    console.log("AAAAAAAAAAAAAAAA", useLocation())

    const isLogged = props.currentUser ? true : false


    useEffect(() => {
        dispatch(getPosts())
        dispatch(getUsers())
        dispatch(getNotifications())
        dispatch(getChats())
    }, [])

    useEffect(() => {
        if (props.feeds && props.users) {
            const newFeeds = props.feeds?.map((post) => {
                const user = props.users?.find((user) => user._id === post.creatorId)

                if (user === undefined) {
                    dispatch(getUser(post.creatorId))
                }
                else {
                    return { ...post, user }
                }
            })
            console.log("newFeeds:", newFeeds)
            setFeeds(newFeeds)
        }

    }, [props.feeds, props.users])

    function handleLogOut() {
        // 退出登录
        userWs.send(stringify({
            type: map.get('LOGOUT'),
            data: props.currentUser,
        }));
        userWs.close()
        if (localStorage.getItem('profile')) {
            localStorage.setItem('profile', '')
        }
        dispatch({ type: USER_STATE_CHANGE, data: undefined });
    }

    function handleLogIn() {
        navigate('/login')
    }

    function handleAvatarClick() {
        if (isLogged) {
            navigate('/home/homeProfile')
        }
    }

    

    return (
        // 首页，包含头部 + 信息流
        <div className='home-index'>
            {/* 头部区域 */}
            <div className="header">
                <img src="/images/logo2.png" alt="" className='logo' />
                <div className="side">
                    <Avatar src={props.currentUser?.avatar} className='home-avatar' onClick={handleAvatarClick}></Avatar>
                    <Button className='log-btn' onClick={isLogged ? handleLogOut : handleLogIn}>{isLogged ? 'LogOut' : 'LogIn'}</Button>
                    <i className='iconfont icon-bell' onClick={() => navigate('/home/notificationBar')}>
                        {
                            props.currentUser && props.unreadNotifyCnt > 0 &&
                            <div className="notifyIcon">{props.unreadNotifyCnt}</div>
                        }
                    </i>
                </div>
            </div>


            {/* 信息流推送区域 */}
            <PostFeeds data={feeds} ref={feedsRef} pathName={pathname} />
            

            <div className="unLoginHint" style={{ display: isLogged ? 'none' : 'block' }}>
                <span className='txt'>终于等到你，快来登录吧~~</span>
                <span className='loginBtn'>马上登录</span>
            </div>

            <Routes>
                <Route path='/comments/:postId' element={<Comment />}></Route>
                <Route path='/share/:postId' element={<Share />}></Route>
            </Routes>
        </div>
    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    feeds: store.usersState.feeds,
    users: store.usersState.users,
    unreadNotifyCnt: store.userState.unreadNotifyCnt,
    followings: store.userState.followings,
})


export default connect(mapStateToProps, null)(HomeIndex)
