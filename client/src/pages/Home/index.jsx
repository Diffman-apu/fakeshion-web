import React, { useEffect, useState } from 'react'
import HomeIndex from './HomeIndex'
import HomeSearch from './HomeSearch'
import HomeProfile from './HomeProfile'
import { TabBar } from 'antd-mobile'
import { useNavigate, Routes, Route, useLocation, Navigate } from 'react-router-dom'

import './index.scss'
import { connect } from 'react-redux'
import UserFeeds from './UserFeeds'
import MsgBar from '../Message/MsgBar'
import NotificationBar from '../Message/NotificationBar'
import OtherProfile from './OtherProfile'
import RecommendFeeds from './HomeSearch/Recommends/RecommendFeeds'


function Bottom( props ) {
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location
    const { currentUser, unreadMsgCnt} = props

    function setRouteActive(value) {
        navigate(value, { replace: false })
        // console.log("currentUser", currentUser)
    }

    const tabs = [
        {
            key: '/home/homeIndex',
            title: '首页',
            icon: 'icon-home',
        },
        {
            key: '/home/homeSearch',
            title: '搜索',
            icon: 'icon-search',
        },
        {
            key: '/camera',
            title: '拍摄',
            icon: 'icon-camera',
        },
        {
            key: '/home/messageBar',
            title: '消息',
            icon: 'icon-message',
        },
        
        {
            key: '/home/homeProfile',
            title: '我的',
            icon: 'icon-profile',
        },
    ]

    return (
        <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
            {tabs.map(item => (
                <TabBar.Item 
                    key={item.key} 
                    icon=
                        {
                            <i className={`iconfont ${item.icon}`}>
                                {
                                    item.icon === 'icon-message' && unreadMsgCnt > 0 &&
                                    <div className="unreadMsgCnt">{unreadMsgCnt}</div>
                                }
                            </i>
                        } 
                    title={item.title} 
                />
            ))}
        </TabBar>
    )
}



function Home(props) {
    const {currentUser} = props
    const [unReadCnt, setUnReadCnt] = useState(0)


    useEffect(() => {
        let unReadNum = 0
        for (let i = 0; i < props.chats.length; i++) {
            const chatState = props.chats[i];
            unReadNum = unReadNum + chatState.unreadMsgCnt
        }
        setUnReadCnt(unReadNum)
    
    }, [props.chats])
    
    return (
        <div className='home'>
            {/* 这里是Home组件~ */}
            {/* <div className="home-body"> */}
                <Routes>
                    <Route path='/homeIndex/*' element={<HomeIndex />}></Route>
                    <Route path='/homeSearch/*' element={<HomeSearch />}></Route>
                    <Route path='/messageBar' element={<MsgBar />}></Route>
                    <Route path='/notificationBar' element={<NotificationBar />}></Route>
                    <Route path='/homeProfile' element={<HomeProfile />}></Route>
                    <Route path='/otherProfile/:userId' element={<OtherProfile />}></Route>
                    <Route path='/userPosts/:userId/*' element={<UserFeeds />}></Route>
                    <Route path='/recommendPosts/*' element={<RecommendFeeds />}></Route>
                    <Route path='/' element={<Navigate to={'/home/homeIndex'} />}></Route>
                </Routes>
            {/* </div> */}

            <Bottom currentUser={currentUser} unreadMsgCnt={props.unreadMsgCnt}/>
        </div>
    )
}


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    chats: store.userState.chats,
    unreadMsgCnt: store.userState.unreadMsgCnt,

})

export default connect(mapStateToProps, null)(Home)


